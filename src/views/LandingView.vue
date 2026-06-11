<template>
  <div class="homepage">
    <p v-if="showHotelError" class="notice-banner">
      That hotel link wasn't recognised. Browse below or enter your code.
    </p>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-glow" aria-hidden="true" />
      <div class="section-inner hero-grid">
        <div class="hero-copy">
          <span class="hero-badge">NECHA NATURALS · New collection</span>
          <h1 class="hero-title">
            Where hospitality<br />
            <em>meets wellness</em>
          </h1>
          <p class="hero-lead">
            Personal care, beauty and wellness — delivered to your hotel room or door across
            Dar es Salaam. Shop products, order food, book spa and reserve dining in one place.
          </p>
          <div class="hero-cta">
            <router-link to="/shop" class="btn btn-lg btn-green">Shop now →</router-link>
            <router-link to="/brands" class="btn btn-lg btn-hero-secondary">Discover brands</router-link>
          </div>
          <div class="hero-chips">
            <span v-for="t in trustTags" :key="t" class="hero-chip">{{ t }}</span>
          </div>
          <nav class="hero-quick" aria-label="Quick actions">
            <router-link :to="hotelServicePath('food')">Order food</router-link>
            <router-link :to="hotelServicePath('spa')">Book spa</router-link>
            <a href="#enter-hotel" @click.prevent="scrollToHotel">Hotel portal</a>
          </nav>
        </div>

        <div class="hero-visual">
          <div class="hero-frame">
            <img
              class="hero-frame-main"
              :src="heroMainImage"
              alt="Necha wellness collection"
              loading="eager"
            />
            <router-link
              v-if="heroFeatured"
              :to="heroFeatured.slug ? productPath(heroFeatured.slug) : '/shop'"
              class="hero-float-card"
            >
              <img :src="heroFeatured.imageUrl" :alt="heroFeatured.name" loading="eager" />
              <div>
                <p class="hero-float-brand">{{ heroFeatured.brandName || 'NECHA NATURALS' }}</p>
                <p class="hero-float-name">{{ heroFeatured.name }}</p>
                <p class="hero-float-price">TZS {{ formatPrice(heroFeatured.price) }}</p>
              </div>
            </router-link>
            <div class="hero-promo-ring" aria-hidden="true">
              <strong>Free delivery</strong>
              <span>Over TZS 180k</span>
            </div>
            <div class="hero-rating" aria-hidden="true">
              <span class="hero-rating-stars">★★★★★</span>
              <span>4.9 from hotel guests</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories rail -->
    <section id="categories" class="section cat-rail-section">
      <div class="section-inner">
        <header class="section-head-row">
          <div>
            <p class="eyebrow">Shop by category</p>
            <h2 class="section-title-sm">Five worlds of care</h2>
          </div>
          <router-link to="/shop" class="btn-view">View all →</router-link>
        </header>
        <div class="cat-rail">
          <router-link
            v-for="cat in shopCategories"
            :key="cat.id"
            :to="categoryShopLink(cat.id)"
            class="cat-rail-card"
          >
            <div class="cat-rail-image">
              <img :src="cat.image" :alt="cat.label" loading="lazy" />
            </div>
            <h3>{{ cat.label }}</h3>
            <span>{{ cat.count }} products</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Vertical features -->
    <VerticalFeatures
      eyebrow="Everything in one place"
      title="More than a shop"
      title-accent="shop"
      subtitle="Products, food, spa, dining and hotel services — designed for guests and everyday shoppers."
      :items="verticalFeatures"
    />

    <!-- Promo banner -->
    <section class="section promo-section">
      <div class="section-inner">
        <div class="promo-card">
          <div class="promo-copy">
            <p class="eyebrow">Necha Naturals</p>
            <h2>Skincare that loves you back</h2>
            <p>Botanical body care from Tanzania — same-day delivery by electric vehicle.</p>
            <router-link to="/shop" class="btn btn-green">Shop collection →</router-link>
          </div>
          <div class="promo-visual">
            <img :src="siteImages.products.lemongrass" alt="Necha products" loading="lazy" />
          </div>
          <div class="promo-stats">
            <p><strong>10K+</strong><span>Happy guests</span></p>
            <p><strong>4.9</strong><span>Average rating</span></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bestsellers -->
    <section id="bestsellers" class="section bestsellers-section">
      <div class="section-inner">
        <header class="section-head-row">
          <div>
            <p class="eyebrow">Guest favourites</p>
            <h2 class="section-title-sm">Our bestsellers</h2>
            <p class="section-sub">Top-rated by hotel guests across Dar es Salaam</p>
          </div>
          <router-link to="/shop" class="btn-view">View all →</router-link>
        </header>
        <div class="bestsellers-grid">
          <BestsellerProductCard
            v-for="product in showcaseProducts"
            :key="product.id"
            :product="product"
            :to="product.slug ? productPath(product.slug) : undefined"
          />
        </div>
      </div>
    </section>

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
        <p>Shop online, order to your room, or explore our demo hotel portal.</p>
        <div class="cta-actions">
          <router-link to="/shop" class="btn btn-lg btn-green">Shop collection</router-link>
          <button class="btn btn-lg btn-outline btn-outline-light" type="button" @click="tryDemo">Demo hotel</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BestsellerProductCard from '@/components/home/BestsellerProductCard.vue'
