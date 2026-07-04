import client from '@/api/client'
import type { ApiSuccess } from '@/types/api'

export type InquiryType =
  | 'hotel_partner'
  | 'brand_partner'
  | 'contact'
  | 'newsletter'
  | 'event_listing'
  | 'partner_referral'

export interface SubmitInquiryPayload {
  type: InquiryType
  name?: string
  email: string
  phone?: string
  company?: string
  role?: string
  location?: string
  category?: string
  message?: string
  rooms?: number
  units?: number
  price?: number
}

export interface InquiryResponse {
  id: string
  type: string
  status: string
  created_at: string
}

export async function submitInquiry(payload: SubmitInquiryPayload): Promise<InquiryResponse> {
  const { data } = await client.post<ApiSuccess<InquiryResponse>>('/inquiries', payload)
  return data.data
}

export interface GuestRequestPayload {
  guest_name: string
  guest_phone: string
  guest_email?: string
  room_number?: string
  category?: string
  body: string
}

export async function submitGuestRequest(hotelSlug: string, payload: GuestRequestPayload) {
  const { data } = await client.post(`/hotels/slug/${hotelSlug}/requests`, payload)
  return data.data
}

export interface DeliveryZone {
  code: string
  label: string
  delivery_fee_tzs: number
  free_threshold_tzs: number
}

export interface PlatformSettings {
  tzs_to_usd_rate: number
  free_delivery_threshold_tzs: number
  default_delivery_fee_tzs: number
  zones: DeliveryZone[]
}

export async function fetchPlatformSettings(): Promise<PlatformSettings> {
  const { data } = await client.get<ApiSuccess<PlatformSettings>>('/platform/settings')
  return data.data
}
