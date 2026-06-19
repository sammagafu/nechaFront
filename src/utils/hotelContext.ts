export type HotelEntryChannel = 'room' | 'poster' | 'lobby'

export type HotelContextPayload = {
  hotel_code?: string
  hotel_slug?: string
  channel?: HotelEntryChannel
  room_number?: string
  referral_code?: string
  scanned_at?: string
}

const LAST_SLUG_KEY = 'necha_last_hotel_slug'
const LAST_CODE_KEY = 'necha_last_hotel_code'
const LAST_CHANNEL_KEY = 'necha_last_hotel_channel'
const LAST_REFERRAL_KEY = 'necha_hotel_referral'
const SCAN_PREFIX = 'necha_hotel_scanned_at_'
const ROOM_PREFIX = 'necha_hotel_room_'

export function normalizeHotelChannel(raw?: string | null): HotelEntryChannel {
  const value = raw?.trim().toLowerCase()
  if (value === 'poster' || value === 'lobby') return value
  return 'room'
}

function scanStorageKey(slug: string, channel: HotelEntryChannel) {
  return `${SCAN_PREFIX}${slug}_${channel}`
}

export function recordHotelScan(slug: string, channel: HotelEntryChannel = 'room') {
  const key = scanStorageKey(slug, channel)
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, new Date().toISOString())
  }
}

export function readHotelScanTime(slug: string, channel: HotelEntryChannel = 'room') {
  return localStorage.getItem(scanStorageKey(slug, channel))?.trim() || ''
}

export function persistLastHotel(
  slug: string,
  code: string,
  referralCode?: string,
  channel: HotelEntryChannel = 'room',
) {
  localStorage.setItem(LAST_SLUG_KEY, slug)
  localStorage.setItem(LAST_CODE_KEY, code)
  localStorage.setItem(LAST_CHANNEL_KEY, channel)
  if (referralCode) {
    localStorage.setItem(LAST_REFERRAL_KEY, referralCode)
  }
  recordHotelScan(slug, channel)
}

/** Hotel context from the last QR / poster visit (for register / social sign-in). */
export function readHotelContext(): HotelContextPayload | undefined {
  const slug = localStorage.getItem(LAST_SLUG_KEY)?.trim()
  const code = localStorage.getItem(LAST_CODE_KEY)?.trim()
  if (!slug && !code) return undefined

  const channel = normalizeHotelChannel(localStorage.getItem(LAST_CHANNEL_KEY))
  const room = slug ? localStorage.getItem(`${ROOM_PREFIX}${slug}`)?.trim() : ''
  const referral = localStorage.getItem(LAST_REFERRAL_KEY)?.trim()
  const scannedAt = slug ? readHotelScanTime(slug, channel) : ''

  const payload: HotelContextPayload = { channel }
  if (code) payload.hotel_code = code
  if (slug) payload.hotel_slug = slug
  if (room) payload.room_number = room
  if (referral) payload.referral_code = referral
  if (scannedAt) payload.scanned_at = scannedAt
  return payload
}
