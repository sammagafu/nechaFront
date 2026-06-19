export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  role: string
  auth_provider?: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface DashboardStats {
  hotels: number
  products: number
  orders: number
  reservations: number
  pending_orders: number
  pending_reservations: number
}

export interface DailyMetric {
  date: string
  count: number
  revenue: number
}

export interface StatusCount {
  status: string
  count: number
}

export interface HotelPerformance {
  hotel_id: string
  hotel_name: string
  order_count: number
  revenue: number
}

export interface AnalyticsOverview {
  total_revenue: number
  currency: string
  orders_last_30_days: number
  reservations_last_30_days: number
  order_trend: DailyMetric[]
  orders_by_status: StatusCount[]
  top_hotels: HotelPerformance[]
}

export interface ProductPerformance {
  product_id: string
  name: string
  quantity: number
  revenue: number
}

export interface StoreDashboard {
  hotel: AdminHotel
  total_revenue: number
  currency: string
  orders: number
  reservations: number
  pending_orders: number
  pending_reservations: number
  orders_last_30_days: number
  revenue_last_30_days: number
  order_trend: DailyMetric[]
  top_products: ProductPerformance[]
  recent_orders: AdminOrder[]
}

export interface AdminHotel {
  id: string
  code: string
  slug: string
  name: string
  description: string
  address: string
  city: string
  location: string
  country: string
  zone: string
  phone: string
  initials: string
  logo_url: string
  referral_code: string
  services: string[]
  is_verified: boolean
  kkooapp_id: string
  is_active: boolean
  product_count: number
  created_at: string
}

export interface AdminProduct {
  id: string
  hotel_id: string
  slug: string
  brand_name: string
  name: string
  description: string
  category: string
  badge: string
  price: number
  currency: string
  image_url: string
  stock: number
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export interface AdminOrder {
  id: string
  hotel_id: string
  hotel_name: string
  type: string
  status: string
  kkooapp_ref: string
  customer_name: string
  customer_phone: string
  room_number: string
  total_amount: number
  currency: string
  item_count: number
  created_at: string
}

export interface AdminReservation {
  id: string
  hotel_id: string
  hotel_name: string
  type: string
  status: string
  kkooapp_ref: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in?: string
  check_out?: string
  reservation_date?: string
  party_size?: number
  created_at: string
}
