<template>
  <div class="admin-page">
    <header class="admin-page-intro">
      <h2>{{ dashboard?.hotel?.name || 'Your property' }}</h2>
      <p v-if="isAffiliatePartner">
        Introduce travellers and track referral attribution from your partner dashboard.
      </p>
      <p v-else>Live storefront performance for your property on Necha Africa.</p>
    </header>

    <div v-if="loading" class="admin-loading">Loading your dashboard…</div>
    <div v-else-if="error" class="admin-error">{{ error }}</div>
    <div v-else-if="dashboard" class="admin-analytics-grid">
      <div v-if="dashboard.hotel" class="admin-store-links">
        <router-link
          v-if="isAffiliatePartner"
          to="/partner/referrals"
          class="admin-btn admin-btn--ghost"
        >
          Manage referrals
        </router-link>
        <router-link
          v-else
          :to="`/hotel/${dashboard.hotel.slug}?ref=${encodeURIComponent(dashboard.hotel.referral_code || dashboard.hotel.code)}`"
          class="admin-btn admin-btn--ghost"
          target="_blank"
        >
          View storefront
        </router-link>
        <span v-if="dashboard.hotel.commission_tier" class="admin-badge admin-badge--pending">
          {{ dashboard.hotel.commission_tier === 'founding' ? 'Founding partner' : 'Standard partner' }}
        </span>
      </div>

      <div class="admin-stats">
        <div class="admin-stat">
          <strong>{{ formatPrice(dashboard.total_revenue, dashboard.currency) }}</strong>
          <span>Total revenue</span>
        </div>
        <div class="admin-stat">
          <strong>{{ formatPrice(dashboard.revenue_last_30_days, dashboard.currency) }}</strong>
          <span>Revenue (30d)</span>
        </div>
        <template v-if="!isAffiliatePartner">
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
        </template>
      </div>

      <template v-if="!isAffiliatePartner">
      <div class="admin-chart-grid">
        <div class="admin-card admin-chart-card">
          <h3>Orders — last 14 days</h3>
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
          <h3>Order volume (30d)</h3>
          <AdminDonutChart :segments="orderActivitySegments" center-label="Orders" />
        </div>
        <div class="admin-card admin-chart-card">
          <h3>Reservations</h3>
          <AdminDonutChart :segments="reservationActivitySegments" center-label="Bookings" />
        </div>
      </div>

      <div class="admin-card">
        <div class="admin-card-head">
          <h2>Recent orders</h2>
          <router-link to="/partner/orders" class="admin-btn admin-btn--ghost">All orders</router-link>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Type</th>
                <th>Room</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in dashboard.recent_orders" :key="order.id">
                <td>{{ order.customer_name }}</td>
                <td>{{ orderTypeLabel(order.type) }}</td>
                <td>{{ order.room_number || '—' }}</td>
                <td><span class="admin-badge admin-badge--pending">{{ order.status }}</span></td>
                <td>{{ formatPrice(order.total_amount, order.currency) }}</td>
                <td>{{ formatDate(order.created_at) }}</td>
              </tr>
              <tr v-if="!dashboard.recent_orders.length">
                <td colspan="6" class="admin-empty">No orders for your property yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </template>

      <div v-else class="admin-card">
        <h2>Affiliate partner</h2>
        <p class="admin-muted">
          Create traveller referrals so orders during their trip are attributed to your account.
          Commission payouts appear under Payouts once released by Necha.
        </p>
        <router-link to="/partner/referrals" class="admin-btn admin-btn--primary">Go to referrals</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminBarChart from '@/components/admin/AdminBarChart.vue'
import AdminDonutChart from '@/components/admin/AdminDonutChart.vue'
import AdminTrendChart from '@/components/admin/AdminTrendChart.vue'
import { fetchPartnerDashboard } from '@/api/partner'
import { getApiError } from '@/api/client'
import type { StoreDashboard } from '@/types/auth'
import { CHART_COLORS } from '@/utils/adminCharts'
import { formatPrice } from '@/utils/commerce'

const dashboard = ref<StoreDashboard | null>(null)
const loading = ref(true)
const error = ref('')

const affiliateTypes = new Set(['tour_operator', 'travel_agent', 'airline'])
const isAffiliatePartner = computed(() => affiliateTypes.has(dashboard.value?.hotel?.partner_type || 'hotel'))

const productRows = computed(() =>
  (dashboard.value?.top_products ?? []).map((product, index) => ({
    label: product.name,
    value: product.revenue,
    display: formatPrice(product.revenue, dashboard.value?.currency ?? 'TZS'),
    color: `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]}, color-mix(in srgb, ${CHART_COLORS[index % CHART_COLORS.length]} 65%, #fff))`,
  })),
)

const orderActivitySegments = computed(() => {
  if (!dashboard.value) return []
  return [
    { label: 'Last 30 days', value: dashboard.value.orders_last_30_days, color: CHART_COLORS[0] },
    { label: 'Pending', value: dashboard.value.pending_orders, color: CHART_COLORS[4] },
  ]
})

const reservationActivitySegments = computed(() => {
  if (!dashboard.value) return []
  return [
    { label: 'Total', value: dashboard.value.reservations, color: CHART_COLORS[2] },
    { label: 'Pending', value: dashboard.value.pending_reservations, color: CHART_COLORS[4] },
  ]
})

function orderTypeLabel(type: string) {
  if (type === 'product') return 'Shop delivery'
  if (type === 'food') return 'Room service'
  return type
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  try {
    dashboard.value = await fetchPartnerDashboard()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
