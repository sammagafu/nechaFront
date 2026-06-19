<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Beauty</p>
      <h1 class="page-title">Beauty products</h1>
      <p class="page-subtitle">Shop curated wellness products at {{ hotel?.name || 'this hotel' }}.</p>
    </header>

    <p v-if="loading" class="muted">Loading products...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <div v-else class="product-grid">
      <ProductCard
        v-for="product in commerceProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { fetchProducts } from '@/api/hotels'
import { getApiError } from '@/api/client'
import { useHotelStore } from '@/stores/hotel'
import { productFromApi } from '@/utils/commerce'
import type { Product } from '@/types/api'

const route = useRoute()
const hotelStore = useHotelStore()
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref('')

const code = computed(() => String(route.params.code))
const hotel = computed(() => hotelStore.currentHotel)
const commerceProducts = computed(() =>
  products.value.map((p) => productFromApi(p, code.value)),
)

async function load() {
  loading.value = true
  error.value = ''
  try {
    if (!hotelStore.currentHotel || hotelStore.hotelCode !== code.value) {
      await hotelStore.loadHotel(code.value)
    }
    products.value = await fetchProducts(code.value)
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(code, load)
</script>
