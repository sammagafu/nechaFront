<template>
  <div v-if="summary" class="admin-micro-dashboard" aria-label="Orders overview">
    <article
      v-for="card in cards"
      :key="card.key"
      class="admin-micro-stat"
      :class="{ 'admin-micro-stat--accent': card.accent }"
    >
      <strong>{{ card.value }}</strong>
      <span>{{ card.label }}</span>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderSummary } from '@/types/auth'
import { formatPrice } from '@/utils/commerce'

const props = defineProps<{
  summary: OrderSummary | null
  activeTab?: string
}>()

const cards = computed(() => {
  if (!props.summary) return []
  const s = props.summary
  const currency = s.currency || 'TZS'
  const allCards = [
    { key: 'total', label: 'Total orders', value: String(s.total), accent: props.activeTab === 'all' },
    { key: 'pending', label: 'Pending', value: String(s.pending), accent: false },
    { key: 'in_progress', label: 'In progress', value: String(s.in_progress), accent: false },
    { key: 'today', label: 'Today', value: String(s.orders_today), accent: false },
    { key: 'revenue', label: 'Revenue (30d)', value: formatPrice(s.revenue_last_30_days, currency), accent: false },
    { key: 'product', label: 'Shop delivery', value: String(s.product_orders), accent: props.activeTab === 'product' },
    { key: 'food', label: 'Room service', value: String(s.food_orders), accent: props.activeTab === 'food' },
  ]
  return allCards
})
</script>
