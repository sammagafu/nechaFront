<template>
  <div class="admin-bar-chart">
    <div v-for="row in rows" :key="row.label" class="admin-bar-row">
      <span class="admin-bar-label">{{ row.label }}</span>
      <div class="admin-bar-track">
        <div
          class="admin-bar-fill"
          :style="{
            width: `${barWidth(row.value, maxValue)}%`,
            background: row.color || undefined,
          }"
        />
      </div>
      <span class="admin-bar-value">{{ row.display ?? row.value }}</span>
    </div>
    <p v-if="!rows.length" class="admin-empty">No data yet.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { barWidth } from '@/utils/adminCharts'

export interface BarChartRow {
  label: string
  value: number
  display?: string
  color?: string
}

const props = defineProps<{
  rows: BarChartRow[]
}>()

const maxValue = computed(() => Math.max(1, ...props.rows.map((r) => r.value)))
</script>
