<template>
  <div class="homepage">
    <p v-if="showHotelError" class="notice-banner">
      That hotel link wasn't recognised. Browse below or enter your code.
    </p>

    <!-- Hero product slider -->
    <section class="hero-showcase" aria-label="Featured products">
      <div
        class="hero-stage"
        @pointerdown="onHeroPointerDown"
        @pointerup="onHeroPointerUp"
        @pointercancel="onHeroPointerUp"
      >
          <div
            v-for="(slide, index) in heroSlides"
            :key="slide.id"
            class="hero-slide"
            :class="{ 'hero-slide--active': heroIndex === index }"
            :aria-hidden="heroIndex !== index"
            :style="{ '--slide-tint': slide.tint }"
          >
            <div class="hero-slide-backdrop" aria-hidden="true">
              <img
                class="hero-slide-image"
                :src="slide.image"
                :alt="slide.imageAlt"
                loading="eager"
                decoding="async"
              />
            </div>
            <div class="hero-slide-scrim" aria-hidden="true" />
            <div class="hero-slide-words" aria-hidden="true">
              <span class="hero-word hero-word--left">{{ slide.wordLeft }}</span>
              <span class="hero-word hero-word--right">{{ slide.wordRight }}</span>
            </div>
            <div class="hero-slide-content">
              <div class="hero-slide-copy">
                <p class="hero-slide-brand">{{ slide.brand }} · {{ slide.label }}</p>
                <p class="hero-slide-desc">{{ slide.description }}</p>
                <router-link :to="slide.ctaTo" class="hero-slide-cta">
                  {{ slide.cta }}
                </router-link>
              </div>
              <router-link
                v-if="slide.productSlug"
                :to="demoProductPath(slide.productSlug)"
                class="hero-product-chip"
              >
                <img :src="slide.image" :alt="slide.imageAlt" loading="lazy" />
                <span class="hero-product-chip-text">
                  <span class="hero-product-chip-label">See product details</span>
                  <span class="hero-product-chip-name">{{ slide.productName }}</span>
                </span>
                <Icon name="arrow-right" :size="18" class="hero-product-chip-arrow" />
              </router-link>
            </div>
          </div>
          <button
            type="button"
            class="hero-arr hero-arr--prev"
            aria-label="Previous product"
            @click="prevHeroSlide(true)"
          >
            <Icon name="chevron-left" :size="22" />
          </button>
          <button
            type="button"
            class="hero-arr hero-arr--next"
            aria-label="Next product"
            @click="nextHeroSlide(true)"
          >
            <Icon name="chevron-right" :size="22" />
          </button>
      </div>

      <div class="section-inner hero-showcase-inner">
        <nav class="hero-brand-nav" aria-label="Featured products">
          <div class="hero-brand-progress" aria-hidden="true">
            <span
              v-for="(slide, index) in heroSlides"
              :key="slide.id"
              class="hero-brand-seg"
              :class="{ on: heroIndex === index, past: index < heroIndex }"
            >
              <span
                v-if="heroIndex === index && heroAutoplay"
                :key="`progress-${heroIndex}`"
                class="hero-brand-seg-fill"
              />
            </span>
          </div>
          <div class="hero-brand-tabs" role="tablist">
            <button
              v-for="(slide, index) in heroSlides"
              :key="slide.id"
              type="button"
              class="hero-brand-tab"
              :class="{ on: heroIndex === index }"
              role="tab"
              :aria-selected="heroIndex === index"
              @click="goToHeroSlide(index)"
            >
              {{ slide.label }}
            </button>
          </div>
          <p class="hero-brand-meta">
            <span class="hero-brand-index">0{{ heroIndex + 1 }}</span>
            <span class="hero-brand-of">/ 0{{ heroSlides.length }}</span>
            · {{ heroSlides[heroIndex]?.productName }}
          </p>
        </nav>
      </div>
    </section>

    <!-- Vertical features -->
    <VerticalFeatures
      eyebrow="Everything in one place"
      title="More than a storefront"
      title-accent="storefront"
      subtitle="Discover Tanzania, order food and wellness to your room, and explore partner hotels — all from one QR scan."
      :items="verticalFeatures"
    />

    <!-- Hotel portal -->
    <section id="enter-hotel" class="section hotel-section">
      <div class="section-inner hotel-card">
        <div class="hotel-card-copy">
          <p class="eyebrow">Hotel guests</p>
          <h2 class="section-title-sm">Your room is the storefront</h2>
          <p>Scan the QR, enter your property code, and order products or food without leaving the hotel.</p>
          <ol class="hotel-steps-list">
            <li v-for="(step, i) in hotelSteps" :key="step"><span>0{{ i + 1 }}</span>{{ step }}</li>
          </ol>
        </div>
        <form class="hotel-card-form form-stack" @submit.prevent="goToHotel">
          <div class="field">
            <label for="code">Property code</label>
            <div class="hotel-input-row">
              <input id="code" v-model="code" placeholder="e.g. SEACLIFF24" required />
              <button class="btn btn-green hotel-enter-btn" type="submit">Enter</button>
            </div>
          </div>
          <p class="hotel-form-foot">
            <button type="button" class="text-link-sm" @click="tryDemo">Open demo hotel portal →</button>
          </p>
        </form>
      </div>
    </section>

    <!-- Why Necha -->
    <section id="about" class="section why-section">
      <div class="section-inner">
        <header class="section-head-row section-head-row--center">
          <div>
            <p class="eyebrow">Why Necha</p>
            <h2 class="section-title-sm">Built for African hospitality</h2>
          </div>
        </header>
        <div class="why-grid-modern">
          <article v-for="(item, i) in whyShop" :key="item.heading" class="why-tile">
            <span class="why-tile-num">0{{ i + 1 }}</span>
            <h3>{{ item.heading }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Partner + delivery -->
    <section class="section partner-strip">
      <div class="section-inner partner-band">
        <div>
          <p class="eyebrow eyebrow-light">For hotels</p>
          <h2>Is your hotel on Necha Africa?</h2>
          <p>Commission on every guest purchase — zero effort, automatic payouts.</p>
        </div>
        <router-link to="/hotel-partners" class="btn btn-lg btn-green">Become a partner</router-link>
      </div>
    </section>

    <section class="delivery-strip-modern section-inner">
      <p>Delivering across Dar es Salaam · Zones A–F · Electric vehicle · Free over TZS 180,000</p>
      <router-link to="/delivery">See delivery zones →</router-link>
    </section>

    <!-- Testimonials -->
    <section class="section testimonials-section">
      <div class="section-inner">
        <h2 class="section-title-sm section-title-sm--center">What our customers say</h2>
        <div class="testimonials-row">
          <article v-for="item in testimonials" :key="item.name" class="quote-card" :class="{ featured: item.featured }">
            <p class="quote-stars">★★★★★</p>
            <blockquote>{{ item.quote }}</blockquote>
            <footer><strong>{{ item.name }}</strong> — {{ item.context }}</footer>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="contact" class="section cta-section">
      <div class="section-inner cta-band">
        <h2>Start your ritual today</h2>
        <p>Scan your hotel QR, explore partner properties, or discover Tanzania.</p>
        <div class="cta-actions">
          <button class="btn btn-lg btn-green" type="button" @click="tryDemo">Enter demo hotel</button>
          <router-link to="/discovery" class="btn btn-lg btn-outline btn-outline-light">Discover Tanzania</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'
import VerticalFeatures from '@/components/home/VerticalFeatures.vue'
import { heroSlideMeta, productImageBySlug, type HeroSlideMeta } from '@/config/brands'

interface VerticalFeature {
  tag: string
  label: string
  description: string
  action: string
  tint: string
  to?: string
  href?: string
}
import { appConfig, catalogConfig } from '@/config/app'
import { useCatalogStore } from '@/stores/catalog'

const router = useRouter()
const route = useRoute()
const catalog = useCatalogStore()
const code = ref('')
const heroIndex = ref(0)
const heroAutoplay = ref(
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
)
const HERO_INTERVAL_MS = 7000
const heroSwipeStartX = ref<number | null>(null)
let heroTimer: ReturnType<typeof setInterval> | undefined

interface HeroSlide extends HeroSlideMeta {
  image: string
  imageAlt: string
  productName: string
}

const heroSlides = computed<HeroSlide[]>(() =>
  heroSlideMeta
    .map((meta) => {
      const product = catalog.findBySlug(meta.productSlug)
      const image = product?.imageUrl ?? productImageBySlug[meta.productSlug] ?? ''
      return {
        ...meta,
        image,
        imageAlt: product?.name ?? meta.label,
        productName: product?.name ?? meta.label,
      }
    })
    .filter((slide) => Boolean(slide.image)),
)

onMounted(async () => {
  await catalog.load()
  startHeroCarousel()
})

onUnmounted(() => {
  stopHeroCarousel()
})

const showHotelError = computed(() => route.query.hotelError === '1')

function demoProductPath(productSlug: string) {
  const { hotelSlug } = appConfig.demoHotel
  return `/hotel/${hotelSlug}/product/${productSlug}`
}

function stopHeroCarousel() {
  if (heroTimer) clearInterval(heroTimer)
  heroTimer = undefined
}

function startHeroCarousel() {
  stopHeroCarousel()
  if (!heroAutoplay.value || heroSlides.value.length < 2) return
  heroTimer = setInterval(() => nextHeroSlide(), HERO_INTERVAL_MS)
}

function goToHeroSlide(index: number) {
  if (index < 0 || index >= heroSlides.value.length) return
  heroIndex.value = index
  startHeroCarousel()
}

function nextHeroSlide(manual = false) {
  const len = heroSlides.value.length
  if (len < 1) return
  heroIndex.value = (heroIndex.value + 1) % len
  if (manual) startHeroCarousel()
}

function prevHeroSlide(manual = false) {
  const len = heroSlides.value.length
  if (len < 1) return
  heroIndex.value = (heroIndex.value - 1 + len) % len
  if (manual) startHeroCarousel()
}

function onHeroPointerDown(event: PointerEvent) {
  heroSwipeStartX.value = event.clientX
}

function onHeroPointerUp(event: PointerEvent) {
  if (heroSwipeStartX.value === null) return
  const delta = event.clientX - heroSwipeStartX.value
  heroSwipeStartX.value = null
  if (Math.abs(delta) < 48) return
  if (delta < 0) nextHeroSlide(true)
  else prevHeroSlide(true)
}

const hotelServicePath = (segment: string) => {
  const ref = encodeURIComponent(catalogConfig.hotelCode)
  return `/hotel/${catalogConfig.hotelSlug}/${segment}?ref=${ref}`
}

const verticalFeatures = computed<VerticalFeature[]>(() => [
  {
    tag: 'Discover',
    label: 'Discover Tanzania',
    description: 'Restaurants, activities, tours and events curated for hotel guests.',
    action: 'Explore',
    tint: '#534AB7',
    icon: 'star',
    to: '/discovery',
  },
  {
    tag: 'Food',
    label: 'Order food',
    description: 'Room service and bar menu — burgers, local plates, drinks to your door.',
    action: 'View menu',
    tint: '#854f0b',
    icon: 'gift',
    to: hotelServicePath('food'),
  },
  {
    tag: 'Spa',
    label: 'Spa & wellness',
    description: 'Book a massage, facial or in-room treatment at partner hotels.',
    action: 'Book session',
    tint: '#0f6e56',
    icon: 'spa',
    to: hotelServicePath('spa'),
  },
  {
    tag: 'Brands',
    label: 'African brands',
    description: 'Curated personal care and wellness labels — NECHA NATURALS and partners.',
    action: 'View brands',
    tint: '#5a8f28',
    icon: 'sparkles',
    to: '/brands',
  },
  {
    tag: 'Partners',
    label: 'Hotel partners',
    description: 'Commission on every guest purchase — zero effort, automatic payouts.',
    action: 'Join Necha',
    tint: '#86bc42',
    icon: 'scan',
    to: '/hotel-partners',
  },
  {
    tag: 'Portal',
    label: 'Hotel portal',
    description: 'Enter your property code for the full guest commerce experience.',
    action: 'Enter code',
    tint: '#2c2c2a',
    icon: 'scan',
    href: '#enter-hotel',
  },
])

const hotelSteps = [
  'Scan the Necha QR in your room or lobby',
  'Enter your hotel property code',
  'Order products or food — tracked in real time',
]

const testimonials = [
  {
    name: 'Anna Makoi',
    context: 'Necha customer',
    quote: 'The body butter smells so great. I loved purchasing this product. I will be a regular.',
    featured: false,
  },
  {
    name: 'Monica Macha',
    context: 'Necha customer',
    quote:
      'Love the packaging. It is so well done and looks like a high end product. I loved the experience of brand discovery to the actual products themselves. Well done. I will be back.',
    featured: true,
  },
]

const whyShop = [
  {
    heading: 'Hotel & room delivery',
    body: 'Order from your room. We deliver same day across Dar by electric vehicle.',
  },
  {
    heading: 'Authentic African brands',
    body: 'Curated personal care and wellness labels — clean, organic, ethically made.',
  },
  {
    heading: 'Shop & earn rewards',
    body: 'Every purchase earns Necha points — redeem or withdraw as cash.',
  },
  {
    heading: 'Secure payments',
    body: 'M-Pesa, Tigo Pesa, Airtel Money and card — fast and mobile-first.',
  },
]

function goToHotel() {
  router.push(`/h/${encodeURIComponent(code.value.trim())}`)
}

function tryDemo() {
  const { hotelSlug: slug, hotelCode } = appConfig.demoHotel
  code.value = hotelCode
  router.push(`/hotel/${slug}?ref=${encodeURIComponent(hotelCode)}`)
}
</script>

<style scoped>
.homepage {
  background: var(--color-bg);
  padding-bottom: clamp(2.5rem, 5vw, 4rem);
}

.notice-banner {
  margin: 0;
  padding: 0.65rem 1.25rem;
  text-align: center;
  font-size: 13px;
  background: var(--color-necha-green-light);
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}

/* Hero brand slider */
.hero-showcase {
  padding: 0 0 clamp(1.25rem, 2.5vw, 2rem);
  background: var(--color-bg);
}

.hero-showcase-inner {
  display: grid;
  gap: 1.25rem;
  --hero-interval: 7s;
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
  .hero-slide-content {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
  }
}

.hero-slide-copy {
  max-width: 36ch;
}

.hero-slide-brand {
  margin: 0 0 0.5rem;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.hero-slide-desc {
  margin: 0 0 1.15rem;
  font-size: clamp(0.95rem, 2vw, 1.05rem);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.92);
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
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.hero-slide-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.32);
}