import VerticalFeatures from '@/components/home/VerticalFeatures.vue'

interface VerticalFeature {
  tag: string
  label: string
  description: string
  action: string
  tint: string
  to?: string
  href?: string
}
import { appConfig, catalogConfig, productPath } from '@/config/app'
import { siteImages } from '@/config/images'
import { useCatalogStore } from '@/stores/catalog'
import { categoryShopLink, shopCategories } from '@/config/categories'

const router = useRouter()
const route = useRoute()
const catalog = useCatalogStore()
const code = ref('')

onMounted(() => catalog.load())

const showHotelError = computed(() => route.query.hotelError === '1')

const showcaseProducts = computed(() => {
  const featured = catalog.featuredProducts
  if (featured.length) return featured.slice(0, 4)
  return catalog.commerceProducts.slice(0, 4)
})

const heroFeatured = computed(() => showcaseProducts.value[0] ?? null)

const heroMainImage = computed(
  () => heroFeatured.value?.imageUrl || siteImages.editorial,
)

function formatPrice(n: number) {
  return n.toLocaleString('en-TZ')
}

function scrollToHotel() {
  document.querySelector('#enter-hotel')?.scrollIntoView({ behavior: 'smooth' })
}

const hotelServicePath = (segment: string) => {
  const ref = encodeURIComponent(catalogConfig.hotelCode)
  return `/hotel/${catalogConfig.hotelSlug}/${segment}?ref=${ref}`
}

const verticalFeatures = computed<VerticalFeature[]>(() => [
  {
    tag: 'Shop',
    label: 'Personal care',
    description: 'Browse NECHA NATURALS and curated African wellness products.',
    action: 'Shop now',
    tint: '#5a8f28',
    to: '/shop',
  },
  {
    tag: 'Food',
    label: 'Order food',
    description: 'Room service and dining — burgers, local plates, drinks to your door.',
    action: 'View menu',
    tint: '#854f0b',
    to: hotelServicePath('food'),
  },
  {
    tag: 'Spa',
    label: 'Spa & wellness',
    description: 'Book a massage, facial or in-room treatment at partner hotels.',
    action: 'Book session',
    tint: '#0f6e56',
    to: hotelServicePath('spa'),
  },
  {
    tag: 'Dine',
    label: 'Reserve dining',
    description: 'Lunch and dinner reservations at your hotel restaurant.',
    action: 'Reserve table',
    tint: '#534AB7',
    to: hotelServicePath('restaurant'),
  },
  {
    tag: 'Bar',
    label: 'Bar & lounge',
    description: 'Cocktail menu and lounge reservations without leaving your room.',
    action: 'View menu',
    tint: '#2c2c2a',
    to: hotelServicePath('bar'),
  },
  {
    tag: 'Portal',
    label: 'Hotel portal',
    description: 'Enter your property code for the full guest commerce experience.',
    action: 'Enter code',
    tint: '#86bc42',
    href: '#enter-hotel',
  },
])

const trustTags = [
  'African botanicals',
  'Same-day delivery',
  'No app required',
]

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

/* Hero */
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--color-bg) 0%,
    color-mix(in srgb, var(--color-necha-green-light) 55%, var(--color-bg)) 100%
  );
  border-bottom: 1px solid var(--color-border);
}

.hero-glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: min(60vw, 520px);
  height: min(60vw, 520px);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--color-necha-green) 18%, transparent) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(2rem, 5vw, 3.5rem);
  align-items: center;
  padding-block: clamp(3.25rem, 8vw, 6rem);
}

@media (min-width: 960px) {
  .hero-grid {
    grid-template-columns: 1fr 1.05fr;
    min-height: clamp(480px, 68vh, 620px);
  }
}

.hero-copy {
  max-width: 540px;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 1.25rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  border: 1px solid color-mix(in srgb, var(--color-necha-green) 35%, var(--color-border));
  font-size: 10px;
  font-weight: 600;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-necha-green-dark);
}

