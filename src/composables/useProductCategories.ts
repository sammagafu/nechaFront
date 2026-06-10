import { computed, ref, watch, type Ref } from 'vue'
import { productCategories } from '@/config/storefront'
import type { StorefrontProduct } from '@/types/storefront'

export function useProductCategoryFilter(products: Ref<StorefrontProduct[]>) {
  const activeCategory = ref('all')

  const visibleCategories = computed(() => {
    const present = new Set(products.value.map((p) => normalizeCategory(p.category)))
    return productCategories.filter((c) => c.id === 'all' || present.has(c.id))
  })

  const filteredProducts = computed(() => {
    if (activeCategory.value === 'all') return products.value
    return products.value.filter((p) => normalizeCategory(p.category) === activeCategory.value)
  })

  watch(visibleCategories, (cats) => {
    if (!cats.some((c) => c.id === activeCategory.value)) {
      activeCategory.value = 'all'
    }
  })

  return { activeCategory, visibleCategories, filteredProducts }
}

/** Maps legacy or alternate category values to canonical pill ids. */
export function normalizeCategory(category: string): string {
  const key = category.trim().toLowerCase().replace(/[\s-]+/g, '_')
  const aliases: Record<string, string> = {
    skincare: 'skin_care',
    skin: 'skin_care',
    haircare: 'hair_care',
    hair: 'hair_care',
    personalcare: 'personal_care',
    body_care: 'personal_care',
    body: 'personal_care',
  }
  return aliases[key] ?? key
}

export function categoryCounts(products: StorefrontProduct[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const p of products) {
    const id = normalizeCategory(p.category)
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  return counts
}
