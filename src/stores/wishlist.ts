import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CommerceProduct } from '@/types/commerce'

const STORAGE_KEY = 'necha_wishlist'

function load(): CommerceProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<CommerceProduct[]>(load())

  const count = computed(() => items.value.length)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function has(id: string) {
    return items.value.some((i) => i.id === id)
  }

  function toggle(product: CommerceProduct) {
    if (has(product.id)) {
      remove(product.id)
    } else {
      items.value.push(product)
      persist()
    }
  }

  function remove(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  return { items, count, has, toggle, remove, clear }
})
