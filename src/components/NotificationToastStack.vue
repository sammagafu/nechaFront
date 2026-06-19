<template>
  <div class="toast-stack" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="toast in notifications.toasts"
        :key="toast.id"
        class="notify-toast"
        :class="`notify-toast--${toast.severity}`"
        role="status"
      >
        <strong>{{ toast.title }}</strong>
        <span v-if="toast.body">{{ toast.body }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'

const notifications = useNotificationsStore()
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 88px;
  right: max(16px, env(safe-area-inset-right, 0px));
  z-index: 600;
  display: grid;
  gap: 10px;
  width: min(360px, calc(100vw - 32px));
}

.notify-toast {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
  font-size: 13px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.notify-toast strong {
  font-size: 14px;
}

.notify-toast--success {
  border-color: #b8e2c5;
  background: #f4fbf6;
}

.notify-toast--warning {
  border-color: #f0d7a2;
  background: #fffaf0;
}

.notify-toast--alert {
  border-color: #efb4b4;
  background: #fff5f5;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>
