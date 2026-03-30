/**
 * GraphQL reverse proxy: brauzer → POST /api/graphql → kickup-api.
 * fetch() ba'zan Docker/Alpine da "fetch failed" beradi — node:http fallback (IPv4).
 */
import type { NextApiRequest, NextApiResponse } from "next";
import http from "http";
import https from "https";
import { URL } from "url";

function normalizeGraphqlUrl(raw: string): string {
  const t = raw.trim();
  return /\/graphql\/?$/i.test(t) ? t : `${t.replace(/\/$/, "")}/graphql`;
}

/** Docker ichidagi Next → bir tarmoqda kickup-api bo'lsa birinchi navbatda */
const PROXY_TIMEOUT_MS = 12_000;

function getBackendCandidates(): string[] {
  const primary =
    process.env.GRAPHQL_PROXY_TARGET?.trim() || "http://127.0.0.1:4002/graphql";
  const extra =
    process.env.GRAPHQL_PROXY_FALLBACKS?.split(",")
      .map((s) => normalizeGraphqlUrl(s))
      .filter(Boolean) || [];

  const p = normalizeGraphqlUrl(primary);
  const internalFirst = process.env.GRAPHQL_TRY_INTERNAL_FIRST === "1";
  const rest = [
    "http://kickup-api:3008/graphql",
    "http://host.docker.internal:4002/graphql",
    "http://172.17.0.1:4002/graphql",
  ];
  const merged = internalFirst
    ? [...new Set([...rest, p, ...extra])]
    : [...new Set([p, ...extra, ...rest])];
  return merged;
}

function flatHeaders(h: HeadersInit): Record<string, string> {
  const out: Record<string, string> = {};
  if (h instanceof Headers) {
    h.forEach((v, k) => {
      out[k] = v;
    });
    return out;
  }
  Object.assign(out, h as Record<string, string>);
  return out;
}

/** fetch o'rniga — Undici/DNS muammolarini chetlab o'tish */
function postWithNodeHttp(
  targetUrl: string,
  bodyStr: string,
  hdrs: Record<string, string>
): Promise<{ status: number; text: string; contentType: string }> {
  const u = new URL(targetUrl);
  const isHttps = u.protocol === "https:";
  const lib = isHttps ? https : http;
  const defaultPort = isHttps ? 443 : 80;
  const port = u.port ? Number(u.port) : defaultPort;

  return new Promise((resolve, reject) => {
    const opts: http.RequestOptions = {
      hostname: u.hostname,
      port,
      path: `${u.pathname}${u.search}`,
      method: "POST",
      headers: {
        ...hdrs,
        "Content-Length": Buffer.byteLength(bodyStr, "utf8"),
      },
      family: 4,
    };
    const req = lib.request(opts, (upRes) => {
      const chunks: Buffer[] = [];
      upRes.on("data", (c) => chunks.push(c));
      upRes.on("end", () => {
        resolve({
          status: upRes.statusCode || 500,
          text: Buffer.concat(chunks).toString("utf8"),
          contentType: String(upRes.headers["content-type"] || "application/json; charset=utf-8"),
        });
      });
    });
    req.on("error", reject);
    req.setTimeout(PROXY_TIMEOUT_MS, () => {
      req.destroy(new Error("timeout"));
    });
    req.write(bodyStr);
    req.end();
  });
}

async function tryProxy(
  target: string,
  body: string,
  headers: HeadersInit
): Promise<{ status: number; text: string; contentType: string }> {
  const hdr = flatHeaders(headers);
  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers: hdr,
      body,
      signal:
        typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
          ? AbortSignal.timeout(PROXY_TIMEOUT_MS)
          : undefined,
    });
    const text = await upstream.text();
    const contentType =
      upstream.headers.get("content-type") || "application/json; charset=utf-8";
    return { status: upstream.status, text, contentType };
  } catch (fetchErr) {
    console.warn("[api/graphql] fetch failed, trying node:http", target, fetchErr);
    return postWithNodeHttp(target, body, hdr);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      errors: [{ message: "Method Not Allowed. GraphQL faqat POST." }],
    });
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization as string;
  }
  if (req.headers.cookie) {
    headers.Cookie = req.headers.cookie as string;
  }

  const body =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});

  // Debug: match list query lar kirganda log beramiz.
  // Frontend cache ishlasa, shu requestlar soni navigatsiya paytida kamayishi kerak.
  try {
    const parsed = JSON.parse(body) as { query?: string; operationName?: string };
    const q = String(parsed.query ?? "");
    const op = String(parsed.operationName ?? "");
    const isMatchListQuery =
      /\bmatches\s*\(/.test(q) ||
      /\bmyMatches\b/.test(q) ||
      /\bmyJoinedMatches\b/.test(q) ||
      /\bupcomingMatches\b/.test(q) ||
      /\bsearchMatches\b/.test(q);
    const debug =
      process.env.NEXT_PUBLIC_DEBUG_MATCH_LIST_CACHE === "true" ||
      process.env.NEXT_PUBLIC_DEBUG_GRAPHQL === "true";
    if (debug && isMatchListQuery) {
      const now = new Date().toISOString();
      const short = q.replace(/\s+/g, " ").slice(0, 120);
      console.log(
        `[GraphQL Proxy] ${now} op=${op || "(none)"} matchListQuery=${short}...`,
      );
    }
  } catch {
    // ignore debug parse errors
  }

  const candidates = getBackendCandidates();
  let lastErr: unknown;

  for (const target of candidates) {
    try {
      const { status, text, contentType } = await tryProxy(target, body, headers);
      res.status(status);
      res.setHeader("Content-Type", contentType);
      res.send(text);
      return;
    } catch (e) {
      lastErr = e;
      console.warn("[api/graphql proxy] failed:", target, e);
    }
  }

  const msg = lastErr instanceof Error ? lastErr.message : String(lastErr);
  const cause =
    lastErr instanceof Error && "cause" in lastErr
      ? String((lastErr as Error & { cause?: unknown }).cause)
      : "";
  console.error("[api/graphql proxy] all candidates failed", candidates, lastErr);
  res.status(502).json({
    errors: [
      {
        message:
          `GraphQL proxy: ${msg}${cause ? ` (${cause})` : ""}. Sinangan: ${candidates.join(" | ")}. ` +
          `1) kickup papkasida: docker compose up -d (4002 ochiq). ` +
          `2) Docker: docker compose -f docker-compose.yml -f docker-compose.kickup-network.yml up (bir tarmoqda kickup-api). ` +
          `3) Next Docker siz: yarn dev. 4) Bitta compose: docker compose -f docker-compose.fullstack.yml up`,
      },
    ],
  });
}
