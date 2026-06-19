<template>
  <div class="admin-donut-wrap">
    <div
      class="admin-donut"
      :style="{ background: gradient }"
      role="img"
      :aria-label="ariaLabel"
    >
      <div class="admin-donut-hole">
        <strong>{{ centerValue }}</strong>
        <span>{{ centerLabel }}</span>
      </div>
    </div>
    <ul class="admin-donut-legend">
      <li v-for="segment in segments" :key="segment.label">
        <span class="admin-donut-swatch" :style="{ background: segment.color }" />
        <span class="admin-donut-legend-label">{{ segment.label }}</span>
        <span class="admin-donut-legend-value">{{ segment.display ?? segment.value }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { CHART_COLORS, donutGradient } from '@/utils/adminCharts'

export interface DonutSegment {
  label: string
  value: number
  display?: string
  color?: string
}

const props = withDefaults(
  defineProps<{
    segments: DonutSegment[]
    centerLabel?: string
  }>(),
  { centerLabel: 'Total' },
)

const total = computed(() =>
  props.segments.reduce((sum, segment) => sum + segment.value, 0),
)

const coloredSegments = computed(() =>
  props.segments.map((segment, index) => ({
    ...segment,
    color: segment.color ?? CHART_COLORS[index % CHART_COLORS.length],
  })),
)

const gradient = computed(() =>
  donutGradient(coloredSegments.value, total.value),
)

const centerValue = computed(() => String(total.value))

const ariaLabel = computed(() =>
  coloredSegments.value
    .map((segment) => `${segment.label}: ${segment.value}`)
    .join(', '),
)
</script>
