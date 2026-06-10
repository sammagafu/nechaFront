<template>
  <article class="sf-product-card" :class="{ 'sf-product-card--pop': justAdded }">
    <router-link :to="productLink" class="sf-product-image">
      <img v-if="product.image_url" :src="product.image_url" :alt="product.name" loading="lazy" />
      <div v-else class="sf-product-placeholder" />
      <span v-if="product.badge" class="sf-badge" :class="product.badge">{{ badgeLabel(product.badge) }}</span>
    </router-link>
    <div class="sf-product-body">
      <p v-if="product.brand_name" class="sf-brand">{{ product.brand_name }}</p>
      <router-link :to="productLink" class="sf-product-name">{{ product.name }}</router-link>
      <div class="sf-price-row">
        <div>
          <div class="sf-price-tzs">{{ formatTZS(product.price) }}</div>
          <div class="sf-price-usd">{{ formatUSD(product.price) }}</div>
        </div>
        <button type="button" class="sf-add-btn" aria-label="Add to cart" @click="onAdd">+</button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { StorefrontProduct } from '@/types/storefront'
import { formatTZS, formatUSD } from '@/composables/usePricing'
import { badgeLabel } from '@/utils/storefront'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{
  product: StorefrontProduct
  hotelSlug: string
}>()

const emit = defineEmits<{ add: [product: StorefrontProduct] }>()
const cart = useCartStore()
const justAdded = ref(false)

const productLink = computed(() => `/hotel/${props.hotelSlug}/product/${props.product.slug}`)

watch(
  () => cart.lastAdded,
  (add) => {
    if (add?.id === props.product.id) {
      justAdded.value = true
      setTimeout(() => { justAdded.value = false }, 500)
    }
  },
)

function onAdd() {
  emit('add', props.product)
}
</script>

<style scoped>
.sf-product-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #f1efe8, #e8e4db);
}
</style>
