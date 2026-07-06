<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <h1>Platform settings</h1>
      <p>Currency conversion, delivery pricing, and feature toggles for the public site.</p>
    </header>

    <p v-if="error" class="admin-error">{{ error }}</p>
    <p v-if="success" class="admin-success">{{ success }}</p>

    <div v-if="loading" class="admin-empty">Loading settings…</div>

    <form v-else class="admin-settings-form" @submit.prevent="save">
      <section class="admin-card">
        <h2>Currency &amp; delivery</h2>
        <p class="admin-page-lead">Same values used by dual-price display and distance-based delivery fees.</p>
        <div class="admin-form-grid">
          <label>
            TZS → USD rate
            <input v-model.number="form.tzs_to_usd_rate" type="number" min="1" step="1" required />
            <span class="admin-hint">Example: 2625 means TZS 262,500 ≈ $100</span>
          </label>
          <label>
            Delivery base fee (TZS)
            <input v-model.number="form.delivery_base_fee_tzs" type="number" min="0" step="100" />
          </label>
          <label>
            Delivery per km (TZS)
            <input v-model.number="form.delivery_per_km_tzs" type="number" min="0" step="100" />
          </label>
        </div>
      </section>

      <section class="admin-card">
        <h2>Feature toggles</h2>
        <p class="admin-page-lead">Turn modules on or off without redeploying. Changes apply immediately.</p>
        <ul class="admin-feature-list">
          <li v-for="flag in featureFlags" :key="flag.key">
            <label class="admin-feature-toggle">
              <input v-model="form.features[flag.key]" type="checkbox" />
              <span>
                <strong>{{ flag.label }}</strong>
                <small>{{ flag.hint }}</small>
              </span>
            </label>
          </li>
        </ul>
      </section>

      <div class="admin-form-actions">
        <button type="submit" class="admin-btn admin-btn--primary" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save settings' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { fetchAdminPlatformSettings, updateAdminPlatformSettings } from '@/api/platform'
import type { PlatformFeatures } from '@/api/inquiries'
import { getApiError } from '@/api/client'

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  tzs_to_usd_rate: 2625,
  delivery_base_fee_tzs: 3000,
  delivery_per_km_tzs: 1000,
  features: {
    rewards_enabled: true,
    rewards_redeem_enabled: false,
    discovery_ticketing_enabled: false,
    partner_portal_enabled: true,
    partner_products_manage_enabled: false,
    dual_currency_enabled: true,
    distance_delivery_enabled: true,
  } as PlatformFeatures,
})

const featureFlags: Array<{ key: keyof PlatformFeatures; label: string; hint: string }> = [
  {
    key: 'dual_currency_enabled',
    label: 'Dual currency (TZS + USD)',
    hint: 'Show approximate USD alongside TZS prices on storefront and checkout.',
  },
  {
    key: 'distance_delivery_enabled',
    label: 'Distance-based delivery',
    hint: 'Use hotel + guest coordinates for delivery fee when available.',
  },
  {
    key: 'rewards_enabled',
    label: 'Rewards programme',
    hint: 'Earn points on orders and show the /rewards page.',
  },
  {
    key: 'rewards_redeem_enabled',
    label: 'Rewards redemption',
    hint: 'Let signed-in guests apply points at hotel checkout.',
  },
  {
    key: 'discovery_ticketing_enabled',
    label: 'Discovery in-app booking',
    hint: '“Book via Necha” on discovery detail pages (creates an inquiry).',
  },
  {
    key: 'partner_portal_enabled',
    label: 'Hotel partner portal',
    hint: 'Allow /partner login and dashboard for hotel users.',
  },
  {
    key: 'partner_products_manage_enabled',
    label: 'Partner product self-service',
    hint: 'Show manage-products guidance in the partner portal (catalog changes still via Necha).',
  },
]

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchAdminPlatformSettings()
    form.tzs_to_usd_rate = data.tzs_to_usd_rate
    form.delivery_base_fee_tzs = data.delivery_base_fee_tzs
    form.delivery_per_km_tzs = data.delivery_per_km_tzs
    form.features = { ...form.features, ...data.features }
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    await updateAdminPlatformSettings({
      tzs_to_usd_rate: form.tzs_to_usd_rate,
      delivery_base_fee_tzs: form.delivery_base_fee_tzs,
      delivery_per_km_tzs: form.delivery_per_km_tzs,
      features: { ...form.features },
    })
    success.value = 'Settings saved.'
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<style scoped>
.admin-settings-form {
  display: grid;
  gap: 1.25rem;
}

.admin-form-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.admin-form-grid label {
  display: grid;
  gap: 0.35rem;
  font-size: 13px;
  font-weight: 500;
}

.admin-form-grid input {
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font: inherit;
}

.admin-hint {
  font-size: 11px;
  font-weight: 400;
  color: var(--color-muted);
}

.admin-feature-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.admin-feature-toggle {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  cursor: pointer;
}

.admin-feature-toggle input {
  margin-top: 0.2rem;
}

.admin-feature-toggle strong {
  display: block;
  font-size: 14px;
}

.admin-feature-toggle small {
  display: block;
  margin-top: 0.15rem;
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1.45;
}

.admin-form-actions {
  display: flex;
  justify-content: flex-end;
}

.admin-success {
  color: #047857;
  margin: 0 0 1rem;
}
</style>
