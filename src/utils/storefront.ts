import type { StorefrontProduct } from '@/types/storefront'
import type { CommerceProduct } from '@/types/commerce'

export function toCommerceProduct(product: StorefrontProduct, hotelSlug: string, hotelCode: string): CommerceProduct {
  return {
    id: product.id,
    slug: product.slug,
    brandName: product.brand_name,
    name: product.name,
    description: product.description,
    price: product.price,
    currency: product.currency,
    hotelCode,
    hotelSlug,
    imageUrl: product.image_url,
    stock: product.stock,
    badge: product.badge,
  }
}

export function badgeLabel(badge: string): string {
  const map: Record<string, string> = {
    african_brand: 'African brand',
    best_seller: 'Best seller',
    new: 'New',
  }
  return map[badge] || badge.replace(/_/g, ' ')
}

export function categoryLabel(category: string): string {
  const id = category.trim().toLowerCase().replace(/[\s-]+/g, '_')
  const labels: Record<string, string> = {
    skin_care: 'Skin care',
    hair_care: 'Hair care',
    personal_care: 'Personal care',
    wellness: 'Wellness',
    fragrance: 'Fragrance',
    accessories: 'Accessories',
  }
  return labels[id] ?? id.replace(/_/g, ' ')
}
