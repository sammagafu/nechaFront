<template>
  <div v-if="product" style="padding: 20px">
    <p class="breadcrumb" style="font-size: 11px; color: var(--sf-muted); margin-bottom: 12px">
      <router-link :to="`/hotel/${session.slug}`">{{ session.hotel?.name }}</router-link> / {{ product.name }}
    </p>
    <div style="display: grid; gap: 20px; max-width: 720px; margin: 0 auto">
      <div class="sf-product-image" style="border-radius: 8px; overflow: hidden">
        <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
      </div>
      <div>
        <p v-if="product.brand_name" class="sf-brand">{{ product.brand_name }}</p>
        <h1 style="font-size: 20px; font-weight: 500; margin: 0 0 8px">{{ product.name }}</h1>
        <p style="font-size: 13px; color: var(--sf-muted); margin-bottom: 12px">{{ product.description }}</p>
        <div class="sf-price-tzs" style="font-size: 18px">{{ formatTZS(product.price) }}</div>
        <div class="sf-price-usd">{{ formatUSD(product.price) }}</div>
        <button
          type="button"
          class="sf-add-btn"
          style="width: auto; padding: 10px 20px; border-radius: 6px; margin-top: 16px; font-size: 13px"
          @click="addToCart"
        >
          Add to cart
        </button>
      </div>
    </div>
  </div>
  <div v-else style="padding: 2rem; text-align: center">Loading product…</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProductBySlug } from '@/api/hotels'
import { useHotelSessionStore } from '@/stores/hotelSession'
import { useCartStore } from '@/stores/cart'
import { formatTZS, formatUSD } from '@/composables/usePricing'
import { toCommerceProduct } from '@/utils/storefront'
import type { StorefrontProduct } from '@/types/storefront'

const route = useRoute()
const session = useHotelSessionStore()
const cart = useCartStore()
const product = ref<StorefrontProduct | null>(null)

onMounted(async () => {
  const slug = route.params.slug as string
  const productSlug = route.params.productSlug as string
  product.value = await fetchProductBySlug(slug, productSlug)
})

function addToCart() {
  if (!product.value || !session.hotel) return
  cart.add(toCommerceProduct(product.value, session.slug, session.hotel.code))
}
</script>
