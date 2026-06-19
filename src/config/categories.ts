import type { IconName } from '@/components/ui/icons'
import { categoryPath } from '@/config/app'
import { siteImages } from '@/config/images'

export interface ShopCategory {
  id: string
  label: string
  abbr: string
  icon: IconName
  count: number
  image: string
  description: string
}

export const shopCategories: ShopCategory[] = [
  {
    id: 'skin_care',
    label: 'Skin Care',
    abbr: 'SC',
    icon: 'droplet',
    count: 12,
    image: siteImages.categories.skin_care,
    description: 'Cleansers, serums and moisturisers',
  },
  {
    id: 'wellness',
    label: 'Wellness',
    abbr: 'WE',
    icon: 'flower',
    count: 8,
    image: siteImages.categories.wellness,
    description: 'Teas, supplements and recovery',
  },
  {
    id: 'personal_care',
    label: 'Personal Care',
    abbr: 'PC',
    icon: 'bath',
    count: 10,
    image: siteImages.categories.personal_care,
    description: 'Body wash, butter and daily essentials',
  },
  {
    id: 'hair_care',
    label: 'Hair Care',
    abbr: 'HC',
    icon: 'scissors',
    count: 6,
    image: siteImages.categories.hair_care,
    description: 'Oils, treatments and styling',
  },
  {
    id: 'fragrance',
    label: 'Fragrance',
    abbr: 'FR',
    icon: 'spray',
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

export function categoryIcon(id?: string): IconName {
  if (!id) return 'sparkles'
  return shopCategories.find((c) => c.id === id)?.icon ?? 'sparkles'
}
