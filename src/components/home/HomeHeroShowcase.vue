<template>
  <section class="hero-showcase" :aria-label="ariaLabel">
    <div
      class="hero-stage"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @mouseenter="pause"
      @mouseleave="resume"
      @focusin="pause"
      @focusout="resume"
    >
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="hero-slide"
        :class="{ 'hero-slide--active': activeIndex === index }"
        :aria-hidden="activeIndex !== index"
      >
        <div class="hero-slide-backdrop" aria-hidden="true">
          <img
            class="hero-slide-image"
            :src="slide.image"
            :alt="slide.imageAlt"
            :loading="index === 0 ? 'eager' : 'lazy'"
            decoding="async"
          />
        </div>
        <div class="hero-slide-scrim" aria-hidden="true" />
        <div v-if="slide.wordLeft || slide.wordRight" class="hero-slide-words" aria-hidden="true">
          <span v-if="slide.wordLeft" class="hero-word hero-word--left">{{ slide.wordLeft }}</span>
          <span v-if="slide.wordRight" class="hero-word hero-word--right">{{ slide.wordRight }}</span>
        </div>
        <div
          class="hero-slide-content"
          :class="{ 'hero-slide-content--center': contentLayout === 'center' }"
        >
          <div class="hero-slide-copy">
            <p
              class="hero-slide-brand"
              :class="{ 'hero-slide-brand--pill': contentLayout === 'center' }"
            >
              {{ slide.eyebrow }}
            </p>
            <h1
              v-if="slide.headlineHtml"
              class="hero-slide-headline"
              :class="{ 'hero-slide-headline--center': contentLayout === 'center' }"
              v-html="slide.headlineHtml"
            />
            <div
              v-if="contentLayout === 'center' && slide.stats?.length"
              class="hero-slide-stats"
              aria-label="Key figures"
            >
              <div v-for="stat in slide.stats" :key="stat.label" class="hero-slide-stat">
                <span
                  class="hero-slide-stat-value"
                  :class="{ 'hero-slide-stat-value--accent': stat.accent }"
                >
                  {{ stat.value }}
                </span>
                <span class="hero-slide-stat-label">{{ stat.label }}</span>
              </div>
            </div>
            <p class="hero-slide-desc">{{ slide.description }}</p>
            <div v-if="slide.primary || slide.secondary" class="hero-slide-actions">
              <component
                :is="actionTag(slide.primary)"
                v-if="slide.primary"
                v-bind="actionProps(slide.primary)"
                class="hero-slide-cta"
                @click="onAction(slide.primary, $event)"
              >
                {{ slide.primary.label }}
              </component>
              <button
                v-if="slide.secondary"
                type="button"
                class="hero-slide-cta hero-slide-cta--ghost"
                @click="onAction(slide.secondary, $event)"
              >
                {{ slide.secondary.label }}
              </button>
            </div>
          </div>
          <router-link
            v-if="contentLayout !== 'center' && slide.chip?.to"
            :to="slide.chip.to"
            class="hero-product-chip"
          >
            <img v-if="slide.chip.image" :src="slide.chip.image" :alt="slide.chip.imageAlt ?? ''" loading="lazy" />
            <span class="hero-product-chip-text">
              <span class="hero-product-chip-label">{{ slide.chip.label }}</span>
              <span class="hero-product-chip-name">{{ slide.chip.name }}</span>
            </span>
            <Icon name="arrow-right" :size="18" class="hero-product-chip-arrow" />
          </router-link>
          <div
            v-else-if="contentLayout !== 'center' && slide.chip"
            class="hero-product-chip hero-product-chip--static"
          >
            <img v-if="slide.chip.image" :src="slide.chip.image" :alt="slide.chip.imageAlt ?? ''" loading="lazy" />
            <span class="hero-product-chip-text">
              <span class="hero-product-chip-label">{{ slide.chip.label }}</span>
              <span class="hero-product-chip-name">{{ slide.chip.name }}</span>
            </span>
          </div>
        </div>
      </div>

      <button
        v-if="slides.length > 1"
        type="button"
        class="hero-arr hero-arr--prev"
        aria-label="Previous slide"
        @click="prev(true)"
      >
        <Icon name="chevron-left" :size="22" />
      </button>
      <button
        v-if="slides.length > 1"
        type="button"
        class="hero-arr hero-arr--next"
        aria-label="Next slide"
        @click="next(true)"
      >
        <Icon name="chevron-right" :size="22" />
      </button>
    </div>

    <div v-if="slides.length > 1" class="section-inner hero-showcase-inner" :style="{ '--hero-interval': `${intervalMs}ms` }">
      <nav class="hero-brand-nav" :aria-label="navAriaLabel">
        <div class="hero-brand-progress" aria-hidden="true">
          <span
            v-for="(slide, index) in slides"
            :key="slide.id"
            class="hero-brand-seg"
            :class="{ on: activeIndex === index, past: index < activeIndex, 'hero-brand-seg--new': slide.isNew }"
          >
            <span
              v-if="activeIndex === index && autoplay"
              :key="`progress-${activeIndex}`"
              class="hero-brand-seg-fill"
            />
          </span>
        </div>
        <div class="hero-brand-tabs" role="tablist">
          <button
            v-for="(slide, index) in slides"
            :key="slide.id"
            type="button"
            class="hero-brand-tab"
            :class="{ on: activeIndex === index, 'hero-brand-tab--new': slide.isNew }"
            role="tab"
            :aria-selected="activeIndex === index"
            @click="goTo(index)"
          >
            {{ slide.navLabel }}
          </button>
        </div>
        <p v-if="navMeta" class="hero-brand-meta">{{ navMeta }}</p>
      </nav>
      <slot name="below-nav" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'

