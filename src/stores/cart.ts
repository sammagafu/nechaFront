import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartItem, CommerceProduct } from '@/types/commerce'

const STORAGE_KEY = 'necha_cart'

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(load())
  const lastAdded = ref<{ id: string; name: string } | null>(null)
  const cartPulse = ref(0)

  const count = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0),
  )

  function persist() {
    save(items.value)
  }

  function add(product: CommerceProduct, quantity = 1) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ ...product, quantity })
    }
    lastAdded.value = { id: product.id, name: product.name }
    cartPulse.value += 1
    persist()
  }

  function updateQuantity(id: string, quantity: number) {
    const item = items.value.find((i) => i.id === id)
    if (!item) return
    if (quantity <= 0) {
      remove(id)
      return
    }
    item.quantity = quantity
    persist()
  }

  function remove(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  return { items, count, subtotal, lastAdded, cartPulse, add, updateQuantity, remove, clear }
})
