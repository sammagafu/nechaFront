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
        Points are earned automatically when your orders are confirmed. To redeem, mention your points
        balance at checkout or contact us at <a :href="`mailto:${appConfig.email}`">{{ appConfig.email }}</a>.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchRewardBalance, type RewardLedgerEntry } from '@/api/rewards'
import { getApiError } from '@/api/client'
import { appConfig } from '@/config/app'
import { formatPrice } from '@/utils/commerce'

const balance = ref(0)
const ledger = ref<RewardLedgerEntry[]>([])
const loading = ref(true)
const error = ref('')
const redeemValue = ref(10)

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

onMounted(async () => {
  try {
    const data = await fetchRewardBalance()
    balance.value = data.balance
    ledger.value = data.ledger ?? []
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
</style>