export type HeroShowcaseAction =
  | { type: 'scroll'; target: string; label: string }
  | { type: 'route'; to: string; label: string }

export interface HeroShowcaseSlide {
  id: string
  image: string
  imageAlt: string
  eyebrow: string
  description: string
  navLabel: string
  navMeta?: string
  wordLeft?: string
  wordRight?: string
  headlineHtml?: string
  stats?: { value: string; label: string; accent?: boolean }[]
  primary?: HeroShowcaseAction
  secondary?: HeroShowcaseAction
  chip?: {
    image?: string
    imageAlt?: string
    label: string
    name: string
    to?: string
  }
  isNew?: boolean
}

const props = withDefaults(
  defineProps<{
    slides: HeroShowcaseSlide[]
    intervalMs?: number
    autoplay?: boolean
    ariaLabel?: string
    navAriaLabel?: string
    modelValue?: number
    contentLayout?: 'default' | 'center'
  }>(),
  {
    intervalMs: 7000,
    autoplay: true,
    ariaLabel: 'Featured showcase',
    navAriaLabel: 'Showcase slides',
    contentLayout: 'default',
  },
)

const emit = defineEmits<{
  'update:modelValue': [index: number]
  'slide-change': [index: number]
}>()

const router = useRouter()
const activeIndex = ref(props.modelValue ?? 0)
const swipeStartX = ref<number | null>(null)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

const navMeta = computed(() => {
  const slide = props.slides[activeIndex.value]
  if (!slide) return ''
  if (slide.navMeta) return slide.navMeta
  return `${String(activeIndex.value + 1).padStart(2, '0')} / ${String(props.slides.length).padStart(2, '0')}`
})

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined && value !== activeIndex.value) activeIndex.value = value
  },
)

watch(activeIndex, (index) => {
  emit('update:modelValue', index)
  emit('slide-change', index)
})

function actionTag(action: HeroShowcaseAction) {
  return action.type === 'route' ? RouterLink : 'button'
}

function actionProps(action: HeroShowcaseAction) {
  if (action.type === 'route') return { to: action.to }
  return { type: 'button' as const }
}

