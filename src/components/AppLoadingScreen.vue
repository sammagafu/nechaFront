<template>
  <div class="app-loading" role="status" aria-live="polite" aria-label="Loading">
    <div class="app-loading-inner">
      <img :src="appConfig.logoUrl" alt="NECHA" class="app-loading-logo" width="160" height="48" />
      <div class="app-loading-track" aria-hidden="true">
        <span class="app-loading-bar" />
      </div>
      <p class="app-loading-caption">{{ caption }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appConfig } from '@/config/app'

withDefaults(
  defineProps<{
    caption?: string
  }>(),
  { caption: 'Personal care · Beauty · Wellness' },
)
</script>

<style scoped>
.app-loading {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-black);
  color: var(--color-footer-text);
  overflow: hidden;
}

/* Transition leave classes are applied to this root — don't block clicks while fading out */
.app-loading.boot-fade-leave-active,
.app-loading.boot-fade-leave-from {
  pointer-events: none;
}

.app-loading::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 45% at 50% 100%, color-mix(in srgb, var(--color-necha-green) 18%, transparent), transparent 72%),
    radial-gradient(ellipse 40% 30% at 80% 15%, color-mix(in srgb, var(--color-necha-green-light) 8%, transparent), transparent 70%);
  pointer-events: none;
}

.app-loading-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  padding: 2rem;
  text-align: center;
}

.app-loading-logo {
  height: clamp(36px, 8vw, 48px);
  width: auto;
  display: block;
  animation: boot-logo-in 0.9s var(--ease-out) both;
}

.app-loading-track {
  width: min(200px, 56vw);
  height: 2px;
  background: color-mix(in srgb, var(--color-necha-green) 22%, transparent);
  overflow: hidden;
  border-radius: var(--radius-pill);
}

.app-loading-bar {
  display: block;
  width: 42%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-necha-green-dark),
    var(--color-necha-green) 55%,
    var(--color-necha-green-light)
  );
  border-radius: inherit;
  box-shadow: 0 0 14px color-mix(in srgb, var(--color-necha-green) 55%, transparent);
  animation: boot-progress 1.35s ease-in-out infinite;
}

.app-loading-caption {
  margin: 0;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-footer-muted);
  animation: boot-caption-in 1s 0.2s var(--ease-out) both;
}

@keyframes boot-logo-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes boot-caption-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes boot-progress {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(320%);
  }
}
</style>
