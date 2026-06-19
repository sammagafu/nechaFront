<template>
  <div class="view-toggle" role="group" aria-label="Product layout">
    <button
      type="button"
      class="view-toggle-btn"
      :class="{ active: modelValue === 'list' }"
      :aria-pressed="modelValue === 'list'"
      title="2-column list"
      @click="$emit('update:modelValue', 'list')"
    >
      <span class="view-icon view-icon--list" aria-hidden="true" />
      <span class="view-toggle-label">2 col</span>
    </button>
    <button
      type="button"
      class="view-toggle-btn"
      :class="{ active: modelValue === 'grid' }"
      :aria-pressed="modelValue === 'grid'"
      title="4-column grid"
      @click="$emit('update:modelValue', 'grid')"
    >
      <span class="view-icon view-icon--grid" aria-hidden="true" />
      <span class="view-toggle-label">4 grid</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ProductViewMode } from '@/composables/useProductViewMode'

defineProps<{ modelValue: ProductViewMode }>()
defineEmits<{ 'update:modelValue': [value: ProductViewMode] }>()
</script>

<style scoped>
.view-toggle {
  display: inline-flex;
  padding: 3px;
  border-radius: var(--radius-pill);
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
}

.view-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 36px;
  padding: 0.35rem 0.75rem;
  border: none;
  border-radius: var(--radius-pill);
  background: transparent;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-muted);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast), box-shadow var(--transition-fast);
}

.view-toggle-btn.active {
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-xs);
}

.view-icon {
  display: grid;
  gap: 2px;
  width: 14px;
  height: 14px;
}

.view-icon--list {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.view-icon--list::before,
.view-icon--list::after {
  content: '';
  grid-column: 1 / -1;
  border-radius: 1px;
  background: currentColor;
}

.view-icon--list::before {
  grid-row: 1;
}

.view-icon--list::after {
  grid-row: 2;
}

.view-icon--grid {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.view-icon--grid::before {
  content: '';
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  border-radius: 1px;
  background:
    linear-gradient(currentColor, currentColor) 0 0 / calc(50% - 1px) calc(50% - 1px) no-repeat,
    linear-gradient(currentColor, currentColor) 100% 0 / calc(50% - 1px) calc(50% - 1px) no-repeat,
    linear-gradient(currentColor, currentColor) 0 100% / calc(50% - 1px) calc(50% - 1px) no-repeat,
    linear-gradient(currentColor, currentColor) 100% 100% / calc(50% - 1px) calc(50% - 1px) no-repeat;
}

.view-toggle-label {
  line-height: 1;
}

@media (max-width: 420px) {
  .view-toggle-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  .view-toggle-btn {
    padding: 0.35rem 0.55rem;
  }
}
</style>
