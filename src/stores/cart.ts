import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartItem, CommerceProduct } from '@/types/commerce'
import { SHOP_CART_SCOPE, cartStorageKey } from '@/utils/cartScope'

function loadScope(scope: string): CartItem[] {
  try {
    const raw = localStorage.getItem(cartStorageKey(scope))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveScope(scope: string, items: CartItem[]) {
  localStorage.setItem(cartStorageKey(scope), JSON.stringify(items))
}

export const useCartStore = defineStore('cart', () => {
  const scope = ref(SHOP_CART_SCOPE)
  const items = ref<CartItem[]>(loadScope(SHOP_CART_SCOPE))
  const lastAdded = ref<{ id: string; name: string } | null>(null)
  const cartPulse = ref(0)

  const count = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0),
  )

  function setScope(nextScope: string) {
    if (scope.value === nextScope) return
    saveScope(scope.value, items.value)
    scope.value = nextScope
    items.value = loadScope(nextScope)
  }

  function persist() {
    saveScope(scope.value, items.value)
  }

  function add(product: CommerceProduct, quantity = 1) {
    if (!product?.id) return

    const idx = items.value.findIndex((i) => i.id === product.id)
    if (idx >= 0) {
      items.value = items.value.map((item, i) =>
        i === idx ? { ...item, quantity: item.quantity + quantity } : item,
      )
    } else {
      items.value = [...items.value, { ...product, quantity }]
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

  return { scope, items, count, subtotal, lastAdded, cartPulse, setScope, add, updateQuantity, remove, clear }
})
