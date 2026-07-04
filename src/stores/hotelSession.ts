import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchHotelBySlug, fetchProductsBySlug, recordHotelScanEvent } from '@/api/hotels'
import { getApiError } from '@/api/client'
import type { StorefrontHotel, StorefrontProduct } from '@/types/storefront'
import { persistLastHotel, normalizeHotelChannel, readHotelScanTime, type HotelEntryChannel } from '@/utils/hotelContext'

const REFERRAL_KEY = 'necha_hotel_referral'
const REFERRAL_APPLIED_KEY = 'necha_referral_applied'

function roomStorageKey(slug: string) {
  return `necha_hotel_room_${slug}`
}

function readReferralApplied(slug: string): boolean {
  try {
    const raw = localStorage.getItem(REFERRAL_APPLIED_KEY)
    if (!raw) return true
    const map = JSON.parse(raw) as Record<string, boolean>
    return map[slug] !== false
  } catch {
    return true
  }
}

function writeReferralApplied(slug: string, applied: boolean) {
  try {
    const raw = localStorage.getItem(REFERRAL_APPLIED_KEY)
    const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
    map[slug] = applied
    localStorage.setItem(REFERRAL_APPLIED_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

export const useHotelSessionStore = defineStore('hotelSession', () => {
  const slug = ref('')
  const refCode = ref('')
  const hotel = ref<StorefrontHotel | null>(null)
  const products = ref<StorefrontProduct[]>([])
  const loading = ref(false)
  const error = ref('')
  const roomNumber = ref('')
  const channel = ref<HotelEntryChannel>('room')
  const referralApplied = ref(true)

  const referralCode = computed(() => hotel.value?.referral_code || refCode.value)

  function persistReferral(code: string) {
    refCode.value = code
    localStorage.setItem(REFERRAL_KEY, code)
  }

  function setRoomNumber(value: string) {
    roomNumber.value = value
    if (slug.value) {
      localStorage.setItem(roomStorageKey(slug.value), value)
    }
  }

  async function load(
    slugValue: string,
    ref?: string,
    entryChannel: HotelEntryChannel = 'room',
    roomFromQuery?: string,
  ) {
    loading.value = true
    error.value = ''
    slug.value = slugValue
    channel.value = normalizeHotelChannel(entryChannel)
    const storedRoom = localStorage.getItem(roomStorageKey(slugValue)) || ''
    const qrRoom = roomFromQuery?.trim() || ''
    roomNumber.value = qrRoom || storedRoom
    if (qrRoom) {
      localStorage.setItem(roomStorageKey(slugValue), qrRoom)
    }
    if (ref) {
      persistReferral(ref)
      referralApplied.value = true
      writeReferralApplied(slugValue, true)
    } else {
      referralApplied.value = readReferralApplied(slugValue)
    }
    try {
      hotel.value = await fetchHotelBySlug(slugValue, ref || refCode.value || undefined)
      if (hotel.value.referral_code) persistReferral(hotel.value.referral_code)
      persistLastHotel(
        slugValue,
        hotel.value.code,
        hotel.value.referral_code || refCode.value || undefined,
        channel.value,
      )
      products.value = await fetchProductsBySlug(slugValue, true)
      void recordHotelScanEvent(slugValue, {
        ref: hotel.value.referral_code || hotel.value.code || ref || refCode.value || '',
        channel: channel.value,
        scanned_at: readHotelScanTime(slugValue, channel.value),
      })
    } catch (e) {
      hotel.value = null
      products.value = []
      error.value = getApiError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function loadAllProducts() {
    if (!slug.value) return
    products.value = await fetchProductsBySlug(slug.value, false)
  }

  function removeReferral() {
    referralApplied.value = false
    if (slug.value) writeReferralApplied(slug.value, false)
  }

  function restoreReferral() {
    referralApplied.value = true
    if (slug.value) writeReferralApplied(slug.value, true)
  }

  return {
    slug,
    refCode,
    hotel,
    products,
    loading,
    error,
    roomNumber,
    channel,
    referralApplied,
    referralCode,
    load,
    loadAllProducts,
    setRoomNumber,
    removeReferral,
    restoreReferral,
  }
})