.hero-arr:focus-visible {
  outline: 2px solid var(--color-necha-green);
  outline-offset: 2px;
}

.hero-arr--prev {
  left: clamp(0.75rem, 2.5vw, 1.5rem);
}

.hero-arr--next {
  right: clamp(0.75rem, 2.5vw, 1.5rem);
}

@media (max-width: 639px) {
  .hero-arr {
    width: 40px;
    height: 40px;
  }

  .hero-arr--prev {
    left: 0.5rem;
  }

  .hero-arr--next {
    right: 0.5rem;
  }
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

.hero-brand-seg.past {
  background: var(--color-necha-green);
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
  -webkit-overflow-scrolling: touch;
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
  transition: border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
}

.hero-brand-tab.on {
  border-color: var(--color-necha-green);
  color: var(--color-necha-green-dark);
  background: color-mix(in srgb, var(--color-necha-green) 8%, var(--color-surface));
}

.hero-brand-meta {
  margin: 0;
  font-size: 12px;
  color: var(--color-muted);
}

.hero-brand-index {
  font-weight: 600;
  color: var(--color-text);
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

.btn-green {
  background: var(--color-necha-green) !important;
  border-radius: var(--radius-pill) !important;
  color: var(--color-on-dark, var(--color-white)) !important;
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 14px;
  border: none !important;
}

.btn-green:hover {
  background: var(--color-necha-green-dark) !important;
  color: var(--color-on-dark, var(--color-white)) !important;
}

.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.55) !important;
  color: var(--color-white) !important;
  background: rgba(255, 255, 255, 0.08) !important;
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.16) !important;
  border-color: rgba(255, 255, 255, 0.9) !important;
  color: var(--color-white) !important;
}

