<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <h1>Payout batches</h1>
      <p>Group eligible commission records and release settlement to properties and referral partners.</p>
    </header>

    <div class="admin-card admin-payout-actions">
      <h2>Generate batches</h2>
      <p class="admin-page-lead">
        Creates draft payout batches from commission records marked eligible and not yet batched.
      </p>
      <p v-if="actionError" class="admin-error">{{ actionError }}</p>
      <p v-if="actionSuccess" class="admin-success">{{ actionSuccess }}</p>
      <button
        type="button"
        class="admin-btn admin-btn--primary"
        :disabled="generating"
        @click="generate"
      >
        {{ generating ? 'Generating…' : 'Generate payout batches' }}
      </button>
    </div>

    <div class="admin-card">
      <div class="admin-card-head">
        <h2>All batches</h2>
        <button type="button" class="admin-btn admin-btn--ghost" @click="load">Refresh</button>
      </div>
      <p v-if="error" class="admin-error">{{ error }}</p>
      <div v-if="loading" class="admin-empty">Loading…</div>
      <div v-else-if="batches.length" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Created</th>
              <th>Payee type</th>
              <th>Payee ID</th>
              <th>Records</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="batch in batches" :key="batch.id">
              <td>{{ formatDate(batch.created_at) }}</td>
              <td>{{ payeeLabel(batch.payee_type) }}</td>
              <td><code>{{ batch.payee_id.slice(0, 8) }}…</code></td>
              <td>{{ batch.record_count }}</td>
              <td>{{ formatPrice(batch.total_amount, batch.currency) }}</td>
              <td>
                <span
                  class="admin-badge"
                  :class="batch.status === 'released' ? 'admin-badge--active' : 'admin-badge--inactive'"
                >
                  {{ batch.status }}
                </span>
              </td>
              <td>
                <button
                  v-if="batch.status === 'draft'"
                  type="button"
                  class="admin-btn admin-btn--ghost"
                  :disabled="releasingId === batch.id"
                  @click="release(batch.id)"
                >
                  {{ releasingId === batch.id ? 'Releasing…' : 'Release' }}
                </button>
                <span v-else-if="batch.released_at" class="admin-muted">{{ formatDate(batch.released_at) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="admin-empty">No payout batches yet. Generate batches when commission records are eligible.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPayoutBatches, generatePayoutBatches, releasePayoutBatch } from '@/api/commerce'
import { getApiError } from '@/api/client'
import type { PayoutBatch } from '@/types/commerce'
import { formatPrice } from '@/utils/commerce'

const batches = ref<PayoutBatch[]>([])
const loading = ref(true)
const generating = ref(false)
const releasingId = ref('')
const error = ref('')
const actionError = ref('')
const actionSuccess = ref('')

const payeeLabels: Record<string, string> = {
  property: 'Property',
  influencer: 'Influencer',
  partner_referral: 'Partner referral',
  brand: 'Brand',
  tour_operator: 'Tour operator',
}

function payeeLabel(type: string) {
  return payeeLabels[type] || type
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    batches.value = await fetchPayoutBatches()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function generate() {
  generating.value = true
  actionError.value = ''
  actionSuccess.value = ''
  try {
    const created = await generatePayoutBatches()
    actionSuccess.value = created.length
      ? `Created ${created.length} draft batch${created.length === 1 ? '' : 'es'}.`
      : 'No eligible commission records to batch.'
    await load()
  } catch (e) {
    actionError.value = getApiError(e)
  } finally {
    generating.value = false
  }
}

async function release(id: string) {
  releasingId.value = id
  actionError.value = ''
  actionSuccess.value = ''
  try {
    await releasePayoutBatch(id)
    actionSuccess.value = 'Payout batch released.'
    await load()
  } catch (e) {
    actionError.value = getApiError(e)
  } finally {
    releasingId.value = ''
  }
}

onMounted(() => void load())
</script>

<style scoped>
.admin-page-lead {
  margin: 0 0 1rem;
  font-size: 14px;
  color: var(--color-muted);
}

.admin-payout-actions {
  margin-bottom: 1.25rem;
}

.admin-success {
  margin: 0 0 0.75rem;
  font-size: 14px;
  color: #027a48;
}

.admin-muted {
  font-size: 12px;
  color: var(--color-muted);
}
</style>
