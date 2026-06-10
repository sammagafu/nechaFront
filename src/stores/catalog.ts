import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchProductsBySlug, fetchProductBySlug } from '@/api/hotels'
import { getApiError } from '@/api/client'
import { catalogConfig } from '@/config/app'
import { toCommerceProduct } from '@/utils/storefront'
import type { CommerceProduct } from '@/types/commerce'
import type { StorefrontProduct } from '@/types/storefront'

export const useCatalogStore = defineStore('catalog', () => {
  const products = ref<StorefrontProduct[]>([])
  const loading = ref(false)
  const error = ref('')
  const loaded = ref(false)

  const commerceProducts = computed(() =>
    products.value.map((p) =>
      toCommerceProduct(p, catalogConfig.hotelSlug, catalogConfig.hotelCode),
    ),
  )

  const featuredProducts = computed(() =>
    commerceProducts.value.filter((p) => {
      const raw = products.value.find((r) => r.id === p.id)
      return raw?.is_featured
    }),
  )

  async function load(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = ''
    try {
      products.value = await fetchProductsBySlug(catalogConfig.hotelSlug, false)
      loaded.value = true
    } catch (e) {
      error.value = getApiError(e)
      products.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(slug: string): Promise<CommerceProduct | null> {
    try {
      const product = await fetchProductBySlug(catalogConfig.hotelSlug, slug)
      return toCommerceProduct(product, catalogConfig.hotelSlug, catalogConfig.hotelCode)
    } catch {
      return null
    }
  }

  function findBySlug(slug: string) {
    return commerceProducts.value.find((p) => p.slug === slug) ?? null
  }

  return {
    products,
    loading,
    error,
    loaded,
    commerceProducts,
    featuredProducts,
    load,
    fetchProduct,
    findBySlug,
  }
})
