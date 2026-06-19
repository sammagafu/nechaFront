<template>
  <div class="admin-trend-chart" :class="{ 'admin-trend-chart--revenue': variant === 'revenue' }">
    <div
      v-for="point in points"
      :key="point.date"
      class="admin-trend-col"
    >
      <span class="admin-trend-value">{{ formatValue(point) }}</span>
      <div
        class="admin-trend-bar"
        :style="{ height: `${barHeight(point[valueKey], maxValue)}%` }"
        :title="tooltip(point)"
      />
      <span class="admin-trend-label">{{ shortDate(point.date) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DailyMetric } from '@/types/auth'
import { barHeight, maxMetric, shortDate } from '@/utils/adminCharts'
import { formatPrice } from '@/utils/commerce'

const props = withDefaults(
  defineProps<{
    points: DailyMetric[]
    valueKey?: 'count' | 'revenue'
    variant?: 'orders' | 'revenue'
    currency?: string
  }>(),
  { valueKey: 'count', variant: 'orders', currency: 'TZS' },
)

const maxValue = computed(() => maxMetric(props.points, props.valueKey))

function formatValue(point: DailyMetric) {
  if (props.valueKey === 'revenue') {
    return formatPrice(point.revenue, props.currency)
  }
  return String(point.count)
}

function tooltip(point: DailyMetric) {
  if (props.valueKey === 'revenue') {
    return `${formatPrice(point.revenue, props.currency)} revenue`
  }
  return `${point.count} orders`
}
</script>
