<template>
  <div v-if="loading" class="admin-loading">Loading dashboard…</div>
  <div v-else-if="error" class="admin-error">{{ error }}</div>
  <div v-else-if="stats" class="admin-page">
    <header class="admin-page-intro">
      <h2>{{ adminBrand.dashboardWelcome }}</h2>
      <p>{{ adminBrand.dashboardSub }}</p>
    </header>

    <div class="admin-stats">
      <div
        v-for="(card, index) in statCards"
        :key="card.key"
        class="admin-stat"
        :style="{
          '--stat-accent': statColors[index]?.accent,
          '--stat-soft': statColors[index]?.soft,
        }"
      >
        <div class="admin-stat-icon" aria-hidden="true">
          <Icon :name="card.icon" :size="22" />
        </div>
        <div class="admin-stat-body">
          <strong>{{ card.value }}</strong>
          <span>{{ card.label }}</span>
        </div>
      </div>
    </div>

    <div class="admin-card admin-dashboard-store-cta">
      <div class="admin-card-body">
        <h3>Per-hotel store performance</h3>
        <p>
          Revenue, product sales, and recent guest orders for a partner hotel live on the
          <strong>Store owner</strong> dashboard — pick a hotel there to see store-level detail.
        </p>
        <router-link to="/admin/store" class="admin-btn admin-btn--primary">Open store owner dashboard</router-link>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card-head">
        <h2>{{ adminBrand.quickActionsTitle }}</h2>
        <router-link to="/admin/analytics" class="admin-btn admin-btn--ghost">Platform analytics</router-link>
      </div>
      <div class="admin-card-body admin-actions">
        <router-link to="/admin/hotels/new" class="admin-btn admin-btn--primary">Onboard a hotel</router-link>
        <router-link to="/admin/hotels" class="admin-btn admin-btn--ghost">Partner hotels</router-link>
        <router-link to="/admin/orders" class="admin-btn admin-btn--ghost">Guest orders</router-link>
        <router-link to="/admin/reservations" class="admin-btn admin-btn--ghost">Reservations</router-link>
        <router-link to="/admin/discovery" class="admin-btn admin-btn--ghost">Discovery listings</router-link>
        <router-link :to="demoStorefrontPath" class="admin-btn admin-btn--ghost" target="_blank">Preview demo portal</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import type { IconName } from '@/components/ui/icons'
import { fetchDashboard } from '@/api/admin'
import { getApiError } from '@/api/client'
import { adminBrand } from '@/config/admin'
import { appConfig } from '@/config/app'
import type { DashboardStats } from '@/types/auth'

const STAT_PALETTE = [
  { accent: '#86bc42', soft: 'rgba(134, 188, 66, 0.16)' },
  { accent: '#4f8cff', soft: 'rgba(79, 140, 255, 0.16)' },
  { accent: '#e85d8a', soft: 'rgba(232, 93, 138, 0.16)' },
  { accent: '#f5a623', soft: 'rgba(245, 166, 35, 0.16)' },
  { accent: '#9b6dff', soft: 'rgba(155, 109, 255, 0.16)' },
  { accent: '#2ec4b6', soft: 'rgba(46, 196, 182, 0.16)' },
]

const stats = ref<DashboardStats | null>(null)
const loading = ref(true)
const error = ref('')
const statColors = ref([...STAT_PALETTE])

const demoStorefrontPath = computed(() => {
  const { hotelSlug, hotelCode } = appConfig.demoHotel
  return `/hotel/${hotelSlug}?ref=${encodeURIComponent(hotelCode)}`
})

const statCards = computed(() => {
  if (!stats.value) return []
  const s = stats.value
  return [
    { key: 'hotels', label: 'Hotels', value: s.hotels, icon: 'map-pin' as IconName },
    { key: 'products', label: 'Products', value: s.products, icon: 'package' as IconName },
    { key: 'orders', label: 'Orders', value: s.orders, icon: 'cart' as IconName },
    { key: 'reservations', label: 'Reservations', value: s.reservations, icon: 'spa' as IconName },
    { key: 'pending_orders', label: 'Pending orders', value: s.pending_orders, icon: 'zap' as IconName },
    { key: 'pending_reservations', label: 'Pending reservations', value: s.pending_reservations, icon: 'bell' as IconName },
  ]
})

function shufflePalette() {
  const next = [...STAT_PALETTE]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  statColors.value = next
}

onMounted(async () => {
  shufflePalette()
  try {
    stats.value = await fetchDashboard()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin-dashboard-store-cta h3 {
  margin: 0 0 0.35rem;
  font-size: 15px;
}

.admin-dashboard-store-cta p {
  margin: 0 0 0.85rem;
  max-width: 56ch;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-muted);
}
</style>
