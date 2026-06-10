<template>
  <svg
    :class="['ui-icon', `ui-icon--${name}`, { 'ui-icon--filled': filled }]"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="filled ? 0 : strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <g v-html="iconPaths[name]" />
  </svg>
</template>

<script setup lang="ts">
import type { IconName } from './icons'
import { iconPaths } from './icons'

withDefaults(
  defineProps<{
    name: IconName
    size?: number
    strokeWidth?: number
    filled?: boolean
  }>(),
  { size: 20, strokeWidth: 1.75, filled: false },
)


</script>

<style scoped>
.ui-icon {
  display: block;
  flex-shrink: 0;
}
</style>
