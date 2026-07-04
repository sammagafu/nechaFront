import client from './client'
import type { ApiSuccess } from '@/types/api'
import type { AdminOrder, AdminProduct, StoreDashboard } from '@/types/auth'

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
