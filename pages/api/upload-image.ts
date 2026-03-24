/**
 * Proxy: frontend -> Next.js API -> backend uploader.
 * Same-origin, no CORS. Reads body and forwards to backend.
 */
import type { NextApiRequest, NextApiResponse } from "next";

function getBackendUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()
    || process.env.NEXT_PUBLIC_GRAPHQL_URL?.trim()?.replace(/\/graphql\/?$/i, "");
  if (env && env.startsWith("http")) return env.replace(/\/+$/, "");
  // Relative GraphQL (/api/graphql) — to‘g‘ridan-to‘g‘ri backend host (Docker: 4002)
  return "http://127.0.0.1:4002";
}

function readBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  const token = (req.headers.authorization as string)?.replace(/^Bearer\s+/i, "")?.trim();
  if (!token) {
    res.status(401).json({ success: false, message: "Token kerak. Qayta login qiling." });
    return;
  }

  const type = (req.query.type as string) || "members";
  const allowed = ["members", "teams", "properties", "matches"];
  const uploadType = allowed.includes(type.toLowerCase()) ? type.toLowerCase() : "members";

  try {
    const backendUrl = getBackendUrl();
    const contentType = req.headers["content-type"] || "";
    const body = await readBody(req);

    const response = await fetch(`${backendUrl}/uploader/image?type=${uploadType}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
        "Content-Length": String(body.length),
      },
      body: new Uint8Array(body),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        message: (data as any)?.message || `Backend xato: ${response.status}`,
      });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    console.error("Upload proxy error:", err);
    res.status(500).json({
      success: false,
      message: err?.message || "Server xatosi. Backend ishlayotganini tekshiring (Docker: 4002).",
    });
  }
}
