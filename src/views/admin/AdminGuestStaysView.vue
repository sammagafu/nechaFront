<template>
  <div v-if="loading" class="admin-loading">Loading guest stays…</div>
  <p v-else-if="error" class="admin-error">{{ error }}</p>
  <div v-else class="admin-page">
    <header class="admin-page-intro">
      <h2>Guest hotel context</h2>
      <p>Hotel, room, QR scan time, and purchases — recorded when guests register or book.</p>
    </header>

    <div class="admin-card">
      <div v-if="stays.length" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Hotel</th>
              <th>Channel</th>
              <th>Room</th>
              <th>Source</th>
              <th>Purchased</th>
              <th>Scanned</th>
              <th>Recorded</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stay in stays" :key="stay.id">
              <td>
                <strong>{{ stay.user_name || 'Guest checkout' }}</strong>
                <br><small v-if="stay.user_email">{{ stay.user_email }}</small>
              </td>
              <td>
                {{ stay.hotel_name }}
                <br><small v-if="stay.referral_code">Ref {{ stay.referral_code }}</small>
              </td>
              <td>{{ formatChannel(stay.channel, stay.source) }}</td>
              <td>{{ stay.room_number || '—' }}</td>
              <td>{{ formatSource(stay.source) }}</td>
              <td>
                <span v-if="stay.items_summary">{{ stay.items_summary }}</span>
                <span v-else>—</span>
                <br>
                <small v-if="stay.total_amount != null">
                  {{ stay.currency }} {{ stay.total_amount.toLocaleString() }}
                </small>
              </td>
              <td>{{ stay.scanned_at ? formatDate(stay.scanned_at) : '—' }}</td>
              <td>{{ formatDate(stay.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="admin-empty">No guest stays recorded yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchGuestStays } from '@/api/admin'
import { getApiError } from '@/api/client'
import type { AdminGuestStay } from '@/types/auth'

const stays = ref<AdminGuestStay[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    stays.value = await fetchGuestStays()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function formatSource(source: string) {
  return source.replace(/_/g, ' ')
}

function formatChannel(channel?: string, source?: string) {
  if (channel) return channel
  if (source === 'scan') return 'room'
  return '—'
}
</script>
