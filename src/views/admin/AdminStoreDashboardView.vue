<template>
  <div class="admin-page">
    <header class="admin-page-intro">
      <h2>{{ adminBrand.storeWelcome }}</h2>
      <p>{{ adminBrand.storeSub }}</p>
    </header>

    <div class="admin-store-picker">
      <label>
        Partner hotel
        <select v-model="selectedHotelId" :disabled="hotelsLoading" @change="onHotelChange">
          <option value="">Select a hotel…</option>
          <option v-for="hotel in hotels" :key="hotel.id" :value="hotel.id">
            {{ hotel.name }}
          </option>
        </select>
      </label>
      <div v-if="dashboard?.hotel" class="admin-store-links">
        <router-link
          :to="`/hotel/${dashboard.hotel.slug}?ref=${encodeURIComponent(dashboard.hotel.referral_code || dashboard.hotel.code)}`"
          class="admin-btn admin-btn--ghost"
          target="_blank"
        >
          View storefront
        </router-link>
        <router-link
          :to="`/admin/hotels/${dashboard.hotel.id}/products`"
          class="admin-btn admin-btn--ghost"
        >
          Manage products
        </router-link>
      </div>
    </div>

    <div v-if="!selectedHotelId" class="admin-empty admin-card admin-card-body">
      Choose a partner hotel to view storefront orders, revenue, and product performance.
    </div>

    <div v-else-if="loading" class="admin-loading">Loading store dashboard…</div>
    <div v-else-if="error" class="admin-error">{{ error }}</div>
    <div v-else-if="dashboard" class="admin-analytics-grid">
      <div class="admin-stats">
        <div class="admin-stat">
          <strong>{{ formatPrice(dashboard.total_revenue, dashboard.currency) }}</strong>
          <span>Total revenue</span>
        </div>
        <div class="admin-stat">
          <strong>{{ formatPrice(dashboard.revenue_last_30_days, dashboard.currency) }}</strong>
          <span>Revenue (30d)</span>
        </div>
        <div class="admin-stat">
          <strong>{{ dashboard.orders }}</strong>
          <span>Orders</span>
        </div>
        <div class="admin-stat">
          <strong>{{ dashboard.orders_last_30_days }}</strong>
          <span>Orders (30d)</span>
        </div>
        <div class="admin-stat">
          <strong>{{ dashboard.reservations }}</strong>
          <span>Reservations</span>
        </div>
        <div class="admin-stat">
          <strong>{{ dashboard.pending_orders }}</strong>
          <span>Pending orders</span>
        </div>
      </div>

      <div class="admin-chart-grid">
        <div class="admin-card admin-chart-card">
          <h3>{{ dashboard.hotel.name }} — orders (14d)</h3>
          <AdminTrendChart :points="dashboard.order_trend" value-key="count" />
        </div>
        <div class="admin-card admin-chart-card">
          <h3>Revenue — last 14 days</h3>
          <AdminTrendChart
            :points="dashboard.order_trend"
            value-key="revenue"
            variant="revenue"
            :currency="dashboard.currency"
          />
        </div>
      </div>

      <div class="admin-chart-grid admin-chart-grid--3">
        <div class="admin-card admin-chart-card">
          <h3>Top products by revenue</h3>
          <AdminBarChart :rows="productRows" />
        </div>
        <div class="admin-card admin-chart-card">
          <h3>Orders vs reservations</h3>
          <AdminDonutChart :segments="storeActivitySegments" center-label="Total" />
        </div>
      </div>

      <div class="admin-card">
        <div class="admin-card-head">
          <h2>Recent orders</h2>
          <router-link to="/admin/orders" class="admin-btn admin-btn--ghost">All orders</router-link>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in dashboard.recent_orders" :key="order.id">
                <td>{{ order.customer_name }}</td>
                <td>{{ order.room_number || '—' }}</td>
                <td><span class="admin-badge admin-badge--pending">{{ order.status }}</span></td>
                <td>{{ formatPrice(order.total_amount, order.currency) }}</td>
                <td>{{ formatDate(order.created_at) }}</td>
              </tr>
              <tr v-if="!dashboard.recent_orders.length">
                <td colspan="5" class="admin-empty">No orders for this hotel yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminBarChart from '@/components/admin/AdminBarChart.vue'
import AdminDonutChart from '@/components/admin/AdminDonutChart.vue'
import AdminTrendChart from '@/components/admin/AdminTrendChart.vue'
import { fetchHotels, fetchStoreDashboard } from '@/api/admin'
import { getApiError } from '@/api/client'
import { adminBrand } from '@/config/admin'
import type { AdminHotel, StoreDashboard } from '@/types/auth'
import { CHART_COLORS } from '@/utils/adminCharts'
import { formatPrice } from '@/utils/commerce'

const route = useRoute()
const router = useRouter()

const hotels = ref<AdminHotel[]>([])
const hotelsLoading = ref(true)
const selectedHotelId = ref('')
const dashboard = ref<StoreDashboard | null>(null)
const loading = ref(false)
const error = ref('')

const productRows = computed(() =>
  (dashboard.value?.top_products ?? []).map((product, index) => ({
    label: product.name,
    value: product.revenue,
    display: formatPrice(product.revenue, dashboard.value?.currency ?? 'TZS'),
    color: `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]}, color-mix(in srgb, ${CHART_COLORS[index % CHART_COLORS.length]} 65%, #fff))`,
  })),
)

const storeActivitySegments = computed(() => {
  if (!dashboard.value) return []
  return [
    { label: 'Orders (30d)', value: dashboard.value.orders_last_30_days, color: CHART_COLORS[0] },
    { label: 'Reservations', value: dashboard.value.reservations, color: CHART_COLORS[2] },
    { label: 'Pending', value: dashboard.value.pending_orders + dashboard.value.pending_reservations, color: CHART_COLORS[4] },
  ]
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function loadDashboard(hotelId: string) {
  if (!hotelId) {
    dashboard.value = null
    return
  }
  loading.value = true
  error.value = ''
  try {
    dashboard.value = await fetchStoreDashboard(hotelId)
  } catch (e) {
    dashboard.value = null
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

function onHotelChange() {
  if (!selectedHotelId.value) {
    router.replace({ name: 'admin-store' })
    dashboard.value = null
    return
  }
  router.replace({ name: 'admin-store-hotel', params: { hotelId: selectedHotelId.value } })
  void loadDashboard(selectedHotelId.value)
}

watch(
  () => route.params.hotelId,
  (hotelId) => {
    const id = typeof hotelId === 'string' ? hotelId : ''
    selectedHotelId.value = id
    if (id) void loadDashboard(id)
  },
  { immediate: true },
)

onMounted(async () => {
  try {
    hotels.value = await fetchHotels()
    if (!selectedHotelId.value && hotels.value.length === 1) {
      selectedHotelId.value = hotels.value[0].id
      router.replace({ name: 'admin-store-hotel', params: { hotelId: selectedHotelId.value } })
      await loadDashboard(selectedHotelId.value)
    }
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    hotelsLoading.value = false
  }
})
</script>
