<template>
  <div v-if="loading" class="admin-loading">Loading analytics…</div>
  <div v-else-if="error" class="admin-error">{{ error }}</div>
  <div v-else-if="analytics" class="admin-page admin-analytics-grid">
    <header class="admin-page-intro">
      <h2>{{ adminBrand.analyticsWelcome }}</h2>
      <p>{{ adminBrand.analyticsSub }}</p>
    </header>

    <div class="admin-stats">
      <div class="admin-stat">
        <div class="admin-stat-body">
          <strong>{{ formatPrice(analytics.total_revenue, analytics.currency) }}</strong>
          <span>Total revenue</span>
        </div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat-body">
          <strong>{{ analytics.orders_last_30_days }}</strong>
          <span>Orders (30d)</span>
        </div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat-body">
          <strong>{{ analytics.reservations_last_30_days }}</strong>
          <span>Reservations (30d)</span>
        </div>
      </div>
    </div>

    <div class="admin-chart-grid">
      <div class="admin-card admin-chart-card">
        <h3>Orders — last 14 days</h3>
        <AdminTrendChart :points="analytics.order_trend" value-key="count" />
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
        <AdminDonutChart :segments="statusDonutSegments" center-label="Orders" />
      </div>
      <div class="admin-card admin-chart-card">
        <h3>30-day activity</h3>
        <AdminDonutChart :segments="activityDonutSegments" center-label="Events" />
      </div>
      <div class="admin-card admin-chart-card">
        <h3>Status breakdown</h3>
        <AdminBarChart :rows="statusBarRows" />
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card-head">
        <h2>Top partner hotels</h2>
      </div>
      <div class="admin-card-body">
        <AdminBarChart :rows="hotelRevenueRows" />
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Hotel</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="hotel in analytics.top_hotels" :key="hotel.hotel_id">
              <td>{{ hotel.hotel_name }}</td>
              <td>{{ hotel.order_count }}</td>
              <td>{{ formatPrice(hotel.revenue, analytics.currency) }}</td>
              <td>
                <router-link
                  :to="`/admin/store/${hotel.hotel_id}`"
                  class="admin-btn admin-btn--ghost"
                >
                  Store dashboard
                </router-link>
              </td>
            </tr>
            <tr v-if="!analytics.top_hotels.length">
              <td colspan="4" class="admin-empty">No order data yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminBarChart from '@/components/admin/AdminBarChart.vue'
import AdminDonutChart from '@/components/admin/AdminDonutChart.vue'
import AdminTrendChart from '@/components/admin/AdminTrendChart.vue'
import { fetchAnalytics } from '@/api/admin'
import { getApiError } from '@/api/client'
import { adminBrand } from '@/config/admin'
import type { AnalyticsOverview } from '@/types/auth'
import { CHART_COLORS } from '@/utils/adminCharts'
import { formatPrice } from '@/utils/commerce'

const analytics = ref<AnalyticsOverview | null>(null)
const loading = ref(true)
const error = ref('')

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
    { label: 'Orders', value: analytics.value.orders_last_30_days, color: CHART_COLORS[0] },
    { label: 'Reservations', value: analytics.value.reservations_last_30_days, color: CHART_COLORS[2] },
  ]
})

const statusBarRows = computed(() =>
  (analytics.value?.orders_by_status ?? []).map((row, index) => ({
    label: row.status,
    value: row.count,
    color: `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]}, color-mix(in srgb, ${CHART_COLORS[index % CHART_COLORS.length]} 65%, #fff))`,
  })),
)

const hotelRevenueRows = computed(() =>
  (analytics.value?.top_hotels ?? []).map((hotel, index) => ({
    label: hotel.hotel_name,
    value: hotel.revenue,
    display: formatPrice(hotel.revenue, analytics.value?.currency ?? 'TZS'),
    color: `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]}, color-mix(in srgb, ${CHART_COLORS[index % CHART_COLORS.length]} 65%, #fff))`,
  })),
)

onMounted(async () => {
  try {
    analytics.value = await fetchAnalytics()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
