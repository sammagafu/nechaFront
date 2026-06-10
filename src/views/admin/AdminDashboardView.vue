<template>
  <div v-if="loading" class="admin-loading">Loading dashboard…</div>
  <div v-else-if="error" class="admin-error">{{ error }}</div>
  <div v-else-if="stats">
    <div class="admin-stats">
      <div class="admin-stat"><strong>{{ stats.hotels }}</strong><span>Hotels</span></div>
      <div class="admin-stat"><strong>{{ stats.products }}</strong><span>Products</span></div>
      <div class="admin-stat"><strong>{{ stats.orders }}</strong><span>Orders</span></div>
      <div class="admin-stat"><strong>{{ stats.reservations }}</strong><span>Reservations</span></div>
      <div class="admin-stat"><strong>{{ stats.pending_orders }}</strong><span>Pending orders</span></div>
      <div class="admin-stat"><strong>{{ stats.pending_reservations }}</strong><span>Pending reservations</span></div>
    </div>
    <div class="admin-card">
      <div class="admin-card-head">
        <h2>Quick actions</h2>
      </div>
      <div style="padding: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap">
        <router-link to="/admin/hotels/new" class="admin-btn admin-btn--primary">Add hotel</router-link>
        <router-link to="/admin/hotels" class="admin-btn admin-btn--ghost">Manage hotels</router-link>
        <router-link to="/admin/orders" class="admin-btn admin-btn--ghost">View orders</router-link>
        <router-link :to="demoStorefrontPath" class="admin-btn admin-btn--ghost" target="_blank">Preview storefront</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchDashboard } from '@/api/admin'
import { getApiError } from '@/api/client'
import { appConfig } from '@/config/app'
import type { DashboardStats } from '@/types/auth'

const stats = ref<DashboardStats | null>(null)
const loading = ref(true)
const error = ref('')

const demoStorefrontPath = computed(() => {
  const { hotelSlug, hotelCode } = appConfig.demoHotel
  return `/hotel/${hotelSlug}?ref=${encodeURIComponent(hotelCode)}`
})

onMounted(async () => {
  try {
    stats.value = await fetchDashboard()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
