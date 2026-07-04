<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <h1>Influencers</h1>
      <p>Referral partners paid a share of Necha's margin on attributed orders.</p>
    </header>

    <form class="admin-card admin-form" @submit.prevent="submit">
      <h2>{{ editingId ? 'Edit influencer' : 'Add influencer' }}</h2>
      <p v-if="formError" class="admin-error">{{ formError }}</p>
      <div class="admin-form-row">
        <label>Name *<input v-model="form.name" required /></label>
        <label>Referral code *<input v-model="form.referral_code" required :disabled="!!editingId" /></label>
      </div>
      <div class="admin-form-row">
        <label>Email<input v-model="form.email" type="email" /></label>
        <label>Phone<input v-model="form.phone" type="tel" /></label>
      </div>
      <div class="admin-form-row">
        <label>Commission % of Necha share
          <input v-model.number="form.commission_pct" type="number" min="0" max="1" step="0.01" />
        </label>
        <label>Status
          <select v-model="form.status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>
      <label>Selcom payout account<input v-model="form.selcom_payout_account" /></label>
      <label>Agreement reference<input v-model="form.agreement_ref" /></label>
      <div class="admin-actions">
        <button type="submit" class="admin-btn admin-btn--primary" :disabled="saving">
          {{ saving ? 'Saving…' : editingId ? 'Update' : 'Create' }}
        </button>
        <button v-if="editingId" type="button" class="admin-btn admin-btn--ghost" @click="resetForm">Cancel</button>
      </div>
    </form>

    <div class="admin-card">
      <div class="admin-card-head">
        <h2>All influencers</h2>
        <button type="button" class="admin-btn admin-btn--ghost" @click="load">Refresh</button>
      </div>
      <p v-if="error" class="admin-error">{{ error }}</p>
      <div v-if="loading" class="admin-empty">Loading…</div>
      <div v-else-if="items.length" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Referral code</th>
              <th>Commission</th>
              <th>Contact</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td><strong>{{ item.name }}</strong></td>
              <td><code>{{ item.referral_code }}</code></td>
              <td>{{ pctLabel(item.commission_pct) }}</td>
              <td>
                <span v-if="item.email">{{ item.email }}</span>
                <span v-if="item.phone"><br />{{ item.phone }}</span>
              </td>
              <td>
                <span class="admin-badge" :class="item.status === 'active' ? 'admin-badge--active' : 'admin-badge--inactive'">
                  {{ item.status }}
                </span>
              </td>
              <td>
                <button type="button" class="admin-btn admin-btn--ghost" @click="startEdit(item)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="admin-empty">No influencers yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { createInfluencer, fetchInfluencers, updateInfluencer } from '@/api/commerce'
import { getApiError } from '@/api/client'
import type { Influencer } from '@/types/commerce'

const items = ref<Influencer[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const formError = ref('')
const editingId = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  referral_code: '',
  commission_pct: 0.3,
  selcom_payout_account: '',
  agreement_ref: '',
  status: 'active',
})

function pctLabel(v: number) {
  return `${Math.round(v * 100)}%`
}

function resetForm() {
  editingId.value = ''
  form.name = ''
  form.email = ''
  form.phone = ''
  form.referral_code = ''
  form.commission_pct = 0.3
  form.selcom_payout_account = ''
  form.agreement_ref = ''
  form.status = 'active'
  formError.value = ''
}

function startEdit(item: Influencer) {
  editingId.value = item.id
  form.name = item.name
  form.email = item.email
  form.phone = item.phone
  form.referral_code = item.referral_code
  form.commission_pct = item.commission_pct || 0.3
  form.selcom_payout_account = item.selcom_payout_account || ''
  form.agreement_ref = item.agreement_ref || ''
  form.status = item.status
  formError.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    items.value = await fetchInfluencers()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function submit() {
  saving.value = true
  formError.value = ''
  try {
    if (editingId.value) {
      await updateInfluencer(editingId.value, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        commission_pct: form.commission_pct,
        selcom_payout_account: form.selcom_payout_account || undefined,
        agreement_ref: form.agreement_ref || undefined,
        status: form.status,
      })
    } else {
      await createInfluencer({
        name: form.name,
        email: form.email,
        phone: form.phone,
        referral_code: form.referral_code,
        commission_pct: form.commission_pct,
        selcom_payout_account: form.selcom_payout_account || undefined,
        agreement_ref: form.agreement_ref || undefined,
        status: form.status,
      })
    }
    resetForm()
    await load()
  } catch (e) {
    formError.value = getApiError(e)
  } finally {
    saving.value = false
  }
}

onMounted(() => void load())
</script>
