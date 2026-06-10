<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="theme.toggle()"
  >
    <Icon :name="mode === 'dark' ? 'sun' : 'moon'" :size="20" />
    <span class="theme-toggle-label">{{ mode === 'dark' ? 'Light' : 'Dark' }}</span>
  </button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Icon from '@/components/ui/Icon.vue'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
const { mode } = storeToRefs(theme)
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface-elevated);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.theme-toggle:hover {
  border-color: var(--color-muted);
  background: var(--color-bg-soft);
}

.theme-toggle-label {
  display: none;
}

@media (min-width: 1200px) {
  .theme-toggle-label {
    display: inline;
  }
}
</style>
