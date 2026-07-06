import client from './client'
import type { ApiSuccess } from '@/types/api'
import type { PlatformFeatures, PlatformSettings } from '@/api/inquiries'

export type UpdatePlatformSettingsPayload = {
  tzs_to_usd_rate?: number
  delivery_base_fee_tzs?: number
  delivery_per_km_tzs?: number
  features?: PlatformFeatures
}

export async function fetchAdminPlatformSettings(): Promise<PlatformSettings> {
  const { data } = await client.get<ApiSuccess<PlatformSettings>>('/admin/platform/settings')
  return data.data
}

export async function updateAdminPlatformSettings(
  payload: UpdatePlatformSettingsPayload,
): Promise<PlatformSettings> {
  const { data } = await client.put<ApiSuccess<PlatformSettings>>('/admin/platform/settings', payload)
  return data.data
}
