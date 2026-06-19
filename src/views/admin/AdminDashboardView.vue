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

    <div v-if="analytics" class="admin-analytics-grid">
      <div class="admin-chart-grid">
        <div class="admin-card admin-chart-card">
          <h3>Orders — last 14 days</h3>
          <AdminTrendChart :points="analytics.order_trend" value-key="count" variant="orders" />
        </div>
        <div class="admin-card admin-chart-card">
          <h3>Revenue — last 14 days</h3>
          <AdminTrendChart
            :points="analytics.order_trend"
            value-key="revenue"
            variant="revenue"
            :currency="analytics.currency"
          />
        </div>
      </div>

      <div class="admin-chart-grid admin-chart-grid--3">
        <div class="admin-card admin-chart-card">
          <h3>Orders by status</h3>
          <AdminDonutChart
            :segments="statusDonutSegments"
            center-label="Orders"
          />
        </div>
        <div class="admin-card admin-chart-card">
          <h3>Activity mix (30d)</h3>
          <AdminDonutChart
            :segments="activityDonutSegments"
            center-label="Events"
          />
        </div>
        <div class="admin-card admin-chart-card">
          <h3>Top hotels by orders</h3>
          <AdminBarChart :rows="topHotelRows" />
        </div>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card-head">
        <h2>{{ adminBrand.quickActionsTitle }}</h2>
        <router-link to="/admin/analytics" class="admin-btn admin-btn--ghost">Full analytics</router-link>
      </div>
      <div class="admin-card-body admin-actions">
        <router-link to="/admin/hotels/new" class="admin-btn admin-btn--primary">Onboard a hotel</router-link>
        <router-link to="/admin/hotels" class="admin-btn admin-btn--ghost">Partner hotels</router-link>
        <router-link to="/admin/discovery" class="admin-btn admin-btn--ghost">Discovery listings</router-link>
        <router-link to="/admin/store" class="admin-btn admin-btn--ghost">Store owner</router-link>
        <router-link to="/admin/orders" class="admin-btn admin-btn--ghost">Guest orders</router-link>
        <router-link :to="demoStorefrontPath" class="admin-btn admin-btn--ghost" target="_blank">Preview demo portal</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminBarChart from '@/components/admin/AdminBarChart.vue'
import AdminDonutChart from '@/components/admin/AdminDonutChart.vue'
import AdminTrendChart from '@/components/admin/AdminTrendChart.vue'
import Icon from '@/components/ui/Icon.vue'
import type { IconName } from '@/components/ui/icons'
import { fetchAnalytics, fetchDashboard } from '@/api/admin'
import { getApiError } from '@/api/client'
import { adminBrand } from '@/config/admin'
import { appConfig } from '@/config/app'
import type { AnalyticsOverview, DashboardStats } from '@/types/auth'
import { CHART_COLORS } from '@/utils/adminCharts'

const STAT_PALETTE = [
  { accent: '#86bc42', soft: 'rgba(134, 188, 66, 0.16)' },
  { accent: '#4f8cff', soft: 'rgba(79, 140, 255, 0.16)' },
  { accent: '#e85d8a', soft: 'rgba(232, 93, 138, 0.16)' },
  { accent: '#f5a623', soft: 'rgba(245, 166, 35, 0.16)' },
  { accent: '#9b6dff', soft: 'rgba(155, 109, 255, 0.16)' },
  { accent: '#2ec4b6', soft: 'rgba(46, 196, 182, 0.16)' },
]

const stats = ref<DashboardStats | null>(null)
const analytics = ref<AnalyticsOverview | null>(null)
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

const statusDonutSegments = computed(() =>
  (analytics.value?.orders_by_status ?? []).map((row, index) => ({
    label: row.status,
    value: row.count,
    color: CHART_COLORS[index % CHART_COLORS.length],
  })),
)

const activityDonutSegments = computed(() => {
  if (!analytics.value) return []
  return [
    {
      label: 'Orders',
      value: analytics.value.orders_last_30_days,
      color: CHART_COLORS[0],
    },
    {
      label: 'Reservations',
      value: analytics.value.reservations_last_30_days,
      color: CHART_COLORS[2],
    },
  ]
})

const topHotelRows = computed(() =>
  (analytics.value?.top_hotels ?? []).map((hotel, index) => ({
    label: hotel.hotel_name,
    value: hotel.order_count,
    display: String(hotel.order_count),
    color: `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]}, color-mix(in srgb, ${CHART_COLORS[index % CHART_COLORS.length]} 70%, #fff))`,
  })),
)

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
    const [dashboard, analyticsData] = await Promise.all([
      fetchDashboard(),
      fetchAnalytics(),
    ])
    stats.value = dashboard
    analytics.value = analyticsData
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
