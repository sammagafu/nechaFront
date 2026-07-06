<template>
  <div class="rewards-page page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Necha Rewards</p>
      <h1 class="page-title">Your rewards</h1>
      <p class="page-subtitle">Earn points on every qualifying order and redeem them on your next purchase.</p>
    </header>

    <div v-if="loading" class="rewards-loading muted">Loading your rewards…</div>
    <p v-else-if="error" class="rewards-error">{{ error }}</p>

    <template v-else>
      <div class="card card-elevated rewards-balance">
        <span class="rewards-balance-label">Available points</span>
        <strong class="rewards-balance-value">{{ balance.toLocaleString() }}</strong>
        <span v-if="redeemValue > 0" class="muted">≈ {{ formatPrice(redeemValueTotal) }} in redeem value</span>
      </div>

      <section v-if="redeemEnabled" class="rewards-redeem card card-elevated">
        <h2>Redeem points</h2>
        <p class="muted">Redeem now or apply points at hotel checkout on your next order.</p>
        <form class="rewards-redeem-form" @submit.prevent="submitRedeem">
          <label>
            Points to redeem
            <input v-model.number="redeemPoints" type="number" min="1" :max="balance" required />
          </label>
          <button type="submit" class="btn btn-green" :disabled="redeeming || balance <= 0">
            {{ redeeming ? 'Redeeming…' : 'Redeem points' }}
          </button>
        </form>
        <p v-if="redeemError" class="rewards-error">{{ redeemError }}</p>
        <p v-if="redeemSuccess" class="rewards-success">{{ redeemSuccess }}</p>
      </section>

      <section class="rewards-ledger">
        <h2>Activity</h2>
        <ul v-if="ledger.length" class="rewards-ledger-list">
          <li v-for="entry in ledger" :key="entry.id" class="rewards-ledger-item">
            <div>
              <span class="rewards-entry-type" :class="`rewards-entry-type--${entry.entry_type}`">
                {{ entryLabel(entry.entry_type) }}
              </span>
              <p class="muted">{{ entry.note || '—' }}</p>
            </div>
            <div class="rewards-ledger-meta">
              <strong :class="{ 'rewards-negative': entry.points < 0 }">
                {{ entry.points > 0 ? '+' : '' }}{{ entry.points.toLocaleString() }}
              </strong>
              <small class="muted">{{ formatDate(entry.created_at) }}</small>
            </div>
          </li>
        </ul>
        <p v-else class="muted rewards-empty">
          No points yet. Place an order from a hotel storefront to start earning.
        </p>
      </section>

      <p class="muted rewards-note">
        <template v-if="redeemEnabled">
          Points are earned automatically when your orders are confirmed. Redeem above or apply them at hotel checkout when signed in.
        </template>
        <template v-else>
          Points are earned automatically when your orders are confirmed. Contact us at
          <a :href="`mailto:${appConfig.email}`">{{ appConfig.email }}</a> to redeem.
        </template>
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchRewardBalance, redeemRewardPoints, type RewardLedgerEntry } from '@/api/rewards'
import { getApiError } from '@/api/client'
import { appConfig } from '@/config/app'
import { usePlatformSettings } from '@/composables/usePlatformSettings'
import { formatPrice } from '@/utils/commerce'

const { ensureLoaded, features } = usePlatformSettings()
const redeemEnabled = computed(() => features.value.rewards_redeem_enabled)

const balance = ref(0)
const ledger = ref<RewardLedgerEntry[]>([])
const loading = ref(true)
const error = ref('')
const redeemValue = ref(10)
const redeemPoints = ref(0)
const redeeming = ref(false)
const redeemError = ref('')
const redeemSuccess = ref('')

const redeemValueTotal = computed(() => balance.value * redeemValue.value)

function entryLabel(type: string) {
  if (type === 'earn') return 'Earned'
  if (type === 'redeem') return 'Redeemed'
  if (type === 'expire') return 'Expired'
  return type
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

async function loadBalance() {
  const data = await fetchRewardBalance()
  balance.value = data.balance
  ledger.value = data.ledger ?? []
}

async function submitRedeem() {
  redeemError.value = ''
  redeemSuccess.value = ''
  redeeming.value = true
  try {
    const result = await redeemRewardPoints(redeemPoints.value)
    balance.value = result.balance
    redeemSuccess.value = `Redeemed ${result.redeemed_points.toLocaleString()} points.`
    redeemPoints.value = 0
    await loadBalance()
  } catch (e) {
    redeemError.value = getApiError(e)
  } finally {
    redeeming.value = false
  }
}

onMounted(async () => {
  await ensureLoaded()
  try {
    await loadBalance()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.rewards-page {
  padding-bottom: var(--space-8);
}

.rewards-balance {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  text-align: center;
  padding: var(--space-6);
  margin-bottom: var(--space-5);
}

.rewards-redeem {
  margin-bottom: var(--space-5);
  padding: var(--space-5);
}

.rewards-redeem h2 {
  margin: 0 0 var(--space-2);
}

.rewards-redeem-form {
  display: flex;
  gap: var(--space-3);
  align-items: flex-end;
  flex-wrap: wrap;
  margin-top: var(--space-3);
}

.rewards-redeem-form label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.rewards-redeem-form input {
  min-width: 140px;
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-md, 12px);
  font: inherit;
}

.rewards-balance-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: var(--color-muted, #6b7280);
}

.rewards-balance-value {
  font-size: 2.75rem;
  line-height: 1;
}

.rewards-ledger h2 {
  margin-bottom: var(--space-3);
}

.rewards-ledger-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-2);
}

.rewards-ledger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-md, 12px);
  background: var(--color-surface, #fff);
}

.rewards-entry-type {
  font-weight: 600;
}

.rewards-entry-type--redeem,
.rewards-negative {
  color: #b91c1c;
}

.rewards-entry-type--earn {
  color: #047857;
}

.rewards-ledger-meta {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rewards-note {
  margin-top: var(--space-5);
  font-size: 0.9rem;
}

.rewards-empty,
.rewards-loading {
  padding: var(--space-5) 0;
}

.rewards-error {
  color: #b91c1c;
}

.rewards-success {
  color: #047857;
  margin-top: var(--space-2);
}
</style>
