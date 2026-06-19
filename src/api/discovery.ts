import client from './client'
import type { ApiSuccess } from '@/types/api'
import type {
  AdminDiscoveryItem,
  DiscoveryPortal,
  DiscoveryItem,
  SubmitDiscoveryEventPayload,
} from '@/types/discovery'

export async function fetchDiscoveryPortal(slug: string) {
  const { data } = await client.get<ApiSuccess<DiscoveryPortal>>(`/hotels/slug/${slug}/discovery`)
  return data.data
}

export async function submitDiscoveryEvent(payload: SubmitDiscoveryEventPayload) {
  const { data } = await client.post<ApiSuccess<DiscoveryItem>>('/discovery/events/submit', payload)
  return data.data
}

export async function fetchAdminDiscovery(section?: string, status?: string) {
  const { data } = await client.get<ApiSuccess<AdminDiscoveryItem[]>>('/admin/discovery', {
    params: { section, status },
  })
  return data.data
}

export async function fetchAdminDiscoveryItem(id: string) {
  const { data } = await client.get<ApiSuccess<AdminDiscoveryItem>>(`/admin/discovery/${id}`)
  return data.data
}

export async function createDiscoveryItem(payload: Record<string, unknown>) {
  const { data } = await client.post<ApiSuccess<AdminDiscoveryItem>>('/admin/discovery', payload)
  return data.data
}

export async function updateDiscoveryItem(id: string, payload: Record<string, unknown>) {
  const { data } = await client.patch<ApiSuccess<AdminDiscoveryItem>>(`/admin/discovery/${id}`, payload)
  return data.data
}
