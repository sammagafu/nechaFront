<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <h1>Inquiries</h1>
      <p>Partnership, brand, contact and event listing submissions.</p>
    </header>

    <div class="admin-toolbar">
      <select v-model="statusFilter">
        <option value="">All statuses</option>
        <option value="new">New</option>
        <option value="read">Read</option>
        <option value="archived">Archived</option>
      </select>
      <select v-model="typeFilter">
        <option value="">All types</option>
        <option value="hotel_partner">Hotel partner</option>
        <option value="brand_partner">Brand partner</option>
        <option value="contact">Contact</option>
        <option value="event_listing">Event listing</option>
        <option value="partner_referral">Partner referral</option>
        <option value="discovery_booking">Discovery booking</option>
        <option value="newsletter">Newsletter</option>
      </select>
      <button type="button" class="admin-btn admin-btn--ghost" @click="load">Refresh</button>
    </div>

    <p v-if="error" class="admin-error">{{ error }}</p>

    <div v-if="loading" class="admin-empty">Loading…</div>
    <div v-else-if="!items.length" class="admin-empty">No inquiries yet.</div>
    <table v-else class="admin-table">
      <thead>
        <tr>
          <th>When</th>
          <th>Type</th>
          <th>Contact</th>
          <th>Details</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ formatDate(item.created_at) }}</td>
          <td>{{ item.type }}</td>
          <td>
            <strong>{{ item.name || item.company || '—' }}</strong><br />
            <span>{{ item.email }}</span>
          </td>
          <td>
            <span v-if="item.location">{{ item.location }} · </span>
            <span v-if="item.category">{{ item.category }}</span>
            <p v-if="item.message" class="inquiry-msg">{{ item.message }}</p>
          </td>
          <td>
            <select :value="item.status" @change="onStatus(item.id, ($event.target as HTMLSelectElement).value)">
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { fetchInquiries, updateInquiryStatus, type InquiryRecord } from '@/api/admin'
import { getApiError } from '@/api/client'

const items = ref<InquiryRecord[]>([])
const loading = ref(false)
const error = ref('')
const statusFilter = ref('')
const typeFilter = ref('')

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    items.value = await fetchInquiries(statusFilter.value || undefined, typeFilter.value || undefined)
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function onStatus(id: string, status: string) {
  try {
    await updateInquiryStatus(id, status)
    await load()
  } catch (e) {
    error.value = getApiError(e)
  }
}

watch([statusFilter, typeFilter], () => void load())
onMounted(() => void load())
</script>

<style scoped>
.inquiry-msg {
  margin: 0.35rem 0 0;
  font-size: 12px;
  color: var(--color-muted);
  max-width: 320px;
}
</style>
