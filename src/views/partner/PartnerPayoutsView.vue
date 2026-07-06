<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <div>
        <h2>Payouts &amp; commissions</h2>
        <p class="admin-muted">Your property share from orders fulfilled through Necha.</p>
      </div>
    </header>

    <div v-if="loading" class="admin-loading">Loading commission records…</div>
    <div v-else-if="error" class="admin-error">{{ error }}</div>
    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Category</th>
              <th>GMV</th>
              <th>Your share</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td><code>{{ row.order_id.slice(0, 8) }}</code></td>
              <td>{{ row.category }}</td>
              <td>{{ formatPrice(row.gmv, 'TZS') }}</td>
              <td>{{ formatPrice(row.property_share, 'TZS') }}</td>
              <td><span class="admin-badge admin-badge--pending">{{ row.status }}</span></td>
              <td>{{ formatDate(row.created_at) }}</td>
            </tr>
            <tr v-if="!rows.length">
              <td colspan="6" class="admin-empty">No commission records yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPartnerCommissions, type PartnerCommission } from '@/api/partner'
import { getApiError } from '@/api/client'
import { formatPrice } from '@/utils/commerce'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loading = ref(true)
const error = ref('')
const rows = ref<PartnerCommission[]>([])

onMounted(async () => {
  try {
    rows.value = await fetchPartnerCommissions()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
