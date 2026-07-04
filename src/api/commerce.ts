import client from './client'
import type { ApiSuccess } from '@/types/api'
import type { CatalogueItem, Influencer, PayoutBatch, Supplier } from '@/types/commerce'

export async function fetchInfluencers() {
  const { data } = await client.get<ApiSuccess<Influencer[]>>('/admin/influencers')
  return data.data
}

export async function createInfluencer(payload: Partial<Influencer>) {
  const { data } = await client.post<ApiSuccess<Influencer>>('/admin/influencers', payload)
  return data.data
}

export async function updateInfluencer(id: string, payload: Partial<Influencer>) {
  const { data } = await client.patch<ApiSuccess<Influencer>>(`/admin/influencers/${id}`, payload)
  return data.data
}

export async function fetchSuppliers() {
  const { data } = await client.get<ApiSuccess<Supplier[]>>('/admin/suppliers')
  return data.data
}

export async function createSupplier(payload: Partial<Supplier> & { supplier_type: string; name: string }) {
  const { data } = await client.post<ApiSuccess<Supplier>>('/admin/suppliers', payload)
  return data.data
}

export async function fetchCatalogue() {
  const { data } = await client.get<ApiSuccess<CatalogueItem[]>>('/admin/catalogue')
  return data.data
}

export async function createCatalogueItem(payload: {
  supplier_id: string
  category: string
  name: string
  description?: string
  currency?: string
  base_price: number
  capacity_or_stock?: number
  is_digital?: boolean
  event_date?: string
}) {
  const { data } = await client.post<ApiSuccess<CatalogueItem>>('/admin/catalogue', payload)
  return data.data
}

export async function updateCatalogueItem(id: string, payload: Partial<CatalogueItem>) {
  const { data } = await client.patch<ApiSuccess<CatalogueItem>>(`/admin/catalogue/${id}`, payload)
  return data.data
}

export async function setCatalogueVisibility(
  itemId: string,
  payload: { hotel_id: string; is_visible: boolean; price_override?: number },
) {
  await client.post(`/admin/catalogue/${itemId}/visibility`, payload)
}

export async function fetchPayoutBatches() {
  const { data } = await client.get<ApiSuccess<PayoutBatch[]>>('/admin/payout-batches')
  return data.data
}

export async function generatePayoutBatches(until?: string) {
  const { data } = await client.post<ApiSuccess<PayoutBatch[]>>('/admin/payout-batches/generate', {
    until: until || undefined,
  })
  return data.data
}

export async function releasePayoutBatch(id: string) {
  const { data } = await client.post<ApiSuccess<PayoutBatch>>(`/admin/payout-batches/${id}/release`)
  return data.data
}
