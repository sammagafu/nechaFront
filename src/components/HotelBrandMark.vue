<script setup lang="ts">
import { computed } from 'vue'
import { hotelInitials, resolveHotelLogoUrl } from '@/utils/hotelBrand'

const props = withDefaults(
  defineProps<{
    name: string
    initials?: string
    logoUrl?: string
    size?: 'sm' | 'md' | 'lg'
    onDark?: boolean
  }>(),
  {
    initials: '',
    logoUrl: '',
    size: 'md',
    onDark: false,
  },
)

const mark = computed(() => props.initials.trim() || hotelInitials(props.name))
const logoSrc = computed(() => resolveHotelLogoUrl(props.logoUrl))
</script>

<template>
  <span
    class="hotel-brand-mark"
    :class="[`hotel-brand-mark--${size}`, { 'hotel-brand-mark--on-dark': onDark }]"
    :title="name"
  >
    <img
      v-if="logoSrc"
      :src="logoSrc"
      :alt="`${name} logo`"
      class="hotel-brand-mark__logo"
      loading="lazy"
      decoding="async"
    />
    <span v-else class="hotel-brand-mark__initials" aria-hidden="true">{{ mark }}</span>
  </span>
</template>

<style scoped>
.hotel-brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  background: color-mix(in srgb, var(--sf-charcoal, #2c2c2a) 8%, #fff);
  border: 0.5px solid color-mix(in srgb, var(--sf-warm-grey, #d3d1c7) 80%, transparent);
}

.hotel-brand-mark--on-dark {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
}

.hotel-brand-mark--sm {
  width: 28px;
  height: 28px;
  border-radius: 8px;
}

.hotel-brand-mark--md {
  width: 36px;
  height: 36px;
}

.hotel-brand-mark--lg {
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.hotel-brand-mark__logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
  background: #fff;
}

.hotel-brand-mark--on-dark .hotel-brand-mark__logo {
  background: rgba(255, 255, 255, 0.96);
}

.hotel-brand-mark__initials {
  font-family: var(--sf-font-mono, ui-monospace, monospace);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--sf-charcoal, #2c2c2a);
}

.hotel-brand-mark--sm .hotel-brand-mark__initials {
  font-size: 0.62rem;
}

.hotel-brand-mark--lg .hotel-brand-mark__initials {
  font-size: 0.85rem;
}

.hotel-brand-mark--on-dark .hotel-brand-mark__initials {
  color: rgba(255, 255, 255, 0.92);
}
</style>
