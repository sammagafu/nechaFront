export interface ApiSuccess<T> {
  success: boolean
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
  }
}

export interface Hotel {
  id: string
  code: string
  slug?: string
  name: string
  description: string
  address: string
  city: string
  location?: string
  country: string
  zone?: string
  phone: string
  initials?: string
  logo_url?: string
  referral_code?: string
  services?: string[]
  is_verified?: boolean
  google_maps_url?: string
  latitude?: number
  longitude?: number
}

export interface Product {
  id: string
  slug?: string
  brand_name?: string
  name: string
  description: string
  category: string
  badge?: string
  price: number
  currency: string
  image_url: string
  images?: string[]
  stock: number
  is_featured?: boolean
}

export interface HotelRoom {
  room_number: string
  room_type?: string
  floor?: string
}

export interface HotelMenuCategory {
  id: string
  label: string
}

export interface HotelMenuItem {
  id: string
  category: string
  name: string
  description: string
  price: number
  tag?: string
  menu_kind?: string
}

export interface HotelMenuResponse {
  categories: HotelMenuCategory[]
  items: HotelMenuItem[]
}

export interface HotelReservationRequest {
  hotel_code: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string
  check_out: string
  room_type: string
  guest_count: number
  special_requests?: string
}

export interface TableReservationRequest {
  hotel_code: string
  guest_name: string
  guest_email: string
  guest_phone: string
  reservation_date: string
  party_size: number
  table_number?: string
  special_requests?: string
}

export interface Reservation {
  id: string
  hotel_id: string
  type: string
  status: string
  order_ref: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in?: string
  check_out?: string
  room_type?: string
  guest_count?: number
  reservation_date?: string
  party_size?: number
  special_requests?: string
  created_at: string
}

export interface FoodOrderItem {
  name: string
  quantity: number
  unit_price: number
  notes?: string
}

export interface FoodOrderRequest {
  hotel_code: string
  customer_name: string
  customer_phone: string
  table_number?: string
  room_number?: string
  items: FoodOrderItem[]
  notes?: string
  require_payment?: boolean
  customer_email?: string
  return_url?: string
  cancel_url?: string
}

export interface DiscoveryOrderRequest {
  discovery_slug: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  quantity: number
  return_url?: string
  cancel_url?: string
}

export interface ProductOrderItem {
  product_id?: string
  name: string
  quantity: number
  unit_price: number
}

export interface ProductOrderRequest {
  hotel_code?: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  address?: string
  city?: string
  country?: string
  room_number?: string
  payment_method?: string
  currency?: string
  delivery_fee?: number
  delivery_zone_code?: string
  return_url?: string
  cancel_url?: string
  items: ProductOrderItem[]
  notes?: string
  redeem_points?: number
}

export interface Order {
  id: string
  hotel_id: string
  type: string
  status: string
  order_ref: string
  customer_name: string
  customer_phone: string
  table_number?: string
  room_number?: string
  total_amount: number
  currency: string
  items: Array<{
    name: string
    quantity: number
    unit_price: number
    total_price: number
    notes?: string
  }>
  notes?: string
  payment_provider?: string
  payment_status?: string
  payment_ref?: string
  payment_required?: boolean
  payment_url?: string
  created_at: string
}

export interface OrderTrack {
  id: string
  status: string
  order_ref: string
  updated_at: string
}
