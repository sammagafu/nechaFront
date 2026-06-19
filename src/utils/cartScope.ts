export const SHOP_CART_SCOPE = 'shop'

export function hotelCartScope(slug: string) {
  return `hotel:${slug}`
}

export function cartStorageKey(scope: string) {
  return `necha_cart_${scope}`
}