.section-title-sm {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 2.35rem);
  font-weight: 500;
  line-height: 1.15;
  color: var(--color-text);
}

/* Shared */
.eyebrow {
  margin: 0 0 0.5rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-necha-green);
}

.eyebrow-light {
  color: var(--color-necha-green-light);
}

.section-title-sm--center {
  text-align: center;
  margin-bottom: 1.75rem;
}

.section-sub {
  margin: 0.35rem 0 0;
  font-size: 14px;
  color: var(--color-body);
}

.section-head-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-bottom: clamp(1.75rem, 4vw, 2.75rem);
}

.section-head-row--center {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.btn-view {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-necha-green-dark);
  text-decoration: none;
  white-space: nowrap;
}

.btn-view:hover {
  text-decoration: underline;
}

.section {
  padding: clamp(3.25rem, 7vw, 5.5rem) 0;
}

/* Category rail */
.cat-rail-section {
  background:
    radial-gradient(120% 80% at 0% 100%, color-mix(in srgb, var(--color-necha-green) 7%, transparent), transparent 55%),
    var(--color-bg-soft);
  border-block: 1px solid var(--color-border);
}

.cat-rail {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  padding-inline: var(--page-gutter);
  margin-inline: calc(-1 * var(--page-gutter));
  scroll-padding-inline: var(--page-gutter);
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.cat-rail::-webkit-scrollbar {
  display: none;
}

.cat-rail-card {
  flex: 0 0 min(200px, 42vw);
  scroll-snap-align: start;
  padding: 1.25rem 1rem 1rem;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  text-align: center;
  color: inherit;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.cat-rail-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
}

.cat-rail-image {
  position: relative;
  width: 88px;
  height: 88px;
  margin: 0 auto 0.85rem;
  overflow: visible;
}

.cat-rail-image-mask {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-necha-green-light);
}