.hero-title {
  margin: 0 0 1.15rem;
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 6.5vw, 4.5rem);
  font-weight: 400;
  line-height: 1.04;
  color: var(--color-text);
}

.hero-title em {
  font-style: italic;
  color: var(--color-necha-green-dark);
}

.hero-lead {
  margin: 0 0 1.75rem;
  font-size: 16px;
  line-height: 1.75;
  color: var(--color-body);
  max-width: 46ch;
}

.hero-cta {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
}

.hero-cta .btn {
  width: 100%;
}

@media (min-width: 480px) {
  .hero-cta {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .hero-cta .btn {
    width: auto;
  }
}

.btn-green {
  background: var(--color-necha-green) !important;
  border-radius: var(--radius-pill) !important;
  color: var(--color-white) !important;
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 14px;
  border: none !important;
}

.btn-green:hover {
  background: var(--color-necha-green-dark) !important;
}

.btn-hero-secondary {
  border-radius: var(--radius-pill) !important;
  text-transform: none;
  font-size: 14px;
  background: var(--color-surface) !important;
  border: 1.5px solid var(--color-border) !important;
  color: var(--color-text) !important;
}

.btn-hero-secondary:hover {
  border-color: var(--color-necha-green) !important;
  color: var(--color-necha-green-dark) !important;
  background: var(--color-bg-soft) !important;
}

.hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.hero-chip {
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  font-size: 11px;
  font-weight: 500;
  color: var(--color-body);
}

.hero-quick {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.25rem;
  font-size: 13px;
}

.hero-quick a {
  color: var(--color-text);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, var(--color-necha-green) 45%, transparent);
}

.hero-quick a:hover {
  color: var(--color-necha-green-dark);
}

.hero-visual {
  position: relative;
}

.hero-frame {
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-premium);
  min-height: 320px;
}

@media (min-width: 960px) {
  .hero-frame {
    min-height: 460px;
  }
}

.hero-frame-main {
  width: 100%;
  height: 100%;
  min-height: 320px;
  object-fit: cover;
  display: block;
}

@media (min-width: 960px) {
  .hero-frame-main {
    min-height: 460px;
  }
}

.hero-float-card {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface-overlay);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  color: inherit;
  text-decoration: none;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), border-color var(--transition-fast);
}

.hero-float-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-necha-green);
}

.hero-float-card img {
  width: 56px;
  height: 56px;
  border-radius: var(--radius);
  object-fit: cover;
  flex-shrink: 0;
}

.hero-float-brand {
  margin: 0;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.hero-float-name {
  margin: 0.1rem 0 0;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.2;
}

.hero-float-price {
  margin: 0.15rem 0 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-necha-green-dark);
}

.hero-promo-ring {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-black);
  color: var(--color-white);
  text-align: center;
  box-shadow: var(--shadow-lg);
  line-height: 1.25;
}

.hero-promo-ring strong {
  font-size: 11px;
  font-weight: 600;
}

.hero-promo-ring span {
  font-size: 9px;
  opacity: 0.85;
}

@media (min-width: 640px) {
  .hero-promo-ring {
    top: 1.25rem;
    right: 1.25rem;
    width: 96px;
    height: 96px;
  }
}

.hero-rating {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-pill);
  background: rgba(12, 12, 12, 0.72);
  color: var(--color-white);
  font-size: 10px;
}

.hero-rating-stars {
  color: var(--color-necha-green);
  letter-spacing: 0.06em;
  font-size: 11px;
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

.section-title-sm {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 2.35rem);
  font-weight: 500;
  line-height: 1.15;
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
  background: var(--color-bg-soft);
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
  width: 88px;
  height: 88px;
  margin: 0 auto 0.85rem;
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-necha-green-light);
}

.cat-rail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cat-rail-card h3 {
  margin: 0 0 0.25rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
}

.cat-rail-card span {
  font-size: 11px;
  color: var(--color-muted);
}

/* Promo */
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
}

.promo-stats span {
  font-size: 11px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Bestsellers */
.bestsellers-section {
  background: var(--color-bg);
}

.bestsellers-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 1fr;
}

@media (min-width: 480px) {
  .bestsellers-grid {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  }
}

@media (min-width: 768px) {
  .bestsellers-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

/* Hotel */
.hotel-section {
  background: var(--color-bg-soft);
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
}

.delivery-strip-modern a {
  color: var(--color-necha-green-dark);
  font-weight: 500;
}

/* Testimonials */
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
}

.quote-card footer {
  font-size: 12px;
  color: var(--color-muted);
}

/* CTA */
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
</style>
