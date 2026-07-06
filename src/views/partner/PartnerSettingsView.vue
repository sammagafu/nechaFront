<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <div>
        <h2>Property settings</h2>
        <p class="admin-muted">Update contact details and payout account for your hotel.</p>
      </div>
    </header>

    <div v-if="loading" class="admin-loading">Loading settings…</div>
    <div v-else-if="error" class="admin-error">{{ error }}</div>
    <form v-else class="admin-card admin-form" @submit.prevent="save">
      <p v-if="saved" class="admin-success">Settings saved.</p>
      <p v-if="saveError" class="admin-error">{{ saveError }}</p>

      <label>
        Description
        <textarea v-model="form.description" rows="4" />
      </label>
      <label>
        Phone
        <input v-model="form.phone" type="tel" />
      </label>
      <label>
        Email
        <input v-model="form.email" type="email" />
      </label>
      <label>
        Google Maps link
        <input v-model="form.google_maps_url" type="url" placeholder="https://maps.google.com/..." />
      </label>
      <label>
        Selcom payout account (mobile money)
        <input v-model="form.selcom_payout_account" placeholder="+255..." />
      </label>

      <button type="submit" class="admin-btn admin-btn--primary" :disabled="saving">
        {{ saving ? 'Saving…' : 'Save settings' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { fetchPartnerSettings, updatePartnerSettings } from '@/api/partner'
import { getApiError } from '@/api/client'

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const saveError = ref('')
const saved = ref(false)

const form = reactive({
  description: '',
  phone: '',
  email: '',
  google_maps_url: '',
  selcom_payout_account: '',
})

onMounted(async () => {
  try {
    const data = await fetchPartnerSettings()
    form.description = data.description
    form.phone = data.phone
    form.email = data.email
    form.google_maps_url = data.google_maps_url
    form.selcom_payout_account = data.selcom_payout_account
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  saveError.value = ''
  saved.value = false
  try {
    await updatePartnerSettings({ ...form })
    saved.value = true
  } catch (e) {
    saveError.value = getApiError(e)
  } finally {
    saving.value = false
  }
}
</script>
