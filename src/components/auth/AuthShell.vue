<template>
  <div class="auth-shell">
    <div class="auth-shell-ambient" aria-hidden="true">
      <span class="auth-blob auth-blob--a" />
      <span class="auth-blob auth-blob--b" />
    </div>

    <div class="auth-shell-grid">
      <aside class="auth-panel">
        <router-link to="/" class="auth-logo" aria-label="Necha Africa home">
          <NechaLogo :width="128" :height="34" />
        </router-link>

        <p class="auth-eyebrow">{{ eyebrow }}</p>
        <h1 class="auth-title">{{ title }}</h1>
        <p class="auth-lead">{{ lead }}</p>

        <ul class="auth-perks">
          <li v-for="perk in perks" :key="perk.label">
            <span class="auth-perk-icon" aria-hidden="true">
              <Icon :name="perk.icon" :size="18" />
            </span>
            <span>
              <strong>{{ perk.label }}</strong>
              <small>{{ perk.detail }}</small>
            </span>
          </li>
        </ul>

        <p class="auth-quote">
          <span class="auth-quote-mark" aria-hidden="true">“</span>
          {{ quote }}
        </p>
      </aside>

      <section class="auth-stage" :class="{ 'auth-stage--enter': entered }">
        <div class="auth-card">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="auth-footer">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NechaLogo from '@/components/NechaLogo.vue'
import Icon from '@/components/ui/Icon.vue'
import type { IconName } from '@/components/ui/icons'

export interface AuthPerk {
  icon: IconName
  label: string
  detail: string
}

defineProps<{
  eyebrow: string
  title: string
  lead: string
  quote: string
  perks: AuthPerk[]
}>()

const entered = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    entered.value = true
  })
})
</script>

<style scoped>
.auth-shell {
  position: relative;
  min-height: calc(100vh - var(--header-height) - var(--space-8));
  padding: clamp(1.25rem, 4vw, 2.5rem) max(var(--page-gutter), env(safe-area-inset-left))
    max(var(--space-8), env(safe-area-inset-bottom)) max(var(--page-gutter), env(safe-area-inset-right));
  overflow: hidden;
}

.auth-shell-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.auth-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
  opacity: 0.55;
  animation: auth-drift 18s ease-in-out infinite alternate;
}

.auth-blob--a {
  top: -8%;
  left: -6%;
  width: min(420px, 70vw);
  height: min(420px, 70vw);
  background: color-mix(in srgb, var(--color-necha-green) 28%, transparent);
}

.auth-blob--b {
  right: -4%;
  bottom: -12%;
  width: min(360px, 60vw);
  height: min(360px, 60vw);
  background: color-mix(in srgb, var(--color-brand-ink) 12%, var(--color-necha-green-light));
  animation-delay: -6s;
}

@keyframes auth-drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(24px, -18px, 0) scale(1.08);
  }
}

.auth-shell-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  max-width: 1080px;
  margin: 0 auto;
  align-items: center;
}

@media (min-width: 900px) {
  .auth-shell-grid {
    grid-template-columns: minmax(0, 1fr) minmax(340px, 420px);
    gap: clamp(2rem, 5vw, 4rem);
  }
}

.auth-panel {
  display: grid;
  gap: 0.85rem;
  animation: auth-fade-up 0.7s var(--ease-out) both;
}

.auth-logo {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 0.35rem;
}

.auth-eyebrow {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.auth-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5vw, 3.4rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.auth-lead {
  margin: 0;
  max-width: 34ch;
  font-size: 15px;
  line-height: 1.65;
  color: var(--color-body);
}

.auth-perks {
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.auth-perks li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.auth-perk-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--color-necha-green) 14%, var(--color-bg-soft));
  border: 1px solid color-mix(in srgb, var(--color-necha-green) 22%, var(--color-border));
  color: var(--color-necha-green-dark);
}

.auth-perks strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.35;
}

.auth-perks small {
  display: block;
  margin-top: 0.1rem;
  font-size: 13px;
  line-height: 1.45;
  color: var(--color-muted);
}

.auth-quote {
  display: none;
  margin: 0.75rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-style: italic;
  line-height: 1.5;
  color: var(--color-body);
}

.auth-quote-mark {
  color: var(--color-necha-green);
  font-style: normal;
}

@media (min-width: 900px) {
  .auth-quote {
    display: block;
  }
}

.auth-stage {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.55s var(--ease-out),
    transform 0.55s var(--ease-out);
}

.auth-stage--enter {
  opacity: 1;
  transform: translateY(0);
}

.auth-card {
  padding: clamp(1.35rem, 3vw, 1.75rem);
  border-radius: var(--radius-xl);
  background: var(--color-surface-overlay);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-premium);
  backdrop-filter: blur(14px);
}

.auth-footer {
  margin-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: var(--color-body);
}

.auth-footer :deep(a) {
  font-weight: 600;
  color: var(--color-text);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.auth-footer :deep(a:hover) {
  color: var(--color-interactive-hover);
}

@keyframes auth-fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
