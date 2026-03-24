import { getApiBaseUrl } from "./apiBaseUrl";

export { getApiBaseUrl };

/**
 * Normalize image URL so it loads from the current API host.
 * Fixes profile images disappearing after logout/login when backend stored localhost URL.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  const base = getApiBaseUrl();
  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const pathMatch = trimmed.match(/^(?:https?:\/\/[^/]+)(\/.*)$/);
      if (pathMatch && pathMatch[1]) return base + pathMatch[1];
    }
    if (trimmed.startsWith("/")) return base + trimmed;
    return base + "/" + trimmed;
  } catch {
    return trimmed;
  }
}
