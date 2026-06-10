<template>
  <div v-if="loading" class="admin-loading">Loading orders…</div>
  <p v-else-if="error" class="admin-error">{{ error }}</p>
  <div v-else class="admin-card">
    <div v-if="orders.length" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Hotel</th>
            <th>Type</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>
              <strong>{{ order.customer_name }}</strong>
              <br><small>{{ order.customer_phone }}</small>
              <span v-if="order.room_number"><br><small>Room {{ order.room_number }}</small></span>
            </td>
            <td>{{ order.hotel_name }}</td>
            <td>{{ order.type }}</td>
            <td>{{ order.currency }} {{ order.total_amount.toLocaleString() }}</td>
            <td>
              <select :value="order.status" @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)">
                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td><small>{{ order.kkooapp_ref || '—' }}</small></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="admin-empty">No orders yet.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchOrders, updateOrderStatus } from '@/api/admin'
import { getApiError } from '@/api/client'
import type { AdminOrder } from '@/types/auth'

const orders = ref<AdminOrder[]>([])
const loading = ref(true)
const error = ref('')
const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'failed']

onMounted(async () => {
  try {
    orders.value = await fetchOrders()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

async function updateStatus(id: string, status: string) {
  try {
    const updated = await updateOrderStatus(id, status)
    const idx = orders.value.findIndex((o) => o.id === id)
    if (idx >= 0) orders.value[idx] = updated
  } catch (e) {
    error.value = getApiError(e)
  }
}
</script>
