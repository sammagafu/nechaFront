import client from './client'
import type { ApiSuccess } from '@/types/api'
import type { CatalogueItem, Influencer, PayoutBatch, Supplier } from '@/types/commerce'

export interface CommissionRule {
  id: string
  category: string
  premium_applicable: boolean
  base_margin_pct: number
  premium_pool_pct: number
  necha_pool_share_founding: number
  necha_pool_share_standard: number
  necha_commission_pct: number
  influencer_pct_of_necha: number
  is_active: boolean
}

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

export async function createSupplier(payload: Partial<Supplier>) {
  const { data } = await client.post<ApiSuccess<Supplier>>('/admin/suppliers', payload)
  return data.data
}

export async function fetchCatalogue() {
  const { data } = await client.get<ApiSuccess<CatalogueItem[]>>('/admin/catalogue')
  return data.data
}

export async function createCatalogueItem(payload: Partial<CatalogueItem>) {
  const { data } = await client.post<ApiSuccess<CatalogueItem>>('/admin/catalogue', payload)
  return data.data
}

export async function updateCatalogueItem(id: string, payload: Partial<CatalogueItem>) {
  const { data } = await client.patch<ApiSuccess<CatalogueItem>>(`/admin/catalogue/${id}`, payload)
  return data.data
}

export async function setCatalogueVisibility(
  id: string,
  payload: { hotel_id: string; is_visible: boolean; price_override?: number },
) {
  const { data } = await client.post<ApiSuccess<unknown>>(`/admin/catalogue/${id}/visibility`, payload)
  return data.data
}

export async function fetchPayoutBatches() {
  const { data } = await client.get<ApiSuccess<PayoutBatch[]>>('/admin/payout-batches')
  return data.data
}

export async function generatePayoutBatches(until?: string) {
  const { data } = await client.post<ApiSuccess<PayoutBatch[]>>('/admin/payout-batches/generate', { until })
  return data.data
}

export async function releasePayoutBatch(id: string) {
  const { data } = await client.post<ApiSuccess<PayoutBatch>>(`/admin/payout-batches/${id}/release`)
  return data.data
}

export async function fetchCommissionRules() {
  const { data } = await client.get<ApiSuccess<CommissionRule[]>>('/admin/commission-rules')
  return data.data
}

export async function upsertCommissionRule(payload: Partial<CommissionRule> & { category: string }) {
  const { data } = await client.put<ApiSuccess<CommissionRule>>('/admin/commission-rules', payload)
  return data.data
}
