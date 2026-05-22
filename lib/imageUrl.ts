export { getApiBaseUrl } from "./apiBaseUrl";

/**
 * Returns a safe image URL for use in <img> / <Avatar>.
 * Always extracts the path (e.g. /uploads/images/members/xxx.jpg) so the
 * browser never makes an HTTP request from an HTTPS page (mixed content).
 * Nginx proxies /uploads/ → backend:4002/uploads/.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      return new URL(trimmed).pathname;
    } catch {
      const m = trimmed.match(/^https?:\/\/[^/]+(\/.*)?$/);
      return m?.[1] ?? trimmed;
    }
  }

  return trimmed.startsWith("/") ? trimmed : "/" + trimmed;
}
