import { ref, watch } from 'vue'

export type ProductViewMode = 'grid' | 'list'

const STORAGE_KEY = 'necha_product_view'

function readStored(): ProductViewMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'grid' || v === 'list') return v
  } catch {
    /* ignore */
  }
  return 'grid'
}

export function useProductViewMode() {
  const viewMode = ref<ProductViewMode>(readStored())

  watch(viewMode, (mode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* ignore */
    }
  })

  return { viewMode }
}
