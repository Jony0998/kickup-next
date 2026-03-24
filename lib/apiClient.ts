export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

function getBaseUrl(): string {
  // If you run a separate backend (Express/Nest/Django/etc), set NEXT_PUBLIC_API_BASE_URL
  // Example: http://localhost:4000
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  return base ? base.replace(/\/+$/, "") : "";
}

function buildUrl(path: string): string {
  const base = getBaseUrl();
  if (!base) return path; // fall back to same-origin (Next API routes)
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth, headers, ...rest } = options;
  const url = buildUrl(path);

  const h = new Headers(headers);
  if (!h.has("Content-Type") && rest.body) h.set("Content-Type", "application/json");
  if (auth) {
    const token = getAuthToken();
    if (token) h.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...rest,
    headers: h,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && typeof (data as any).message === "string"
        ? (data as any).message
        : `Request failed: ${res.status}`);
    const err: ApiError = { status: res.status, message, details: data };
    throw err;
  }

  return data as T;
}