.cat-rail-icon {
  position: absolute;
  right: -4px;
  bottom: -4px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-necha-green-dark);
  box-shadow: var(--shadow-sm);
  pointer-events: none;
}

.cat-rail-icon :deep(.ui-icon) {
  display: block;
}

.cat-rail-image-mask img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cat-rail-card h3 {
  margin: 0 0 0.25rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--color-text);
}

.cat-rail-card span {
  font-size: 11px;
  color: var(--color-muted);
}

/* Promo */
.promo-section {
  background:
    radial-gradient(90% 70% at 100% 15%, color-mix(in srgb, var(--color-necha-green) 9%, transparent), transparent 52%),
    var(--color-bg);
}

.promo-card {
  display: grid;
  gap: 1.5rem;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: var(--radius-2xl);
  background: linear-gradient(135deg, var(--color-necha-green-light), var(--color-surface));
  border: 1px solid color-mix(in srgb, var(--color-necha-green) 25%, var(--color-border));
  overflow: hidden;
}

@media (min-width: 768px) {
  .promo-card {
    grid-template-columns: 1fr 1fr auto;
    align-items: center;
  }
}

.promo-copy h2 {
  margin: 0 0 0.65rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 500;
  color: var(--color-text);
}

.promo-copy p {
  margin: 0 0 1.25rem;
  font-size: 14px;
  color: var(--color-body);
  max-width: 36ch;
}

