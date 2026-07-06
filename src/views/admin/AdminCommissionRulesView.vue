<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <div>
        <h2>Commission rules</h2>
        <p class="admin-muted">Commercial terms per category — used when computing partner shares.</p>
      </div>
    </header>

    <div v-if="loading" class="admin-loading">Loading rules…</div>
    <div v-else-if="error" class="admin-error">{{ error }}</div>
    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Premium split</th>
              <th>Necha %</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rule in rules" :key="rule.id">
              <td>{{ rule.category }}</td>
              <td>{{ rule.premium_applicable ? 'Yes' : 'Flat' }}</td>
              <td>{{ rule.premium_applicable ? '—' : `${(rule.necha_commission_pct * 100).toFixed(1)}%` }}</td>
              <td>
                <span class="admin-badge" :class="rule.is_active ? 'admin-badge--active' : 'admin-badge--inactive'">
                  {{ rule.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
            <tr v-if="!rules.length">
              <td colspan="4" class="admin-empty">No commission rules configured.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="admin-muted" style="margin-top: 1rem; font-size: 12px">
        Rule editing is managed by the Necha finance team. Contact support to request changes.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchCommissionRules, type CommissionRule } from '@/api/commerce'
import { getApiError } from '@/api/client'

const loading = ref(true)
const error = ref('')
const rules = ref<CommissionRule[]>([])

onMounted(async () => {
  try {
    rules.value = await fetchCommissionRules()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
