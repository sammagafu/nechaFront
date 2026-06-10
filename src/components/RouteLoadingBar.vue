<template>
  <div v-show="active" class="route-loading" aria-hidden="true">
    <span class="route-loading-bar" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<style scoped>
.route-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9990;
  height: 2px;
  background: color-mix(in srgb, var(--color-necha-green) 12%, var(--color-border-subtle));
  pointer-events: none;
}

.route-loading-bar {
  display: block;
  height: 100%;
  width: 35%;
  background: linear-gradient(90deg, var(--color-necha-green-dark), var(--color-necha-green));
  box-shadow: 0 0 8px color-mix(in srgb, var(--color-necha-green) 40%, transparent);
  animation: route-bar 0.9s ease-in-out infinite;
}

@keyframes route-bar {
  0% {
    transform: translateX(-110%);
  }
  100% {
    transform: translateX(320%);
  }
}
</style>
