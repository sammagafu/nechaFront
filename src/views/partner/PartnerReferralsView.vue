<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <div>
        <h2>Traveller referrals</h2>
        <p class="admin-muted">Introduce travellers before they shop — attribution applies to their orders during the trip.</p>
      </div>
    </header>

    <form class="admin-card admin-form" @submit.prevent="createReferral">
      <h3>New referral</h3>
      <p v-if="formError" class="admin-error">{{ formError }}</p>
      <p v-if="formSuccess" class="admin-success">{{ formSuccess }}</p>
      <div class="admin-form-row">
        <label>Traveller name *<input v-model="form.traveller_name" required /></label>
        <label>Phone *<input v-model="form.traveller_phone" type="tel" required /></label>
      </div>
      <div class="admin-form-row">
        <label>Email<input v-model="form.traveller_email" type="email" /></label>
        <label>Trip context<input v-model="form.trip_context" placeholder="Safari + Zanzibar, 7 nights" /></label>
      </div>
      <button type="submit" class="admin-btn admin-btn--primary" :disabled="saving">
        {{ saving ? 'Creating…' : 'Create referral' }}
      </button>
    </form>

    <div v-if="loading" class="admin-loading">Loading referrals…</div>
    <div v-else-if="error" class="admin-error">{{ error }}</div>
    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Traveller</th>
              <th>Token</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in referrals" :key="row.id">
              <td>
                {{ row.traveller_name }}
                <br />
                <small class="admin-muted">{{ row.traveller_phone }}</small>
              </td>
              <td><code>{{ row.referral_token }}</code></td>
              <td><span class="admin-badge admin-badge--pending">{{ row.status }}</span></td>
              <td>{{ formatDate(row.created_at) }}</td>
            </tr>
            <tr v-if="!referrals.length">
              <td colspan="4" class="admin-empty">No referrals yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { createPartnerReferral, fetchPartnerReferrals, type PartnerReferral } from '@/api/partner'
import { getApiError } from '@/api/client'

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const formError = ref('')
const formSuccess = ref('')
const referrals = ref<PartnerReferral[]>([])

const form = reactive({
  traveller_name: '',
  traveller_phone: '',
  traveller_email: '',
  trip_context: '',
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    referrals.value = await fetchPartnerReferrals()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function createReferral() {
  saving.value = true
  formError.value = ''
  formSuccess.value = ''
  try {
    const created = await createPartnerReferral({ ...form })
    formSuccess.value = `Referral created — token ${created.referral_token}`
    form.traveller_name = ''
    form.traveller_phone = ''
    form.traveller_email = ''
    form.trip_context = ''
    await load()
  } catch (e) {
    formError.value = getApiError(e)
  } finally {
    saving.value = false
  }
}

onMounted(() => void load())
</script>

<style scoped>
.admin-success {
  margin: 0 0 0.75rem;
  font-size: 14px;
  color: #027a48;
}
</style>
