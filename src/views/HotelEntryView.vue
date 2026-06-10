<template>
  <div class="page-wrap">
    <section v-if="loading" class="card muted">Loading hotel...</section>
    <section v-else-if="error" class="card error">{{ error }}</section>
    <template v-else-if="hotel">
      <header class="page-hero">
        <p class="eyebrow">Hotel portal</p>
        <h1 class="page-title">{{ hotel.name }}</h1>
        <p class="page-subtitle">{{ hotel.description }}</p>
        <p class="muted">{{ hotel.address }}, {{ hotel.city }}, {{ hotel.country }}</p>
        <p class="muted">Phone: {{ hotel.phone }}</p>
      </header>
      <div class="grid grid-2">
        <router-link :to="`/h/${code}/products`" class="card action-tile">Beauty products</router-link>
        <router-link :to="`/h/${code}/reserve/room`" class="card action-tile">Reserve a room</router-link>
        <router-link :to="`/h/${code}/reserve/table`" class="card action-tile">Reserve a table</router-link>
        <router-link :to="`/h/${code}/order/food`" class="card action-tile">Order food</router-link>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHotelStore } from '@/stores/hotel'

const route = useRoute()
const hotelStore = useHotelStore()

const code = computed(() => String(route.params.code))
const hotel = computed(() => hotelStore.currentHotel)
const loading = computed(() => hotelStore.loading)
const error = computed(() => hotelStore.error)

async function load() {
  await hotelStore.loadHotel(code.value)
}

onMounted(load)
watch(code, load)
</script>
