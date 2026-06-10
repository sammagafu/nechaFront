import { categoryPath } from '@/config/app'
import { siteImages } from '@/config/images'

export interface ShopCategory {
  id: string
  label: string
  abbr: string
  count: number
  image: string
  description: string
}

export const shopCategories: ShopCategory[] = [
  {
    id: 'skin_care',
    label: 'Skin Care',
    abbr: 'SC',
    count: 12,
    image: siteImages.categories.skin_care,
    description: 'Cleansers, serums and moisturisers',
  },
  {
    id: 'wellness',
    label: 'Wellness',
    abbr: 'WE',
    count: 8,
    image: siteImages.categories.wellness,
    description: 'Teas, supplements and recovery',
  },
  {
    id: 'personal_care',
    label: 'Personal Care',
    abbr: 'PC',
    count: 10,
    image: siteImages.categories.personal_care,
    description: 'Body wash, butter and daily essentials',
  },
  {
    id: 'hair_care',
    label: 'Hair Care',
    abbr: 'HC',
    count: 6,
    image: siteImages.categories.hair_care,
    description: 'Oils, treatments and styling',
  },
  {
    id: 'fragrance',
    label: 'Fragrance',
    abbr: 'FR',
    count: 4,
    image: siteImages.categories.fragrance,
    description: 'Room and personal scents',
  },
]

export function categoryShopLink(categoryId: string): string {
  return categoryPath(categoryId)
}

export function isValidCategoryId(id: string): boolean {
  return shopCategories.some((c) => c.id === id)
}
