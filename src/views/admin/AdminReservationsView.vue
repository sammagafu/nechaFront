<template>
  <div v-if="loading" class="admin-loading">Loading reservations…</div>
  <p v-else-if="error" class="admin-error">{{ error }}</p>
  <div v-else class="admin-card">
    <div v-if="reservations.length" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Guest</th>
            <th>Hotel</th>
            <th>Type</th>
            <th>Details</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reservations" :key="r.id">
            <td>
              <strong>{{ r.guest_name }}</strong>
              <br><small>{{ r.guest_phone }}</small>
            </td>
            <td>{{ r.hotel_name }}</td>
            <td>{{ r.type }}</td>
            <td>
              <small v-if="r.type === 'hotel'">{{ r.check_in?.slice(0, 10) }} – {{ r.check_out?.slice(0, 10) }}</small>
              <small v-else>{{ r.reservation_date?.slice(0, 16) }} · {{ r.party_size }} guests</small>
            </td>
            <td>
              <select :value="r.status" @change="updateStatus(r.id, ($event.target as HTMLSelectElement).value)">
                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </td>
            <td>{{ formatDate(r.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="admin-empty">No reservations yet.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchReservations, updateReservationStatus } from '@/api/admin'
import { getApiError } from '@/api/client'
import type { AdminReservation } from '@/types/auth'

const reservations = ref<AdminReservation[]>([])
const loading = ref(true)
const error = ref('')
const statuses = ['pending', 'confirmed', 'cancelled', 'failed']

onMounted(async () => {
  try {
    reservations.value = await fetchReservations()
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
    const updated = await updateReservationStatus(id, status)
    const idx = reservations.value.findIndex((r) => r.id === id)
    if (idx >= 0) reservations.value[idx] = updated
  } catch (e) {
    error.value = getApiError(e)
  }
}
</script>
