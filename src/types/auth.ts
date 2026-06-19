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
  recent_reservations: AdminReservation[]
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

export interface AdminOrderItem {
  id: string
  name: string
  quantity: number
  unit_price: number
  total_price: number
  notes?: string
}

export interface AdminOrderDetail extends AdminOrder {
  table_number?: string
  notes?: string
  payment_provider?: string
  payment_status?: string
  payment_ref?: string
  updated_at: string
  items: AdminOrderItem[]
}

export interface OrderSummary {
  total: number
  pending: number
  in_progress: number
  delivered: number
  product_orders: number
  food_orders: number
  orders_today: number
  orders_last_30_days: number
  total_revenue: number
  revenue_last_30_days: number
  currency: string
}

export interface ImportResult {
  kind: string
  created: number
  updated: number
  skipped: number
  errors?: string[]
}

export interface AdminGuestStay {
  id: string
  user_id?: string
  user_email?: string
  user_name?: string
  hotel_id: string
  hotel_name: string
  channel?: string
  room_number?: string
  referral_code?: string
  source: string
  order_id?: string
  reservation_id?: string
  scanned_at?: string
  created_at: string
  items_summary?: string
  total_amount?: number
  currency?: string
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
  room_type?: string
  guest_count?: number
  reservation_date?: string
  table_number?: string
  party_size?: number
  special_requests?: string
  notes?: string
  created_at: string
  updated_at?: string
}
