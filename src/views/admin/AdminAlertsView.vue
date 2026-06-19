<template>
  <div class="admin-page admin-alerts">
    <form class="admin-card form-stack" @submit.prevent="create">
      <h2>Create alert banner</h2>
      <div class="field">
        <label for="alert-title">Title</label>
        <input id="alert-title" v-model="form.title" type="text" required />
      </div>
      <div class="field">
        <label for="alert-body">Message</label>
        <textarea id="alert-body" v-model="form.body" rows="3" required />
      </div>
      <div class="grid grid-2">
        <div class="field">
          <label for="alert-severity">Severity</label>
          <select id="alert-severity" v-model="form.severity">
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="alert">Alert</option>
          </select>
        </div>
        <div class="field">
          <label for="alert-link">Link (optional)</label>
          <input id="alert-link" v-model="form.link" type="text" placeholder="/shop" />
        </div>
      </div>
      <label class="checkbox-row">
        <input v-model="form.is_active" type="checkbox" />
        Active on site
      </label>
      <button class="admin-btn" type="submit" :disabled="saving">{{ saving ? 'Saving…' : 'Create alert' }}</button>
      <p v-if="error" class="admin-error">{{ error }}</p>
    </form>

    <div class="admin-card">
      <h2>All alerts</h2>
      <p v-if="loading" class="admin-loading">Loading…</p>
      <div v-else-if="alerts.length" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Severity</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.id">
              <td>
                <strong>{{ alert.title }}</strong>
                <br><small>{{ alert.body }}</small>
              </td>
              <td>{{ alert.severity }}</td>
              <td>{{ alert.is_active ? 'Yes' : 'No' }}</td>
              <td>
                <button type="button" class="admin-btn admin-btn--ghost" @click="toggle(alert)">
                  {{ alert.is_active ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="admin-empty">No alerts yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { createAdminAlert, fetchAdminAlerts, updateAdminAlert } from '@/api/messaging'
import { getApiError } from '@/api/client'
import type { SystemAlert } from '@/types/messaging'

const alerts = ref<SystemAlert[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')

const form = reactive<{
  title: string
  body: string
  severity: SystemAlert['severity']
  link: string
  is_active: boolean
}>({
  title: '',
  body: '',
  severity: 'info',
  link: '',
  is_active: true,
})

async function load() {
  loading.value = true
  try {
    alerts.value = await fetchAdminAlerts()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function create() {
  saving.value = true
  error.value = ''
  try {
    await createAdminAlert({ ...form })
    form.title = ''
    form.body = ''
    form.link = ''
    await load()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    saving.value = false
  }
}

async function toggle(alert: SystemAlert) {
  try {
    await updateAdminAlert(alert.id, {
      title: alert.title,
      body: alert.body,
      severity: alert.severity,
      link: alert.link,
      is_active: !alert.is_active,
    })
    await load()
  } catch (e) {
    error.value = getApiError(e)
  }
}

onMounted(load)
</script>

