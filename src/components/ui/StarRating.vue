<template>
  <span class="star-rating" :aria-label="`${rating} out of 5 stars`">
    <svg
      v-for="i in 5"
      :key="i"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      :class="{ filled: i <= Math.round(rating) }"
      aria-hidden="true"
    >
      <path
        d="M8 1.5 9.76 5.07l3.94.57-2.85 2.78.67 3.92L8 10.77l-3.52 1.85.67-3.92L2.3 5.64l3.94-.57L8 1.5Z"
        fill="currentColor"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ rating?: number }>(), { rating: 5 })
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: 2px;
  color: var(--color-border);
}

.star-rating svg.filled {
  color: var(--color-black);
}
</style>
