/** Returns a same-origin in-app path or the fallback. */
export function safeRedirectPath(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback
  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback
  return raw
}
