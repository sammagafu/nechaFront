<template>
  <div class="admin-page admin-webhooks">
    <form class="admin-card form-stack" @submit.prevent="create">
      <h2>Add webhook endpoint</h2>
      <div class="field">
        <label for="webhook-url">URL</label>
        <input id="webhook-url" v-model="form.url" type="url" required placeholder="https://example.com/webhooks/necha" />
      </div>
      <div class="field">
        <label for="webhook-desc">Description</label>
        <input id="webhook-desc" v-model="form.description" type="text" />
      </div>
      <div class="field">
        <label for="webhook-events">Events (comma-separated)</label>
        <input
          id="webhook-events"
          v-model="eventsInput"
          type="text"
          required
          placeholder="order.created, reservation.created, chat.started"
        />
      </div>
      <button class="admin-btn" type="submit" :disabled="saving">{{ saving ? 'Saving…' : 'Create webhook' }}</button>
      <p v-if="createdSecret" class="admin-success">Secret (save now): <code>{{ createdSecret }}</code></p>
      <p v-if="error" class="admin-error">{{ error }}</p>
    </form>

    <div class="admin-card">
      <h2>Endpoints</h2>
      <p v-if="loading" class="admin-loading">Loading…</p>
      <div v-else-if="endpoints.length" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>URL</th>
              <th>Events</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="endpoint in endpoints" :key="endpoint.id">
              <td>
                <strong>{{ endpoint.description || 'Webhook' }}</strong>
                <br><small>{{ endpoint.url }}</small>
              </td>
              <td>{{ endpoint.events.join(', ') }}</td>
              <td>{{ endpoint.is_active ? 'Active' : 'Paused' }}</td>
              <td>
                <button type="button" class="admin-btn admin-btn--ghost" @click="toggle(endpoint)">
                  {{ endpoint.is_active ? 'Pause' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="admin-empty">No webhooks configured.</p>
    </div>

    <div class="admin-card">
      <h2>Recent deliveries</h2>
      <div v-if="deliveries.length" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Status</th>
              <th>Code</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="delivery in deliveries" :key="delivery.id">
              <td>{{ delivery.event_type }}</td>
              <td>{{ delivery.status }}</td>
              <td>{{ delivery.response_code || '—' }}</td>
              <td>{{ formatDate(delivery.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="admin-empty">No deliveries yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { createWebhook, fetchWebhookDeliveries, fetchWebhooks, updateWebhook } from '@/api/messaging'
import { getApiError } from '@/api/client'
import type { WebhookDelivery, WebhookEndpoint } from '@/types/messaging'

const endpoints = ref<WebhookEndpoint[]>([])
const deliveries = ref<WebhookDelivery[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const createdSecret = ref('')
const eventsInput = ref('order.created, reservation.created, chat.started')

const form = reactive({
  url: '',
  description: '',
})

async function load() {
  loading.value = true
  try {
    endpoints.value = await fetchWebhooks()
    deliveries.value = await fetchWebhookDeliveries()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function create() {
  saving.value = true
  error.value = ''
  createdSecret.value = ''
  try {
    const result = await createWebhook({
      url: form.url,
      description: form.description,
      events: eventsInput.value.split(',').map((e) => e.trim()).filter(Boolean),
    })
    createdSecret.value = result.secret
    form.url = ''
    form.description = ''
    await load()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    saving.value = false
  }
}

async function toggle(endpoint: WebhookEndpoint) {
  try {
    await updateWebhook(endpoint.id, { is_active: !endpoint.is_active })
    await load()
  } catch (e) {
    error.value = getApiError(e)
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

onMounted(load)
</script>

<style scoped>
.admin-success code {
  word-break: break-all;
}
</style>
