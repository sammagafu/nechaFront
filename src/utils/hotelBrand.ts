/** Resolve a hotel logo URL for display. Returns null when no usable mark exists. */
export function resolveHotelLogoUrl(logoUrl?: string | null): string | null {
  const raw = logoUrl?.trim()
  if (!raw) return null
  // Never treat the Necha platform mark as a property logo.
  if (raw.includes('necha-logo')) return null
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')) {
    return raw
  }
  return `/${raw}`
}

export function hotelInitials(name: string, fallback = 'H'): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return fallback
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}
