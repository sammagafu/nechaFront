import client from './client'
import type { ApiSuccess, Hotel, HotelMenuResponse, HotelRoom, Product } from '@/types/api'
import type { StorefrontHotel, StorefrontProduct } from '@/types/storefront'

export async function fetchHotel(code: string) {
  const { data } = await client.get<ApiSuccess<Hotel>>(`/hotels/${code}`)
  return data.data
}

export async function fetchProducts(code: string, featured = false) {
  const { data } = await client.get<ApiSuccess<Product[]>>(`/hotels/${code}/products`, {
    params: featured ? { featured: 'true' } : undefined,
  })
  return data.data
}

export async function fetchHotelBySlug(slug: string, ref?: string) {
  const { data } = await client.get<ApiSuccess<StorefrontHotel>>(`/hotels/slug/${slug}`, {
    params: ref ? { ref } : undefined,
  })
  return data.data
}

export async function fetchProductsBySlug(slug: string, featured = false) {
  const { data } = await client.get<ApiSuccess<StorefrontProduct[]>>(`/hotels/slug/${slug}/products`, {
    params: featured ? { featured: 'true' } : undefined,
  })
  return data.data
}

export async function fetchProductBySlug(slug: string, productSlug: string) {
  const { data } = await client.get<ApiSuccess<StorefrontProduct>>(
    `/hotels/slug/${slug}/products/${productSlug}`,
  )
  return data.data
}

export async function recordHotelScanEvent(
  slug: string,
  payload: { ref: string; channel: 'room' | 'poster' | 'lobby'; scanned_at?: string },
) {
  try {
    await client.post(`/hotels/slug/${slug}/scan`, payload)
  } catch {
    // Non-blocking — storefront still works if tracking fails
  }
}

export async function fetchHotelRooms(slug: string) {
  const { data } = await client.get<ApiSuccess<HotelRoom[]>>(`/hotels/slug/${slug}/rooms`)
  return data.data
}

export async function fetchHotelMenu(slug: string) {
  const { data } = await client.get<ApiSuccess<HotelMenuResponse>>(`/hotels/slug/${slug}/menu`)
  return data.data
}