.promo-visual img {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: var(--radius-lg);
}

.promo-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.promo-stats strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--color-text);
}

.promo-stats span {
  font-size: 11px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Bestsellers */
.bestsellers-section {
  background:
    radial-gradient(85% 65% at 50% 0%, color-mix(in srgb, var(--color-necha-green) 6%, transparent), transparent 58%),
    var(--color-bg);
  border-block: 1px solid var(--color-border);
}

/* Hotel */
.hotel-section {
  background:
    radial-gradient(100% 80% at 100% 50%, color-mix(in srgb, var(--color-necha-green) 6%, transparent), transparent 50%),
    var(--color-bg-soft);
}

.hotel-card {
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
  padding: clamp(2rem, 4vw, 3rem);
  border-radius: var(--radius-2xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

@media (min-width: 768px) {
  .hotel-card {
    grid-template-columns: 1.2fr 0.85fr;
    align-items: center;
  }
}

.hotel-card-copy .section-title-sm {
  margin-bottom: 0.65rem;
}

.hotel-card-copy p {
  margin: 0 0 1.35rem;
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-body);
}

.hotel-steps-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.65rem;
}

.hotel-steps-list li {
  display: flex;
  gap: 0.75rem;
  font-size: 14px;
  color: var(--color-body);
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius);
  background: var(--color-bg-soft);
}

