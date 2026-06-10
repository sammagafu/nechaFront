import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CommerceProduct } from '@/types/commerce'

const STORAGE_KEY = 'necha_compare'
const MAX_ITEMS = 4

function load(): CommerceProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useCompareStore = defineStore('compare', () => {
  const items = ref<CommerceProduct[]>(load())

  const count = computed(() => items.value.length)
  const isFull = computed(() => items.value.length >= MAX_ITEMS)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function has(id: string) {
    return items.value.some((i) => i.id === id)
  }

  function toggle(product: CommerceProduct): boolean {
    if (has(product.id)) {
      remove(product.id)
      return true
    }
    if (items.value.length >= MAX_ITEMS) {
      return false
    }
    items.value.push(product)
    persist()
    return true
  }

  function remove(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  return { items, count, isFull, has, toggle, remove, clear, MAX_ITEMS }
})
