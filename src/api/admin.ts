import client from './client'
import type { ApiSuccess } from '@/types/api'
import type {
  AdminGuestStay,
  AdminHotel,
  AdminOrder,
  AdminOrderDetail,
  AdminProduct,
  AdminReservation,
  AnalyticsOverview,
  DashboardStats,
  ImportResult,
  OrderSummary,
  StoreDashboard,
} from '@/types/auth'

export async function fetchDashboard() {
  const { data } = await client.get<ApiSuccess<DashboardStats>>('/admin/dashboard')
  return data.data
}

export async function fetchAnalytics() {
  const { data } = await client.get<ApiSuccess<AnalyticsOverview>>('/admin/analytics')
  return data.data
}

export async function fetchStoreDashboard(hotelId: string) {
  const { data } = await client.get<ApiSuccess<StoreDashboard>>(`/admin/store/${hotelId}/dashboard`)
  return data.data
}

export async function fetchHotels() {
  const { data } = await client.get<ApiSuccess<AdminHotel[]>>('/admin/hotels')
  return data.data
}

export async function fetchHotel(id: string) {
  const { data } = await client.get<ApiSuccess<AdminHotel>>(`/admin/hotels/${id}`)
  return data.data
}

export async function createHotel(payload: Partial<AdminHotel>) {
  const { data } = await client.post<ApiSuccess<AdminHotel>>('/admin/hotels', payload)
  return data.data
}

export async function updateHotel(id: string, payload: Partial<AdminHotel>) {
  const { data } = await client.patch<ApiSuccess<AdminHotel>>(`/admin/hotels/${id}`, payload)
  return data.data
}

export async function fetchProducts(hotelId: string) {
  const { data } = await client.get<ApiSuccess<AdminProduct[]>>(`/admin/hotels/${hotelId}/products`)
  return data.data
}

export async function createProduct(hotelId: string, payload: Partial<AdminProduct>) {
  const { data } = await client.post<ApiSuccess<AdminProduct>>(`/admin/hotels/${hotelId}/products`, payload)
  return data.data
}

export async function updateProduct(id: string, payload: Partial<AdminProduct>) {
  const { data } = await client.patch<ApiSuccess<AdminProduct>>(`/admin/products/${id}`, payload)
  return data.data
}

export interface AdminMenuItem {
  id: string
  slug: string
  category: string
  name: string
  description: string
  price: number
  currency: string
  tag: string
  menu_kind: string
  sort_order: number
  is_active: boolean
}

export async function fetchMenuItems(hotelId: string, kind?: string) {
  const { data } = await client.get<ApiSuccess<AdminMenuItem[]>>(`/admin/hotels/${hotelId}/menu-items`, {
    params: kind ? { kind } : undefined,
  })
  return data.data
}

export async function createMenuItem(hotelId: string, payload: Partial<AdminMenuItem>) {
  const { data } = await client.post<ApiSuccess<AdminMenuItem>>(`/admin/hotels/${hotelId}/menu-items`, payload)
  return data.data
}

export async function updateMenuItem(id: string, payload: Partial<AdminMenuItem>) {
  const { data } = await client.patch<ApiSuccess<AdminMenuItem>>(`/admin/menu-items/${id}`, payload)
  return data.data
}

export async function deleteMenuItem(id: string) {
  await client.delete(`/admin/menu-items/${id}`)
}

export async function fetchOrders() {
  const { data } = await client.get<ApiSuccess<AdminOrder[]>>('/admin/orders')
  return data.data
}

export async function fetchOrder(id: string) {
  const { data } = await client.get<ApiSuccess<AdminOrderDetail>>(`/admin/orders/${id}`)
  return data.data
}

export async function fetchOrderSummary() {
  const { data } = await client.get<ApiSuccess<OrderSummary>>('/admin/orders/summary')
  return data.data
}

export async function fetchGuestStays() {
  const { data } = await client.get<ApiSuccess<AdminGuestStay[]>>('/admin/guest-stays')
  return data.data
}

export async function updateOrderStatus(id: string, status: string) {
  const { data } = await client.patch<ApiSuccess<AdminOrder>>(`/admin/orders/${id}/status`, { status })
  return data.data
}

export async function fetchReservations() {
  const { data } = await client.get<ApiSuccess<AdminReservation[]>>('/admin/reservations')
  return data.data
}

export async function fetchReservation(id: string) {
  const { data } = await client.get<ApiSuccess<AdminReservation>>(`/admin/reservations/${id}`)
  return data.data
}

export async function updateReservationStatus(id: string, status: string) {
  const { data } = await client.patch<ApiSuccess<AdminReservation>>(`/admin/reservations/${id}/status`, { status })
  return data.data
}

export async function importHotelCSV(
  hotelId: string,
  kind: 'rooms' | 'categories' | 'menu',
  file: File,
) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await client.post<ApiSuccess<ImportResult>>(
    `/admin/hotels/${hotelId}/import/${kind}`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data.data
}

export interface InquiryRecord {
  id: string
  type: string
  status: string
  name?: string
  email: string
  phone?: string
  company?: string
  role?: string
  location?: string
  category?: string
  message?: string
  metadata?: string
  created_at: string
}

export async function fetchInquiries(status?: string, type?: string) {
  const { data } = await client.get<ApiSuccess<InquiryRecord[]>>('/admin/inquiries', {
    params: { status: status || undefined, type: type || undefined },
  })
  return data.data
}

export async function updateInquiryStatus(id: string, status: string) {
  const { data } = await client.patch<ApiSuccess<InquiryRecord>>(`/admin/inquiries/${id}/status`, { status })
  return data.data
}
