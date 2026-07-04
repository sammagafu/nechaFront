/** Storefront cart / product types (shop + hotel storefront). */
export interface CommerceProduct {
  id: string
  slug: string
  brandName: string
  name: string
  description: string
  price: number
  currency: string
  hotelCode: string
  hotelSlug: string
  imageUrl?: string
  stock?: number
  badge?: string
}

export type CartItem = CommerceProduct & { quantity: number }

/** Admin commerce engine types (brief §3, §8). */
export interface Influencer {
  id: string
  name: string
  email: string
  phone: string
  referral_code: string
  commission_pct: number
  selcom_payout_account?: string
  agreement_ref?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  supplier_type: string
  name: string
  contact_phone: string
  contact_email: string
  supplier_ref_id?: string
  license_reference?: string
  selcom_payout_account?: string
  agreement_notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CatalogueItem {
  id: string
  supplier_id: string
  category: string
  name: string
  description: string
  currency: string
  base_price: number
  capacity_or_stock: number
  is_digital: boolean
  event_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PayoutBatch {
  id: string
  payee_type: string
  payee_id: string
  currency: string
  total_amount: number
  record_count: number
  status: string
  period_start?: string
  period_end?: string
  released_at?: string
  created_at: string
  updated_at: string
}