.hotel-steps-list span {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-necha-green);
  letter-spacing: 0.1em;
}

.hotel-card-form {
  align-self: stretch;
}

.hotel-input-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
}

@media (min-width: 480px) {
  .hotel-input-row {
    flex-direction: row;
    align-items: stretch;
  }
}

.hotel-input-row input {
  flex: 1;
  min-width: 0;
  min-height: 48px;
  padding: var(--input-padding-y) var(--input-padding-x);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: 15px;
  line-height: 1.5;
  background: var(--color-surface);
  color: var(--color-text);
}

.hotel-input-row input::placeholder {
  color: var(--color-muted);
}

.hotel-enter-btn {
  flex-shrink: 0;
  min-height: 48px;
  padding-inline: 1.5rem;
}

.hotel-form-foot {
  margin: 0;
  padding-top: 0.15rem;
}

.text-link-sm {
  border: none;
  background: none;
  padding: 0.35rem 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-necha-green-dark);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Why */
.why-section {
  background: var(--color-bg-warm);
  border-block: 1px solid var(--color-border);
}

.why-grid-modern {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.why-tile {
  padding: 1.35rem;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-necha-green);
}

.why-tile-num {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--color-necha-green);
}

.why-tile h3 {
  margin: 0.35rem 0 0.5rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-text);
}

.why-tile p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-body);
}

/* Partner */
.partner-strip {
  padding-block: clamp(2.5rem, 5vw, 4rem);
  background: var(--color-bg);
}

.partner-band {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: var(--radius-2xl);
  background: var(--color-black);
  color: var(--color-white);
}

.partner-band h2 {
  margin: 0 0 0.35rem;
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--color-white);
}

.partner-band p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
}

.delivery-strip-modern {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: clamp(1.5rem, 4vw, 2.5rem) max(var(--page-gutter), env(safe-area-inset-left, 0px))
    clamp(2.5rem, 5vw, 4rem);
  padding-right: max(var(--page-gutter), env(safe-area-inset-right, 0px));
  text-align: center;
  font-size: 13px;
  color: var(--color-body);
  background: var(--color-bg-soft);
  border-block: 1px solid var(--color-border);
}

.delivery-strip-modern a {
  color: var(--color-necha-green-dark);
  font-weight: 500;
}

/* Testimonials */
.testimonials-section {
  background:
    radial-gradient(100% 75% at 0% 40%, color-mix(in srgb, var(--color-necha-green) 6%, transparent), transparent 55%),
    var(--color-bg-soft);
}

