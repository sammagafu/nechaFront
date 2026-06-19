<template>
  <div class="admin-pill-tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="admin-pill-tab"
      :class="{ active: modelValue === tab.id }"
      :aria-selected="modelValue === tab.id"
      @click="$emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
      <span v-if="tab.count !== undefined" class="admin-pill-tab-count">{{ tab.count }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
export type PillTab = {
  id: string
  label: string
  count?: number
}

defineProps<{
  tabs: PillTab[]
  modelValue: string
  ariaLabel?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
