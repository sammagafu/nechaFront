<template>
  <div class="sticky-cart-bar">
    <div>
      <div v-if="count === 0" style="font-size: 12px; color: var(--sf-cream)">Your cart is empty</div>
      <div v-else style="font-size: 12px; color: var(--sf-cream)">{{ count }} {{ count === 1 ? 'item' : 'items' }} in your cart</div>
      <div style="font-size: 10px; color: var(--sf-muted); margin-top: 2px">
        {{ count === 0 ? 'Add products above to get started' : formatTZS(total) }}
      </div>
    </div>
    <router-link
      :to="checkoutLink"
      class="checkout-btn"
      :class="count > 0 ? 'active' : 'disabled'"
      :aria-disabled="count === 0"
      @click.prevent="count > 0 ? $router.push(checkoutLink) : undefined"
    >
      Go to checkout →
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { formatTZS } from '@/composables/usePricing'

const props = defineProps<{ hotelSlug: string }>()
const cart = useCartStore()

const count = computed(() => cart.count)
const total = computed(() => cart.subtotal)
const checkoutLink = computed(() => `/hotel/${props.hotelSlug}/checkout`)
</script>