.testimonials-row {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .testimonials-row {
    grid-template-columns: 1fr 1fr;
  }
}

.quote-card {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.quote-card.featured {
  border-color: color-mix(in srgb, var(--color-necha-green) 40%, var(--color-border));
  background: color-mix(in srgb, var(--color-necha-green) 5%, var(--color-surface));
}

.quote-stars {
  margin: 0 0 0.65rem;
  font-size: 12px;
  color: var(--color-necha-green);
  letter-spacing: 0.08em;
}

.quote-card blockquote {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  line-height: 1.45;
  color: var(--color-text);
}

.quote-card footer {
  font-size: 12px;
  color: var(--color-muted);
}

/* CTA */
.cta-section {
  background: var(--color-bg);
}

.cta-band {
  text-align: center;
  padding: clamp(2.5rem, 5vw, 3.5rem);
  border-radius: var(--radius-2xl);
  background: linear-gradient(160deg, var(--color-black), color-mix(in srgb, var(--color-necha-green-dark) 40%, var(--color-black)));
  color: var(--color-white);
}

.cta-band h2 {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 500;
  color: var(--color-white);
}

.cta-band p {
  margin: 0 0 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.cta-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.65rem;
}

.cta-actions .btn {
  width: 100%;
}

@media (min-width: 480px) {
  .cta-actions {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
  }

  .cta-actions .btn {
    width: auto;
  }
}

/* Dark mode — landing sections, buttons, text */
[data-theme='dark'] .notice-banner {
  background: color-mix(in srgb, var(--color-necha-green) 14%, var(--color-bg-soft));
  color: var(--color-text);
  border-bottom-color: var(--color-border);
}

[data-theme='dark'] .hero-showcase {
  background: var(--color-bg);
}

[data-theme='dark'] .hero-brand-tab.on {
  color: var(--color-necha-green);
  background: color-mix(in srgb, var(--color-necha-green) 14%, var(--color-surface));
}

[data-theme='dark'] .homepage .eyebrow:not(.eyebrow-light) {
  color: var(--color-necha-green);
}

[data-theme='dark'] .btn-view {
  color: var(--color-necha-green);
}

[data-theme='dark'] .btn-view:hover {
  color: var(--color-necha-green-dark);
}

[data-theme='dark'] .btn-green:hover {
  background: color-mix(in srgb, var(--color-necha-green) 88%, var(--color-white)) !important;
  color: var(--color-black) !important;
}

[data-theme='dark'] .text-link-sm {
  color: var(--color-necha-green);
}

[data-theme='dark'] .delivery-strip-modern a {
  color: var(--color-necha-green);
}

[data-theme='dark'] .promo-card {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-necha-green) 18%, var(--color-surface)),
    var(--color-surface)
  );
  border-color: color-mix(in srgb, var(--color-necha-green) 28%, var(--color-border));
}

[data-theme='dark'] .hotel-card {
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

[data-theme='dark'] .hotel-input-row input {
  background: var(--color-surface-inset);
  border-color: var(--color-border);
  color: var(--color-text);
}

[data-theme='dark'] .hotel-steps-list li {
  background: var(--color-bg);
}

[data-theme='dark'] .why-tile {
  background: var(--color-surface);
}

[data-theme='dark'] .quote-card.featured {
  background: color-mix(in srgb, var(--color-necha-green) 10%, var(--color-surface));
  border-color: color-mix(in srgb, var(--color-necha-green) 35%, var(--color-border));
}

[data-theme='dark'] .cat-rail-section,
[data-theme='dark'] .bestsellers-section,
[data-theme='dark'] .testimonials-section,
[data-theme='dark'] .delivery-strip-modern {
  border-color: var(--color-border);
}

[data-theme='dark'] .cta-band {
  background: linear-gradient(
    160deg,
    var(--color-bg-soft),
    color-mix(in srgb, var(--color-necha-green) 22%, var(--color-black))
  );
}
</style>
