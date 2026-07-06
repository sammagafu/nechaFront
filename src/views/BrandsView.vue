<template>
  <div class="brands-page">
    <header class="brands-hero" :style="{ '--hero-bg': `url(${siteImages.partnerLanding.brands})` }">
      <div class="brands-hero-inner section-inner">
        <p class="kicker">Necha Africa for brand partners</p>
        <h1 class="page-title">Reach travellers &amp; tourists on their holiday journey</h1>
        <p class="brands-lead">
          A direct channel into the tourism economy through our hotel &amp; partner network —
          without building your own distribution.
        </p>
        <button type="button" class="btn btn-green" @click="scrollToJoin">Apply to join Necha ecosystem</button>
      </div>
    </header>

    <section class="section-inner brands-steps">
      <header class="hp-head-row">
        <div>
          <p class="eyebrow">How it works</p>
          <h2 class="hp-title">Four steps to your first sale</h2>
          <p class="hp-lead">
            Join the growing network of hotel partners and tour operators recommending your products to travellers.
          </p>
        </div>
      </header>
      <ol class="brands-step-list">
        <li v-for="(step, i) in steps" :key="step.title">
          <span class="brands-step-num">{{ i + 1 }}</span>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.body }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="section brands-why">
      <div class="section-inner">
        <header class="hp-head-row hp-head-row--center">
          <div>
            <p class="eyebrow">Why partner with Necha</p>
            <h2 class="hp-title">Why Necha</h2>
          </div>
        </header>
        <div class="brands-benefits">
          <article v-for="item in whyItems" :key="item.title" class="benefit-tile">
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-inner brands-categories-sec">
      <header class="hp-head-row hp-head-row--center">
        <div>
          <p class="eyebrow">Brand categories</p>
          <h2 class="hp-title">Categories we onboard</h2>
        </div>
      </header>
      <ul class="brands-category-grid">
        <li v-for="cat in brandCategories" :key="cat">{{ cat }}</li>
      </ul>
      <div class="brands-stats">
        <article v-for="stat in brandStats" :key="stat.label" class="hp-stat-card" :class="{ 'hp-stat-card--accent': stat.accent }">
          <p class="hp-stat-kicker">{{ stat.kicker }}</p>
          <p class="hp-stat-value">{{ stat.value }}</p>
          <p class="hp-stat-label">{{ stat.label }}</p>
        </article>
      </div>
    </section>

    <section id="join-brand" class="section brands-join">
      <div class="section-inner brands-join-inner">
        <div class="brands-join-copy">
          <p class="kicker">Join Necha Africa</p>
          <h2 class="page-title-sm">Join Necha Africa</h2>
          <p>We respond within 24 hours. No spam. No obligation until you countersign.</p>
        </div>
        <PartnerSignupForm initial-tab="brand" wide />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PartnerSignupForm from '@/components/partners/PartnerSignupForm.vue'
import { siteImages } from '@/config/images'
import '@/assets/home-sections.css'

const brandCategories = [
  'Personal Care',
  'Skin Care',
  'Wellness',
  'Travel Essentials',
  'Gifts',
  'Souvenirs',
  'Local Artisan Products',
  'Tour Services',
]

const steps = [
  { title: 'Sign the agreement', body: 'Fill in KYC form. Agree to commission rates.' },
  { title: 'Onboard products on Necha platform', body: 'Provide product price list. Agree fulfilment terms.' },
  { title: 'Go live', body: 'Products and services featured on Necha platform, ready for customers.' },
  { title: 'Earn every month', body: 'Commission and brand payouts done monthly. Sales data sent monthly.' },
]

const whyItems = [
  { title: 'Hotel distribution', body: 'Your products appear on every partner hotel storefront — guests order from their room.' },
  { title: 'Holiday mindset', body: 'Reach guests already spending in a relaxed, holiday mindset.' },
  { title: 'Brand storytelling', body: 'Tell your brand story to a captive high-intent audience.' },
  { title: 'Zero acquisition cost', body: 'No media spend required — distribution through our partner network.' },
]

const brandStats = [
  { kicker: 'Visitor volume', value: '2.14M', label: 'International visitors to Tanzania, 2024' },
  { kicker: 'Avg. spend', value: 'USD 243', label: 'Average tourist spend per night' },
  { kicker: 'The gap', value: '0', label: 'Local brands with hotel-room distribution today', accent: true },
]

function scrollToJoin() {
  document.getElementById('join-brand')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.brands-page {
  background: var(--color-bg);
  padding-bottom: 4rem;
}

.brands-hero {
  position: relative;
  padding-block: clamp(3rem, 10vw, 5rem);
  background: linear-gradient(135deg, rgba(26, 71, 49, 0.9), rgba(15, 110, 86, 0.75)), var(--hero-bg) center / cover;
  color: #fff;
  border-bottom: 1px solid var(--color-border);
}

.brands-hero .kicker {
  color: var(--color-accent-gold, #d4af37);
}

.brands-hero .page-title {
  color: #fff;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.brands-lead {
  margin: 0.75rem 0 1.5rem;
  max-width: 52ch;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.88);
}

.brands-steps {
  padding-block: 3rem;
}

.brands-step-list {
  list-style: none;
  margin: 2rem 0 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.brands-step-list li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.brands-step-num {
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--color-brand);
  color: #fff;
  font-weight: 600;
  font-size: 13px;
}

.brands-step-list h3 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
}

.brands-step-list p {
  margin: 0;
  color: var(--color-muted);
  font-size: 14px;
  line-height: 1.55;
}

.brands-why {
  background: var(--color-bg-soft);
  padding-block: 3rem;
}

.brands-benefits {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

@media (min-width: 768px) {
  .brands-benefits {
    grid-template-columns: repeat(2, 1fr);
  }
}

.benefit-tile {
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.benefit-tile h3 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
}

.benefit-tile p {
  margin: 0;
  color: var(--color-muted);
  font-size: 14px;
  line-height: 1.55;
}

.brands-category-grid {
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.brands-category-grid li {
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.brands-stats {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

@media (min-width: 768px) {
  .brands-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

.brands-join {
  padding-block: 3rem;
  border-top: 1px solid var(--color-border);
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
  margin: 0.35rem 0 0.75rem;
  font-family: var(--font-display);
}

.hp-head-row--center {
  text-align: center;
  justify-content: center;
}
</style>
