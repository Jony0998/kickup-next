export type GraphQLErrorItem = {
  message: string;
  path?: Array<string | number>;
  extensions?: unknown;
};

export type GraphQLResponse<TData> = {
  data?: TData;
  errors?: GraphQLErrorItem[];
};

export type GraphQLRequestOptions = {
  variables?: Record<string, unknown>;
  operationName?: string;
  headers?: Record<string, string>;
  auth?: boolean;
};

/** Eski noto‘g‘ri env: 3008 — faqat API konteyner ichida; brauzer/Next hech qachon ishlatmasin. */
function sanitizeGraphqlEnv(raw: string | undefined): string | undefined {
  const v = raw?.trim();
  if (!v) return undefined;
  if (/:\s*3008(\/|$)/.test(v) || /127\.0\.0\.1:\s*3008/.test(v)) return undefined;
  return v;
}

/**
 * Brauzer hech qachon `localhost:3008/graphql` ga urilmasin — 3008 faqat kickup-api **konteyner ichida**.
 * Hostda: kickup-api **4002**, Next `/api/graphql` → `pages/api/graphql.ts` proxy.
 */
export function getPublicGraphqlUrl(): string {
  const env = sanitizeGraphqlEnv(process.env.NEXT_PUBLIC_GRAPHQL_URL);
  const port = process.env.PORT || "3000";
  const path = env?.startsWith("/") ? env : "/api/graphql";

  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    // Faqat production tashqi API (localhost emas)
    if (
      env &&
      env.startsWith("http") &&
      !/localhost|127\.0\.0\.1/i.test(env)
    ) {
      return env;
    }
    // Local / Docker UI: doim shu sayt origin + /api/graphql
    return `${origin}${path}`;
  }

  // SSR / Node (Next server) — konteynerda Next :3000 → /api/graphql API route
  if (env?.startsWith("/")) {
    return `http://127.0.0.1:${port}${env}`;
  }
  if (env?.startsWith("http")) {
    return env;
  }
  return `http://127.0.0.1:${port}/api/graphql`;
}

/** fetch dan oldin — eski bundle yoki env qolsa ham 3008 ga urilmasin */
function resolveFetchUrl(url: string): string {
  if (typeof window !== "undefined") {
    if (url.includes(":3008") || url.includes("3008/graphql")) {
      return `${window.location.origin}/api/graphql`;
    }
    return url;
  }
  if (url.includes(":3008") || url.includes("3008/graphql")) {
    const p = process.env.PORT || "3000";
    return `http://127.0.0.1:${p}/api/graphql`;
  }
  return url;
}

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export async function graphqlRequest<TData>(
  query: string,
  options: GraphQLRequestOptions = {}
): Promise<TData> {
  const url = resolveFetchUrl(getPublicGraphqlUrl());

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (options.auth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  console.log(`📡 Sending GraphQL request to: ${url}`);
  console.log(`Headers:`, JSON.stringify(headers, null, 2));

  const body = {
    query,
    variables: options.variables ?? undefined,
    operationName: options.operationName ?? undefined,
  };

  console.log(`Payload:`, JSON.stringify(body, null, 2));

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers,
      credentials: "include", // Cookie yuboradi va qabul qiladi
      body: JSON.stringify(body),
    });
    console.log(`✅ Response status: ${res.status} ${res.statusText}`);
  } catch (error: unknown) {
    console.error(`❌ Fetch failed for ${url}:`, error);
    const errMsg = error instanceof Error ? error.message : String(error);
    const msg =
      errMsg === "Failed to fetch"
        ? `API ga ulanib bo‘lmadi: ${url}. kickup-api hostda 4002 da ishlayotganini tekshiring; Docker da GRAPHQL_PROXY_TARGET=http://host.docker.internal:4002/graphql. .next keshini o‘chiring: o‘chirib qayta docker compose up.`
        : `Failed to connect to API at ${url}. Make sure the server is running.`;
    throw new Error(msg);
  }

  const rawText = await res.text().catch(() => "");
  let json: GraphQLResponse<TData> | Record<string, unknown> | null = null;
  if (rawText) {
    try {
      json = JSON.parse(rawText) as GraphQLResponse<TData> | Record<string, unknown>;
    } catch {
      json = null;
    }
  }

  if (json && "errors" in json && Array.isArray((json as GraphQLResponse<TData>).errors) && (json as GraphQLResponse<TData>).errors?.length) {
    const gqlJson = json as GraphQLResponse<TData>;
    console.error(`❌ [GraphQL Error] Full Response:`, JSON.stringify(gqlJson.errors, null, 2));

    const firstError = gqlJson.errors![0];
    if (!firstError) {
      throw new Error("GraphQL error (no error details)");
    }
    const ext = (firstError.extensions as any) || {};
    const validationResponse = ext?.response;

    if (validationResponse?.message) {
      const detail = Array.isArray(validationResponse.message)
        ? validationResponse.message.join(", ")
        : validationResponse.message;
      throw new Error(String(detail ?? "Validation error"));
    }

    const code = ext?.code;
    const msg = firstError?.message;
    let msgStr = "";
    try {
      if (msg !== undefined && msg !== null) {
        msgStr = typeof msg === "string" ? msg : String(msg);
      }
    } catch {
      msgStr = "";
    }
    if (typeof msgStr === "string" && msgStr.trim()) {
      throw new Error(msgStr);
    }
    if (code !== undefined && code !== null) {
      throw new Error("Error: " + String(code));
    }
    throw new Error("GraphQL error");
  }

  if (!res.ok) {
    const j = json as Record<string, unknown> | null;
    const nestMsg = j?.message;
    const nestErr = j?.error;
    const detail =
      typeof nestMsg === "string"
        ? nestMsg
        : Array.isArray(nestMsg)
          ? nestMsg.join(", ")
          : typeof nestErr === "string"
            ? nestErr
            : null;
    if (detail) {
      console.error(`❌ [HTTP ${res.status}]`, j);
      throw new Error(`API ${res.status}: ${detail}`);
    }
    const snippet =
      rawText.length > 800 ? `${rawText.slice(0, 800)}…` : rawText || "(bo'sh javob)";
    console.error(`❌ [HTTP ${res.status}] Body snippet:`, snippet);
    throw new Error(
      `GraphQL HTTP ${res.status}: ${res.statusText}. Javob: ${snippet || "JSON emas"}. kickup-api logi va Mongo URI ni tekshiring; Docker da GRAPHQL_PROXY_TARGET porti backend bilan mos bo‘lsin.`
    );
  }

  if (!json) throw new Error("Invalid GraphQL response (Empty JSON)");
  if (!json.data) throw new Error("GraphQL response missing data");
  return json.data as TData;
}


