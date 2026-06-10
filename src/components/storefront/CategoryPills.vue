<template>
  <div class="category-pills">
    <button
      v-for="cat in categories"
      :key="cat.id"
      type="button"
      class="category-pill"
      :class="{ active: modelValue === cat.id }"
      @click="$emit('update:modelValue', cat.id)"
    >
      {{ cat.label }}
      <span v-if="cat.id !== 'all' && counts.get(cat.id)" class="category-pill-count">{{ counts.get(cat.id) }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StorefrontProduct } from '@/types/storefront'
import { categoryCounts } from '@/composables/useProductCategories'

const props = defineProps<{
  modelValue: string
  categories: Array<{ id: string; label: string }>
  products?: StorefrontProduct[]
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const counts = computed(() => categoryCounts(props.products ?? []))
</script>

<style scoped>
.category-pill-count {
  margin-left: 4px;
  opacity: 0.65;
  font-size: 10px;
}
</style>
