<script setup lang="ts">
import { computed } from 'vue'
import logoUrl from '@/assets/necha-logo.svg'
import { useThemeStore } from '@/stores/theme'

const props = withDefaults(
  defineProps<{
    alt?: string
    width?: number | string
    height?: number | string
    /** Off-white wordmark on always-dark surfaces (admin, loading). */
    onDark?: boolean
  }>(),
  {
    alt: 'Necha Africa',
    width: 120,
    height: 32,
    onDark: false,
  },
)

const theme = useThemeStore()
const isLight = computed(() => props.onDark || theme.mode === 'dark')
</script>

<template>
  <!-- SVG wordmark — canonical asset: frontend/src/assets/necha-logo.svg -->
  <img
    :src="logoUrl"
    :alt="alt"
    :width="width"
    :height="height"
    class="necha-logo"
    :class="{ 'necha-logo--light': isLight }"
    decoding="async"
  />
</template>

<style scoped>
.necha-logo {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  object-fit: contain;
}

/* Black wordmark SVG → warm off-white on dark backgrounds */
.necha-logo--light {
  filter: brightness(0) saturate(100%) invert(94%) sepia(14%) saturate(320%) hue-rotate(355deg) brightness(101%)
    contrast(92%);
}
</style>
