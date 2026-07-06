<template>
  <AdminCommerceTabs>
    <header class="admin-page-intro">
      <h2>Orders</h2>
      <p>Select an order to view line items, payment info, and update its status.</p>
    </header>

    <AdminOrdersMicroDashboard :summary="summary" :active-tab="activeTab" />

    <AdminPillTabs
      v-model="activeTab"
      aria-label="Order type"
      :tabs="orderTabs"
    />

    <div v-if="loading" class="admin-loading">Loading orders…</div>
    <p v-else-if="error" class="admin-error">{{ error }}</p>
    <div v-else class="admin-card">
      <div v-if="filteredOrders.length" class="admin-table-wrap">
        <table class="admin-table admin-table--clickable">
          <thead>
            <tr>
              <th>Order</th>
              <th>Guest</th>
              <th>Hotel</th>
              <th>Type</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              tabindex="0"
              @click="openDetail(order.id)"
              @keydown.enter="openDetail(order.id)"
            >
              <td>
                <strong>#{{ shortRef(order.id) }}</strong>
                <br><small>{{ order.item_count }} {{ order.item_count === 1 ? 'item' : 'items' }}</small>
              </td>
              <td>
                <strong>{{ order.customer_name }}</strong>
                <br><small>{{ order.customer_phone }}</small>
                <span v-if="order.room_number"><br><small>Room {{ order.room_number }}</small></span>
              </td>
              <td>{{ order.hotel_name }}</td>
              <td>
                <span class="admin-order-type" :class="`admin-order-type--${order.type}`">
                  {{ orderTypeLabel(order.type) }}
                </span>
              </td>
              <td>{{ formatPrice(order.total_amount, order.currency) }}</td>
              <td>
                <span class="admin-badge" :class="orderStatusBadgeClass(order.status)">{{ order.status }}</span>
              </td>
              <td>
                {{ formatAdminDateTime(order.created_at) }}
                <br><small>{{ order.order_ref || '—' }}</small>
              </td>
              <td>
                <span class="admin-table-action">View →</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="admin-empty admin-card-body">
        No {{ activeTab === 'all' ? '' : `${orderTabs.find((t) => t.id === activeTab)?.label.toLowerCase()} ` }}orders yet.
      </p>
    </div>
  </AdminCommerceTabs>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminCommerceTabs from '@/components/admin/AdminCommerceTabs.vue'
import AdminOrdersMicroDashboard from '@/components/admin/AdminOrdersMicroDashboard.vue'
import AdminPillTabs from '@/components/admin/AdminPillTabs.vue'
import { fetchOrderSummary, fetchOrders } from '@/api/admin'
import { getApiError } from '@/api/client'
import type { AdminOrder, OrderSummary } from '@/types/auth'
import {
  formatAdminDateTime,
  orderStatusBadgeClass,
  orderTypeLabel,
  shortRef,
} from '@/utils/adminOrders'
import { formatPrice } from '@/utils/commerce'

const route = useRoute()
const router = useRouter()

const orders = ref<AdminOrder[]>([])
const summary = ref<OrderSummary | null>(null)
const loading = ref(true)
const error = ref('')
const activeTab = ref('all')

const productOrders = computed(() => orders.value.filter((o) => o.type === 'product'))
const foodOrders = computed(() => orders.value.filter((o) => o.type === 'food'))

const orderTabs = computed(() => [
  { id: 'all', label: 'All orders', count: orders.value.length },
  { id: 'product', label: 'Shop delivery', count: productOrders.value.length },
  { id: 'food', label: 'Room service', count: foodOrders.value.length },
])

const filteredOrders = computed(() => {
  if (activeTab.value === 'product') return productOrders.value
  if (activeTab.value === 'food') return foodOrders.value
  return orders.value
})

watch(activeTab, (tab) => {
  router.replace({ query: { tab } })
})

onMounted(async () => {
  const tab = route.query.tab
  if (tab === 'all' || tab === 'product' || tab === 'food') {
    activeTab.value = tab
  }

  try {
    const [orderList, orderSummary] = await Promise.all([fetchOrders(), fetchOrderSummary()])
    orders.value = orderList
    summary.value = orderSummary
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})

function openDetail(id: string) {
  router.push({
    name: 'admin-order-detail',
    params: { id },
    query: { tab: activeTab.value },
  })
}
</script>

<style scoped>
.admin-table--clickable tbody tr {
  cursor: pointer;
}

.admin-table--clickable tbody tr:hover {
  background: color-mix(in srgb, var(--color-necha-green) 6%, var(--color-surface));
}

.admin-table-action {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-necha-green-dark);
  white-space: nowrap;
}
</style>
