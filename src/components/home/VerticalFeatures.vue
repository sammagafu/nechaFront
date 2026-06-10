<template>
  <section class="vf" :class="{ 'vf--hotel': variant === 'hotel' }" :aria-label="title">
    <div class="section-inner">
      <header v-if="title" class="vf-head">
        <p v-if="eyebrow" class="vf-eyebrow">{{ eyebrow }}</p>
        <h2 class="vf-title">
          <template v-if="titleAccent && title.includes(titleAccent)">
            {{ titleBeforeAccent }}<em>{{ titleAccent }}</em>
          </template>
          <template v-else>{{ title }}</template>
        </h2>
        <p v-if="subtitle" class="vf-sub">{{ subtitle }}</p>
      </header>

      <div class="vf-grid" :class="{ 'vf-grid--hotel': variant === 'hotel' }">
        <template v-for="(item, index) in items" :key="item.label">
          <router-link
            v-if="item.to"
            :to="item.to"
            class="vf-card"
            :class="{ 'vf-card--featured': index === 0 && variant !== 'hotel' }"
            :style="{ '--vf-tint': item.tint }"
          >
            <span class="vf-card-accent" aria-hidden="true" />
            <span class="vf-card-tag">{{ item.tag }}</span>
            <h3 class="vf-card-title">{{ item.label }}</h3>
            <p class="vf-card-desc">{{ item.description }}</p>
            <span class="vf-card-action">
              {{ item.action }}
              <span class="vf-card-arrow" aria-hidden="true">→</span>
            </span>
          </router-link>
          <a
            v-else
            :href="item.href"
            class="vf-card"
            :class="{ 'vf-card--featured': index === 0 && variant !== 'hotel' }"
            :style="{ '--vf-tint': item.tint }"
            @click="onHashClick($event, item.href)"
          >
            <span class="vf-card-accent" aria-hidden="true" />
            <span class="vf-card-tag">{{ item.tag }}</span>
            <h3 class="vf-card-title">{{ item.label }}</h3>
            <p class="vf-card-desc">{{ item.description }}</p>
            <span class="vf-card-action">
              {{ item.action }}
              <span class="vf-card-arrow" aria-hidden="true">→</span>
            </span>
          </a>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface VerticalFeature {
  tag: string
  label: string
  description: string
  action: string
  tint: string
  to?: string
  href?: string
}

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    titleAccent?: string
    subtitle?: string
    items: VerticalFeature[]
    variant?: 'main' | 'hotel'
  }>(),
  { variant: 'main' },
)

const titleBeforeAccent = computed(() => {
  if (!props.titleAccent || !props.title) return props.title
  const idx = props.title.indexOf(props.titleAccent)
  if (idx < 0) return props.title
  return props.title.slice(0, idx)
})

function onHashClick(event: MouseEvent, href?: string) {
  if (!href?.startsWith('#')) return
  event.preventDefault()
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.vf {
  padding: clamp(2.5rem, 5vw, 4rem) 0;
  background: var(--color-bg-soft);
  border-block: 1px solid var(--color-border);
}

.vf--hotel {
  background: var(--sf-cream, var(--color-bg-soft));
  border-block-color: var(--sf-warm-grey, var(--color-border));
}

.vf-head {
  max-width: 640px;
  margin-bottom: clamp(1.75rem, 4vw, 2.5rem);
}

.vf-eyebrow {
  margin: 0 0 0.6rem;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-necha-green);
}

.vf-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.vf-title em {
  font-style: italic;
  color: var(--color-necha-green-dark);
}

.vf-sub {
  margin: 0.85rem 0 0;
  font-size: 15px;
  line-height: var(--leading-body);
  color: var(--color-body);
  max-width: 48ch;
}

/* Grid */
.vf-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 600px) {
  .vf-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.15rem;
  }

  .vf-grid:not(.vf-grid--hotel) .vf-card--featured {
    grid-column: 1 / -1;
  }
}

@media (min-width: 960px) {
  .vf-grid:not(.vf-grid--hotel) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  .vf-grid:not(.vf-grid--hotel) .vf-card--featured {
    grid-column: span 1;
  }

  .vf-grid--hotel {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Cards */
.vf-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 176px;
  padding: 1.35rem 1.3rem 1.2rem;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base),
    border-color var(--transition-fast);
}

.vf--hotel .vf-card {
  background: var(--sf-white, var(--color-surface));
  border-color: var(--sf-warm-grey, var(--color-border));
  border-radius: var(--radius-lg);
}

.vf-card-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--vf-tint);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.vf-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--vf-tint) 40%, var(--color-border));
  box-shadow: var(--shadow-card);
}

.vf-card:hover .vf-card-accent {
  opacity: 1;
}

.vf-card--featured {
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--vf-tint) 10%, var(--color-surface)) 0%,
    var(--color-surface) 100%
  );
  border-color: color-mix(in srgb, var(--vf-tint) 30%, var(--color-border));
}

.vf-card--featured .vf-card-accent {
  opacity: 1;
}

@media (min-width: 600px) and (max-width: 959px) {
  .vf-card--featured {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto 1fr auto;
    column-gap: 1.5rem;
    align-items: start;
    min-height: auto;
    padding: 1.5rem 1.5rem 1.35rem;
  }

  .vf-card--featured .vf-card-tag {
    grid-column: 1;
  }

  .vf-card--featured .vf-card-title {
    grid-column: 1;
    font-size: clamp(1.5rem, 3vw, 1.85rem);
  }

  .vf-card--featured .vf-card-desc {
    grid-column: 1;
    max-width: none;
  }

  .vf-card--featured .vf-card-action {
    grid-column: 1;
  }
}

.vf-card-tag {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--vf-tint) 12%, var(--color-surface));
  border: 1px solid color-mix(in srgb, var(--vf-tint) 25%, transparent);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--vf-tint);
}

.vf-card-title {
  margin: 0.1rem 0 0;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.2;
  color: var(--color-text);
}

.vf-card-desc {
  margin: 0;
  flex: 1;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-body);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.vf-card-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.35rem;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.vf-card-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-black);
  color: var(--color-white);
  font-size: 13px;
  line-height: 1;
  transition: transform var(--transition-fast), background var(--transition-fast);
}

.vf-card:hover .vf-card-arrow {
  transform: translateX(2px);
  background: var(--vf-tint);
}

/* Dark mode */
[data-theme='dark'] .vf {
  background: var(--color-bg-soft);
}

[data-theme='dark'] .vf-card {
  background: var(--color-surface);
}

[data-theme='dark'] .vf-card--featured {
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--vf-tint) 12%, var(--color-surface)) 0%,
    var(--color-surface) 100%
  );
}

[data-theme='dark'] .vf-card-arrow {
  background: var(--color-necha-green);
}

[data-theme='dark'] .vf-card:hover .vf-card-arrow {
  background: var(--color-necha-green-dark);
}
</style>
