import type { Hotel, Product } from '@/types/api'

export interface StorefrontHotel extends Hotel {
  slug: string
  location: string
  zone: string
  initials: string
  logo_url: string
  referral_code: string
  services: string[]
  is_verified: boolean
}

export interface StorefrontProduct extends Product {
  slug: string
  brand_name: string
  badge: string
  is_featured: boolean
}
