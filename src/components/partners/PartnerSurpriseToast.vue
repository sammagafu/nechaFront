<template>
  <Transition name="pl-surprise-toast">
    <div v-if="visible" class="pl-surprise-toast" role="status">
      <span class="pl-surprise-spark" aria-hidden="true">✦</span>
      <div>
        <strong>{{ title }}</strong>
        <span>{{ subtitle }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    visible: boolean
    title?: string
    subtitle?: string
  }>(),
  {
    title: 'One more thing…',
    subtitle: 'There is a third story in the carousel.',
  },
)
</script>

<style scoped>
.pl-surprise-toast {
  position: fixed;
  top: 72px;
  left: 50%;
  z-index: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: 12px;
  background: rgba(26, 71, 49, 0.94);
  border: 1px solid rgba(116, 198, 157, 0.35);
  color: #fff;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.28);
  transform: translateX(-50%);
  max-width: min(360px, calc(100vw - 2rem));
}

.pl-surprise-spark {
  font-size: 18px;
  color: var(--pl-mint, #74c69d);
  animation: pl-spark-spin 2s linear infinite;
}

.pl-surprise-toast strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
}

.pl-surprise-toast span {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}

.pl-surprise-toast-enter-active {
  animation: pl-toast-in 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.pl-surprise-toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.pl-surprise-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

@keyframes pl-spark-spin {
  to { transform: rotate(360deg); }
}

@keyframes pl-toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-16px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}
</style>
