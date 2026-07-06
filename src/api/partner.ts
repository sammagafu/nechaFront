import client from './client'
import type { ApiSuccess } from '@/types/api'
import type { AdminGuestStay, AdminOrder, AdminProduct, StoreDashboard } from '@/types/auth'
import type { AdminMenuItem } from '@/api/admin'

export interface PartnerSettings {
  id: string
  name: string
  description: string
  address: string
  city: string
  location: string
  phone: string
  email: string
  google_maps_url: string
  latitude?: number
  longitude?: number
  selcom_payout_account: string
}

export interface PartnerCommission {
  id: string
  order_id: string
  category: string
  gmv: number
  property_share: number
  status: string
  created_at: string
}

export async function fetchPartnerDashboard() {
  const { data } = await client.get<ApiSuccess<StoreDashboard>>('/partner/dashboard')
  return data.data
}

export async function fetchPartnerOrders() {
  const { data } = await client.get<ApiSuccess<AdminOrder[]>>('/partner/orders')
  return data.data
}

export async function fetchPartnerProducts() {
  const { data } = await client.get<ApiSuccess<AdminProduct[]>>('/partner/products')
  return data.data
}

export async function updatePartnerProduct(id: string, payload: Partial<AdminProduct>) {
  const { data } = await client.patch<ApiSuccess<AdminProduct>>(`/partner/products/${id}`, payload)
  return data.data
}

export async function fetchPartnerMenuItems(kind?: string) {
  const { data } = await client.get<ApiSuccess<AdminMenuItem[]>>('/partner/menu-items', {
    params: kind ? { kind } : undefined,
  })
  return data.data
}

export async function createPartnerMenuItem(payload: Partial<AdminMenuItem>) {
  const { data } = await client.post<ApiSuccess<AdminMenuItem>>('/partner/menu-items', payload)
  return data.data
}

export async function updatePartnerMenuItem(id: string, payload: Partial<AdminMenuItem>) {
  const { data } = await client.patch<ApiSuccess<AdminMenuItem>>(`/partner/menu-items/${id}`, payload)
  return data.data
}

export async function fetchPartnerGuestStays() {
  const { data } = await client.get<ApiSuccess<AdminGuestStay[]>>('/partner/guest-stays')
  return data.data
}

export async function fetchPartnerCommissions() {
  const { data } = await client.get<ApiSuccess<PartnerCommission[]>>('/partner/commissions')
  return data.data
}

export async function fetchPartnerSettings() {
  const { data } = await client.get<ApiSuccess<PartnerSettings>>('/partner/settings')
  return data.data
}

export async function updatePartnerSettings(payload: Partial<PartnerSettings>) {
  const { data } = await client.patch<ApiSuccess<PartnerSettings>>('/partner/settings', payload)
  return data.data
}

export interface PartnerReferral {
  id: string
  traveller_name: string
  traveller_phone: string
  traveller_email: string
  trip_context: string
  referral_token: string
  status: string
  created_at: string
}

export async function fetchPartnerReferrals() {
  const { data } = await client.get<ApiSuccess<PartnerReferral[]>>('/partner/referrals')
  return data.data
}

export async function createPartnerReferral(payload: {
  traveller_name: string
  traveller_phone: string
  traveller_email?: string
  trip_context?: string
  trip_start_date?: string
  trip_end_date?: string
}) {
  const { data } = await client.post<ApiSuccess<PartnerReferral>>('/partner/referrals', payload)
  return data.data
}
