<template>
  <div v-if="product" class="hotel-product-page">
    <StorefrontPageHero
      badge="Product"
      :title="product.name"
      :description="product.description"
    />
    <div class="hotel-product-body">
      <div class="sf-product-image hotel-product-image">
        <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
      </div>
      <div>
        <p v-if="product.brand_name" class="sf-brand">{{ product.brand_name }}</p>
        <div class="sf-price-tzs hotel-product-price">{{ formatTZS(product.price) }}</div>
        <div class="sf-price-usd">{{ formatUSD(product.price) }}</div>
        <button type="button" class="sf-btn-primary hotel-product-add" @click="addToCart">
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
import StorefrontPageHero from '@/components/storefront/StorefrontPageHero.vue'
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

<style scoped>
.hotel-product-body {
  display: grid;
  gap: 20px;
  max-width: 720px;
  margin: 0 auto;
  padding: 1.25rem 0 2rem;
}

.hotel-product-image {
  border-radius: 8px;
  overflow: hidden;
}

.hotel-product-price {
  font-size: 18px;
  margin-top: 0.5rem;
}

.hotel-product-add {
  margin-top: 1rem;
}
</style>
