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