function onAction(action: HeroShowcaseAction, event: MouseEvent) {
  if (action.type === 'scroll') {
    event.preventDefault()
    document.getElementById(action.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  router.push(action.to)
}

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = undefined
}

function startTimer() {
  stopTimer()
  if (!props.autoplay || paused.value || props.slides.length < 2) return
  timer = setInterval(() => next(), props.intervalMs)
}

function goTo(index: number) {
  if (index < 0 || index >= props.slides.length) return
  activeIndex.value = index
  startTimer()
}

function next(manual = false) {
  const len = props.slides.length
  if (len < 1) return
  activeIndex.value = (activeIndex.value + 1) % len
  if (manual) startTimer()
}

function prev(manual = false) {
  const len = props.slides.length
  if (len < 1) return
  activeIndex.value = (activeIndex.value - 1 + len) % len
  if (manual) startTimer()
}

function pause() {
  paused.value = true
  stopTimer()
}

function resume() {
  paused.value = false
  startTimer()
}

function onPointerDown(event: PointerEvent) {
  swipeStartX.value = event.clientX
}

function onPointerUp(event: PointerEvent) {
  if (swipeStartX.value === null) return
  const delta = event.clientX - swipeStartX.value
  swipeStartX.value = null
  if (Math.abs(delta) < 48) return
  if (delta < 0) next(true)
  else prev(true)
}

onMounted(() => startTimer())
onUnmounted(() => stopTimer())

defineExpose({ goTo, next, prev, pause, resume })
</script>

<style scoped>
.hero-showcase {
  padding: 0 0 clamp(1.25rem, 2.5vw, 2rem);
  background: var(--color-bg);
}

.hero-showcase-inner {
  display: grid;
  gap: 1.25rem;
  padding-top: clamp(0.85rem, 2vw, 1.25rem);
}

.hero-stage {
  position: relative;
  overflow: hidden;
  background: var(--color-black);
  width: 100%;
  height: 75vh;
  min-height: 75vh;
  max-height: 75vh;
  touch-action: pan-y;
}

.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 0;
  transition:
    opacity 0.65s ease,
    visibility 0.65s ease,
    transform 0.65s ease;
  transform: scale(1.02);
}

.hero-slide--active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  z-index: 1;
  transform: scale(1);
}

.hero-slide-backdrop {
  position: absolute;
  inset: 0;
  background: #10100f;
}

.hero-slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-slide-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(8, 8, 8, 0.35) 0%,
    rgba(8, 8, 8, 0.2) 35%,
    rgba(8, 8, 8, 0.55) 68%,
    rgba(8, 8, 8, 0.82) 100%
  );
  pointer-events: none;
}

.hero-slide-words {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(0.5rem, 4vw, 3rem);
  pointer-events: none;
  overflow: hidden;
}

.hero-word {
  font-family: var(--font-display);
  font-size: clamp(4.5rem, 16vw, 11rem);
  font-weight: 500;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: rgba(255, 255, 255, 0.1);
  user-select: none;
  mix-blend-mode: overlay;
}

.hero-word--left {
  align-self: center;
  transform: translateY(-8%);
}

.hero-word--right {
  align-self: center;
  transform: translateY(8%);
}

.hero-slide-content {
  position: absolute;
  inset: auto 0 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

@media (min-width: 768px) {
  .hero-slide-content:not(.hero-slide-content--center) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
  }
}

.hero-slide-content--center {
  inset: 0;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: clamp(2rem, 5vw, 3.5rem);
  background: radial-gradient(
    ellipse 80% 70% at 50% 45%,
    rgba(8, 8, 8, 0.55) 0%,
    rgba(8, 8, 8, 0.15) 55%,
    transparent 100%
  );
}

.hero-slide-content--center .hero-slide-copy {
  max-width: min(720px, 94%);
  margin-inline: auto;
}

.hero-slide-content--center .hero-slide-desc {
  margin-inline: auto;
  max-width: 46ch;
  font-size: clamp(0.95rem, 2.2vw, 1.08rem);
  color: rgba(255, 255, 255, 0.82);
}

.hero-slide-content--center .hero-slide-actions {
  justify-content: center;
  margin-top: 0.25rem;
}

.hero-slide-brand--pill {
  display: inline-flex;
  margin-inline: auto;
  margin-bottom: 0.85rem;
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  letter-spacing: 0.12em;
}

.hero-slide-headline--center {
  font-size: clamp(2.15rem, 5.8vw, 3.85rem);
  line-height: 1.04;
  margin-bottom: 0.85rem;
  text-shadow: 0 4px 48px rgba(0, 0, 0, 0.45);
}

.hero-slide-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem 1.25rem;
  margin: 0 auto 1.1rem;
  padding: 0.9rem 1.35rem;
  max-width: min(100%, 520px);
  border-radius: var(--radius-xl);
  background: rgba(8, 8, 8, 0.42);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.hero-slide-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  min-width: 4.5rem;
}

.hero-slide-stat-value {
  font-family: var(--font-numeric);
  font-size: clamp(1.35rem, 2.8vw, 1.75rem);
  font-weight: 600;
  line-height: 1.1;
  color: #fff;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.hero-slide-stat-value--accent {
  color: #f4c56a;
}

.hero-slide-stat-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.58);
  text-align: center;
  max-width: 12ch;
  line-height: 1.35;
}

