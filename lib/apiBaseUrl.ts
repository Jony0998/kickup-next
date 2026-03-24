/**
 * Backend HTTP origin (REST: /uploader, WebSocket /chat).
 * Docker (kickup): host port 4002 → API container 3008.
 */
const DEFAULT_HOST_PORT = "4002";

export function getApiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (env) return env.replace(/\/+$/, "");
  const gql = process.env.NEXT_PUBLIC_GRAPHQL_URL?.trim() || "";
  if (gql.startsWith("http")) {
    try {
      return gql.replace(/\/graphql\/?$/i, "").replace(/\/+$/, "");
    } catch {
      /* fall through */
    }
  }
  if (typeof window !== "undefined" && window.location?.hostname) {
    return `http://${window.location.hostname}:${DEFAULT_HOST_PORT}`;
  }
  return `http://127.0.0.1:${DEFAULT_HOST_PORT}`;
}
