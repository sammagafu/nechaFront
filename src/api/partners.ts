import client from './client'
import type { ApiSuccess } from '@/types/api'
import type { Product } from '@/types/api'

export interface PartnerHotelCard {
  name: string
  location: string
  initials: string
  slug: string
}

export interface PartnersLandingData {
  founding_spots_total: number
  founding_spots_taken: number
  partner_hotels: PartnerHotelCard[]
  featured_products: Product[]
  active_hotel_count: number
}

export async function fetchPartnersLanding(catalogSlug = 'sea-cliff') {
  const { data } = await client.get<ApiSuccess<PartnersLandingData>>('/partners/landing', {
    params: { catalog_slug: catalogSlug },
  })
  return data.data
}
