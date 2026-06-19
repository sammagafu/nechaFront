/** Bundled brand mark — prefer `<NechaLogo />` in Vue; `logoUrl` for legacy/static refs. */
import logoUrl from '@/assets/necha-logo.svg'

/** Main ecommerce catalogue (sitewide shop). */
export const catalogConfig = {
  hotelSlug: 'sea-cliff',
  hotelCode: 'SEACLIFF24',
}

/** Demo hotel portal for sales / QA. */
export const demoHotelConfig = {
  hotelSlug: 'necha-demo',
  hotelCode: 'NECHA-DEMO',
}

export const appConfig = {
  appUrl: import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  logoUrl,
  phone: '+255 784 455 439',
  email: 'info@necha.africa',
  address: 'House No. 2, Salous St, Africana, Mbezi Beach, DSM',
  hours: 'Mon–Sat: 9:00am – 6:00pm',
  demoHotel: demoHotelConfig,
  social: {
    instagram: 'https://www.instagram.com/nechaafrica',
    facebook: 'https://www.facebook.com/nechaafrica',
  },
}

export const shopPath = '/shop'

export const demoShopPath = shopPath

export function productPath(slug: string): string {
  return `/product/${slug}`
}

export function categoryPath(categoryId: string): string {
  return `/shop/category/${categoryId}`
}

export function hotelEntryUrl(hotelCode: string, slug = catalogConfig.hotelSlug): string {
  const base = (appConfig.appUrl || '').replace(/\/$/, '') || ''
  return `${base}/hotel/${slug}?ref=${encodeURIComponent(hotelCode)}`
}
