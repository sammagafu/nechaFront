<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <div>
        <h2>Guest insights</h2>
        <p class="admin-muted">Recent guest stays and scan activity at your property.</p>
      </div>
    </header>

    <div v-if="loading" class="admin-loading">Loading guest stays…</div>
    <div v-else-if="error" class="admin-error">{{ error }}</div>
    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Channel</th>
              <th>Source</th>
              <th>Spend</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stay in stays" :key="stay.id">
              <td>
                {{ stay.user_name || 'Guest' }}
                <br />
                <small class="admin-muted">{{ stay.user_email || stay.referral_code }}</small>
              </td>
              <td>{{ stay.room_number || '—' }}</td>
              <td>{{ stay.channel }}</td>
              <td>{{ stay.source }}</td>
              <td>
                <template v-if="stay.total_amount != null">{{ formatPrice(stay.total_amount, stay.currency || 'TZS') }}</template>
                <template v-else>—</template>
              </td>
              <td>{{ formatDate(stay.created_at) }}</td>
            </tr>
            <tr v-if="!stays.length">
              <td colspan="6" class="admin-empty">No guest activity recorded yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPartnerGuestStays } from '@/api/partner'
import { getApiError } from '@/api/client'
import type { AdminGuestStay } from '@/types/auth'
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
const stays = ref<AdminGuestStay[]>([])

onMounted(async () => {
  try {
    stays.value = await fetchPartnerGuestStays()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
