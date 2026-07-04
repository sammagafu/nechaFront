<template>
  <div class="brands-page">
    <header class="brands-hero section-inner">
      <p class="kicker">Brands</p>
      <h1 class="page-title">Authentic African Beauty</h1>
      <p class="brands-lead">
        Curated personal care and wellness labels from across the continent — available through
        Necha partner hotels and our delivery network.
      </p>
    </header>

    <section class="section-inner brands-showcase">
      <article class="brand-card card card-elevated">
        <img :src="siteImages.products.lemongrass" alt="NECHA NATURALS" loading="lazy" />
        <div class="brand-card-body">
          <p class="brand-label">Flagship</p>
          <h2>NECHA NATURALS</h2>
          <p>
            Botanical body care crafted in Tanzania — shea, baobab, lemongrass, turmeric and
            hibiscus for skin, hair and ritual.
          </p>
          <button type="button" class="text-link" @click="tryDemo">Order at a partner hotel →</button>
        </div>
      </article>

      <div class="brands-benefits">
        <article v-for="item in benefits" :key="item.title" class="benefit-tile">
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </article>
      </div>
    </section>

    <section id="join-brand" class="section brands-join">
      <div class="section-inner brands-join-inner">
        <div class="brands-join-copy">
          <p class="kicker">Join Necha</p>
          <h2 class="page-title-sm">List your brand on Necha Africa</h2>
          <p>
            Reach hotel guests across Dar es Salaam. We handle logistics, delivery and guest
            checkout — you focus on great products.
          </p>
          <ul class="brands-join-list">
            <li v-for="point in joinPoints" :key="point">{{ point }}</li>
          </ul>
        </div>
        <PartnerSignupForm initial-tab="brand" wide />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PartnerSignupForm from '@/components/partners/PartnerSignupForm.vue'
import { appConfig } from '@/config/app'
import { siteImages } from '@/config/images'

const router = useRouter()

const benefits = [
  {
    title: 'Hotel distribution',
    body: 'Your products appear on every partner hotel storefront — guests order from their room.',
  },
  {
    title: 'Electric delivery',
    body: 'Necha handles same-day delivery across Dar es Salaam by electric vehicle.',
  },
  {
    title: 'Transparent payouts',
    body: 'Commission and settlement tracked per order — paid after delivery is confirmed.',
  },
]

const joinPoints = [
  'Personal care, beauty, wellness and travel essentials',
  'Onboarding review within 48 hours',
  'Central catalogue — one listing, all partner hotels',
]

function tryDemo() {
  const { hotelSlug, hotelCode } = appConfig.demoHotel
  router.push(`/hotel/${hotelSlug}?ref=${encodeURIComponent(hotelCode)}`)
}
</script>

<style scoped>
.brands-page {
  background: var(--color-bg);
  padding-bottom: 4rem;
}

.brands-hero {
  padding-block: 3rem 2rem;
  border-bottom: 1px solid var(--color-border);
}

.brands-lead {
  margin: 0.75rem 0 0;
  max-width: 52ch;
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-body);
}

.brands-showcase {
  padding-top: 2.5rem;
  display: grid;
  gap: 2rem;
}

.brand-card {
  overflow: hidden;
  display: grid;
}

@media (min-width: 768px) {
  .brand-card {
    grid-template-columns: 1fr 1.2fr;
  }
}

.brand-card img {
  width: 100%;
  min-height: 240px;
  object-fit: cover;
}

.brand-card-body {
  padding: 1.75rem;
}

.brand-label {
  margin: 0 0 0.35rem;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-necha-green);
}

.brand-card-body h2 {
  margin: 0 0 0.65rem;
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
}

.brand-card-body p {
  margin: 0 0 1rem;
  font-size: 14px;
  line-height: 1.65;
  color: var(--color-body);
}

.text-link {
  border: none;
  background: none;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-necha-green-dark);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.brands-benefits {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.benefit-tile {
  padding: 1.25rem;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.benefit-tile h3 {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
}

.benefit-tile p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-body);
}

.brands-join {
  padding-block: 3rem;
  background: var(--color-bg-soft);
  border-block: 1px solid var(--color-border);
}

.brands-join-inner {
  display: grid;
  gap: 2rem;
}

@media (min-width: 900px) {
  .brands-join-inner {
    grid-template-columns: 1fr 1.1fr;
    align-items: start;
  }
}

.brands-join-copy .page-title-sm {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 500;
}

.brands-join-copy p {
  margin: 0 0 1rem;
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-body);
}

.brands-join-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;
}

.brands-join-list li {
  font-size: 14px;
  color: var(--color-body);
  padding-left: 1.25rem;
  position: relative;
}

.brands-join-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-necha-green);
}
</style>