.hero-slide-content--center .hero-slide-cta {
  min-width: min(100%, 220px);
  justify-content: center;
}

.hero-slide-content--center .hero-slide-cta:first-child {
  background: var(--color-necha-green);
  color: #fff;
}

.hero-slide-content--center .hero-slide-cta:first-child:hover {
  background: var(--color-necha-green-dark);
}

.hero-slide-copy {
  max-width: 42ch;
}

.hero-slide-content--center .hero-slide-copy {
  max-width: min(720px, 94%);
}

.hero-slide-brand {
  margin: 0 0 0.5rem;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.hero-slide-headline {
  margin: 0 0 0.65rem;
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 4.5vw, 2.75rem);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #fff;
}

.hero-slide-headline :deep(em) {
  font-style: italic;
  color: var(--color-necha-green-light);
}

.hero-slide-headline :deep(em.amb) {
  font-family: var(--font-numeric);
  font-style: normal;
  font-weight: 600;
  color: #f4c56a;
}

.hero-slide-desc {
  margin: 0 0 1.15rem;
  font-size: clamp(0.95rem, 2vw, 1.05rem);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.92);
}

.hero-slide-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.hero-slide-cta {
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-white);
  color: var(--color-black);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.hero-slide-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.hero-slide-cta--ghost {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: none;
}

.hero-slide-cta--ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.hero-product-chip {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 1rem 0.65rem 0.65rem;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.96);
  color: var(--color-black);
  text-decoration: none;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
  flex-shrink: 0;
  max-width: min(100%, 320px);
  transition: transform var(--transition-base);
}

.hero-product-chip:hover {
  transform: translateY(-2px);
}

.hero-product-chip--static {
  pointer-events: none;
}

.hero-product-chip img {
  width: 52px;
  height: 52px;
  border-radius: var(--radius);
  object-fit: cover;
  flex-shrink: 0;
}

.hero-product-chip-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.hero-product-chip-label {
  font-size: 11px;
  color: var(--color-muted);
}

.hero-product-chip-name {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
}

.hero-product-chip-arrow {
  flex-shrink: 0;
  opacity: 0.55;
}

.hero-arr {
  position: absolute;
  top: 50%;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  width: var(--touch-min);
  height: var(--touch-min);
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  background: rgba(12, 12, 12, 0.45);
  backdrop-filter: blur(10px);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition:
    background var(--transition-base),
    border-color var(--transition-base),
    transform var(--transition-base),
    box-shadow var(--transition-base);
}

.hero-arr:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.65);
  transform: translateY(-50%) scale(1.04);
}

.hero-arr--prev {
  left: clamp(0.75rem, 2.5vw, 1.5rem);
}

.hero-arr--next {
  right: clamp(0.75rem, 2.5vw, 1.5rem);
}

.hero-brand-nav {
  display: grid;
  gap: 0.75rem;
}

.hero-brand-progress {
  display: flex;
  gap: 0.35rem;
}

.hero-brand-seg {
  position: relative;
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: var(--color-border);
  overflow: hidden;
}

.hero-brand-seg.past,
.hero-brand-seg.on {
  background: var(--color-necha-green);
}

.hero-brand-seg--new.on {
  background: color-mix(in srgb, var(--color-necha-green) 60%, #f4c56a);
}

.hero-brand-seg-fill {
  position: absolute;
  inset: 0;
  background: var(--color-necha-green);
  transform-origin: left center;
  animation: hero-progress var(--hero-interval, 7s) linear forwards;
}

@keyframes hero-progress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

.hero-brand-tabs {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.hero-brand-tabs::-webkit-scrollbar {
  display: none;
}

.hero-brand-tab {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-body);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.hero-brand-tab.on {
  border-color: var(--color-necha-green);
  color: var(--color-necha-green-dark);
  background: color-mix(in srgb, var(--color-necha-green) 8%, var(--color-surface));
}

.hero-brand-tab--new.on {
  border-color: color-mix(in srgb, var(--color-necha-green) 50%, #f4c56a);
}

.hero-brand-meta {
  margin: 0;
  font-size: 12px;
  color: var(--color-muted);
}

@media (prefers-reduced-motion: reduce) {
  .hero-slide {
    transform: none;
    transition: opacity 0.2s ease, visibility 0.2s ease;
  }

  .hero-brand-seg-fill {
    animation: none;
    transform: scaleX(1);
  }
}
</style>
