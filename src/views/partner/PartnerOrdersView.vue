<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <div>
        <h2>Orders</h2>
        <p class="admin-muted">Every shop and room-service order placed at your property.</p>
      </div>
    </header>

    <div v-if="loading" class="admin-loading">Loading orders…</div>
    <div v-else-if="error" class="admin-error">{{ error }}</div>
    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Type</th>
              <th>Room</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>
                {{ order.customer_name }}
                <br />
                <small class="admin-muted">{{ order.customer_phone }}</small>
              </td>
              <td>{{ orderTypeLabel(order.type) }}</td>
              <td>{{ order.room_number || '—' }}</td>
              <td>{{ order.item_count }}</td>
              <td><span class="admin-badge admin-badge--pending">{{ order.status }}</span></td>
              <td>{{ formatPrice(order.total_amount, order.currency) }}</td>
              <td>{{ formatDate(order.created_at) }}</td>
            </tr>
            <tr v-if="!orders.length">
              <td colspan="7" class="admin-empty">No orders yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPartnerOrders } from '@/api/partner'
import { getApiError } from '@/api/client'
import type { AdminOrder } from '@/types/auth'
import { formatPrice } from '@/utils/commerce'

const orders = ref<AdminOrder[]>([])
const loading = ref(true)
const error = ref('')

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
    orders.value = await fetchPartnerOrders()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
