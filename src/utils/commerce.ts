export function formatPrice(amount: number, currency = 'TZS') {
  if (currency === 'TZS') {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100)
}

export function productFromApi(p: {
  id: string
  slug?: string
  name: string
  description: string
  price: number
  currency: string
  image_url?: string
  stock?: number
  brand_name?: string
}, hotelCode?: string, hotelSlug?: string) {
  return {
    id: p.id,
    slug: p.slug || p.id,
    brandName: p.brand_name || '',
    name: p.name,
    description: p.description,
    price: p.price,
    currency: p.currency,
    imageUrl: p.image_url,
    stock: p.stock,
    hotelCode: hotelCode || '',
    hotelSlug: hotelSlug || hotelCode || '',
  }
}
