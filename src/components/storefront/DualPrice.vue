<template>
  <span class="dual-price" :class="{ 'dual-price--stack': stack }">
    <span class="dual-price-tzs">{{ tzs }}</span>
    <span class="dual-price-usd">{{ usd }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePlatformSettings } from '@/composables/usePlatformSettings'

const props = withDefaults(
  defineProps<{
    amountTzs: number
    stack?: boolean
  }>(),
  { stack: false },
)

const { ensureLoaded, formatDualPrice } = usePlatformSettings()

onMounted(() => {
  void ensureLoaded()
})

const tzs = computed(() => formatDualPrice(props.amountTzs).tzs)
const usd = computed(() => formatDualPrice(props.amountTzs).usd)
</script>

<style scoped>
.dual-price {
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.dual-price--stack {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
}

.dual-price-tzs {
  font-weight: inherit;
  color: inherit;
}

.dual-price-usd {
  font-size: 0.85em;
  color: var(--color-muted, var(--sf-muted));
  font-weight: 500;
}
</style>
