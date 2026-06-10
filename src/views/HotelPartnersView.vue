<template>
  <div class="partners-page">
    <header class="partners-hero">
      <img :src="siteImages.banner" alt="" class="partners-hero-image" loading="eager" />
      <div class="partners-hero-inner section-inner">
        <p class="kicker">For hotels &amp; hospitality</p>
        <h1 class="partners-title">Your guests shop.<br />You earn.</h1>
        <p class="partners-lead">
          Give guests a branded in-room storefront for personal care, beauty and wellness —
          delivered same-day. Commission on every purchase, zero operational lift.
        </p>
        <div class="partners-hero-cta">
          <a
            :href="partnerMailto"
            class="btn btn-lg btn-green"
          >
            Become a partner →
          </a>
          <router-link
            :to="demoPortalLink"
            class="btn btn-lg btn-hero-secondary"
          >
            Try demo portal
          </router-link>
        </div>
      </div>
    </header>

    <section class="partners-stats section-inner">
      <article v-for="stat in stats" :key="stat.label" class="partners-stat">
        <strong>{{ stat.value }}</strong>
        <span>{{ stat.label }}</span>
      </article>
    </section>

    <section id="how-it-works" class="section partners-steps-section">
      <div class="section-inner">
        <header class="section-head-row">
          <div>
            <p class="eyebrow">How it works</p>
            <h2 class="section-title-sm">Live in four steps</h2>
          </div>
        </header>
        <ol class="partners-steps">
          <li v-for="(step, i) in steps" :key="step.title" class="partners-step">
            <span class="partners-step-num">0{{ i + 1 }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.body }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="section partners-benefits">
      <div class="section-inner">
        <header class="section-head-row">
          <div>
            <p class="eyebrow">What you get</p>
            <h2 class="section-title-sm">Built for African hotels</h2>
          </div>
        </header>
        <div class="partners-benefit-grid">
          <article v-for="(item, i) in benefits" :key="item.title" class="partners-benefit-card">
            <span class="partners-benefit-num">0{{ i + 1 }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section partners-demo">
      <div class="section-inner partners-demo-card">
        <div class="partners-demo-copy">
          <p class="eyebrow">See it live</p>
          <h2 class="section-title-sm">Walk through the guest experience</h2>
          <p>
            Scan the demo QR or open the portal — browse products, add to cart, and checkout
            with a room number. Same flow your guests will use on property.
          </p>
          <p class="partners-demo-code">
            Demo code: <strong>{{ appConfig.demoHotel.hotelCode }}</strong>
          </p>
        </div>
        <div class="partners-demo-actions">
          <router-link :to="demoPortalLink" class="btn btn-green">Open demo hotel →</router-link>
          <a :href="partnerMailto" class="btn btn-outline">Request onboarding</a>
        </div>
      </div>
    </section>

    <section class="section partners-contact">
      <div class="section-inner partners-contact-band">
        <div>
          <p class="eyebrow eyebrow-light">Onboard your property</p>
          <h2>Ready to put Necha in your hotel?</h2>
          <p>Our team sets up your slug, referral code, QR assets and catalogue within days.</p>
        </div>
        <div class="partners-contact-links">
          <a :href="`mailto:${appConfig.email}`" class="btn btn-lg btn-green">{{ appConfig.email }}</a>
          <a :href="`tel:${appConfig.phone.replace(/\s/g, '')}`" class="partners-phone">{{ appConfig.phone }}</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { appConfig } from '@/config/app'
import { siteImages } from '@/config/images'

const demoPortalLink = computed(
  () => `/hotel/${appConfig.demoHotel.hotelSlug}?ref=${appConfig.demoHotel.hotelCode}`,
)

const partnerMailto = computed(
  () => `mailto:${appConfig.email}?subject=${encodeURIComponent('Hotel partner onboarding')}`,
)

const stats = [
  { value: '0%', label: 'Setup cost for hotels' },
  { value: 'Auto', label: 'Commission payouts' },
  { value: 'Same day', label: 'Guest delivery in DSM' },
  { value: 'No app', label: 'QR scan to shop' },
]

const steps = [
  {
    title: 'We onboard your property',
    body: 'Unique referral code, co-branded guest portal at /hotel/your-slug, and QR assets for lobby and rooms.',
  },
  {
    title: 'Guests scan and browse',
    body: 'No app download — personal care, beauty and wellness tailored to your guest profile.',
  },
  {
    title: 'They checkout from the room',
    body: 'Room number at checkout, M-Pesa or card payment, same-day electric delivery across Dar es Salaam.',
  },
  {
    title: 'You earn automatically',
    body: 'Commission on every guest purchase. Monthly payouts from TZS 50,000 minimum. Zero front-desk work.',
  },
]

const benefits = [
  {
    title: 'Branded storefront',
    body: 'Your logo, your slug, your referral code — a premium extension of your guest experience.',
  },
  {
    title: 'Curated catalogue',
    body: 'African and international brands selected for hotel guests, with room-delivery logistics built in.',
  },
  {
    title: 'Guest services module',
    body: 'Optional spa, restaurant, bar, gym and nearby experiences — all bookable from one portal.',
  },
  {
    title: 'Food ordering',
    body: 'In-room food orders routed to your kitchen or partner restaurants with the same checkout flow.',
  },
  {
    title: 'Real-time orders',
    body: 'Guest purchases flow to Necha ops — your team is not managing inventory or payments.',
  },
  {
    title: 'Partner support',
    body: 'Dedicated onboarding, marketing assets, and performance reporting for your property team.',
  },
]
</script>

<style scoped>
.partners-page {
  background: var(--color-bg);
}

/* Hero */
.partners-hero {
  position: relative;
  min-height: clamp(320px, 48vw, 480px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.partners-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.partners-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--color-black) 88%, transparent),
    color-mix(in srgb, var(--color-black) 45%, transparent) 55%,
    color-mix(in srgb, var(--color-black) 18%, transparent)
  );
}

.partners-hero-inner {
  position: relative;
  z-index: 1;
  padding-block: clamp(2.5rem, 6vw, 4rem);
}

.partners-hero .kicker {
  color: var(--color-necha-green-light);
  margin-bottom: 1rem;
}

.partners-title {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  line-height: 1.05;
  color: var(--color-white);
}

.partners-lead {
  margin: 0 0 1.5rem;
  max-width: 50ch;
  font-size: 16px;
  line-height: var(--leading-body);
  color: rgba(255, 255, 255, 0.88);
}

.partners-hero-cta {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.partners-hero-cta .btn {
  width: 100%;
}

@media (min-width: 480px) {
  .partners-hero-cta {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .partners-hero-cta .btn {
    width: auto;
  }
}

.btn-green {
  background: var(--color-necha-green) !important;
  border: none !important;
  color: var(--color-white) !important;
  border-radius: var(--radius-pill) !important;
  text-transform: none;
  letter-spacing: var(--tracking-label);
}

.btn-green:hover {
  background: var(--color-necha-green-dark) !important;
}

.btn-hero-secondary {
  border-radius: var(--radius-pill) !important;
  text-transform: none;
  letter-spacing: var(--tracking-label);
  background: var(--color-surface) !important;
  border: 1.5px solid color-mix(in srgb, var(--color-white) 35%, var(--color-border)) !important;
  color: var(--color-white) !important;
}

.btn-hero-secondary:hover {
  border-color: var(--color-necha-green) !important;
  background: color-mix(in srgb, var(--color-necha-green) 12%, transparent) !important;
}

/* Stats */
.partners-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding-block: 2rem;
  border-bottom: 1px solid var(--color-border);
}

@media (min-width: 768px) {
  .partners-stats {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    padding-block: 2.5rem;
  }
}

.partners-stat {
  padding: 1.15rem 1rem;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  text-align: center;
}

.partners-stat strong {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.1;
  margin-bottom: 0.35rem;
}

.partners-stat span {
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-body);
}

/* Steps */
.partners-steps-section {
  background: var(--color-bg-soft);
}

.section-title-sm {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 2.35rem);
  font-weight: 500;
  line-height: 1.15;
}

.section-head-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-bottom: 1.75rem;
}

.partners-steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .partners-steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

.partners-step {
  display: flex;
  gap: 1rem;
  padding: 1.35rem 1.25rem;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.partners-step-num {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: var(--tracking-caps);
  color: var(--color-necha-green);
}

.partners-step h3 {
  margin: 0 0 0.4rem;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.25;
}

.partners-step p {
  margin: 0;
  font-size: 14px;
  line-height: var(--leading-body);
  color: var(--color-body);
}

/* Benefits */
.partners-benefit-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 480px) {
  .partners-benefit-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .partners-benefit-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.partners-benefit-card {
  padding: 1.35rem 1.25rem;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.partners-benefit-card:hover {
  box-shadow: var(--shadow-card);
  transform: translateY(-3px);
}

.partners-benefit-num {
  display: block;
  margin-bottom: 0.65rem;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: var(--tracking-caps);
  color: var(--color-muted);
}

.partners-benefit-card h3 {
  margin: 0 0 0.45rem;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.25;
}

.partners-benefit-card p {
  margin: 0;
  font-size: 14px;
  line-height: var(--leading-body);
  color: var(--color-body);
}

/* Demo */
.partners-demo-card {
  display: grid;
  gap: 1.5rem;
  align-items: center;
  padding: clamp(1.5rem, 4vw, 2.25rem);
  border-radius: var(--radius-2xl);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-necha-green-light) 50%, var(--color-bg)) 0%,
    var(--color-surface) 100%
  );
  border: 1px solid color-mix(in srgb, var(--color-necha-green) 30%, var(--color-border));
  box-shadow: var(--shadow-premium);
}

@media (min-width: 768px) {
  .partners-demo-card {
    grid-template-columns: 1.4fr auto;
    gap: 2rem;
  }
}

.partners-demo-copy p {
  margin: 0 0 0.85rem;
  font-size: 15px;
  line-height: var(--leading-body);
  color: var(--color-body);
  max-width: 52ch;
}

.partners-demo-code {
  font-size: 13px !important;
  color: var(--color-text) !important;
}

.partners-demo-actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-width: min(100%, 240px);
}

.partners-demo-actions .btn {
  width: 100%;
  text-align: center;
  border-radius: var(--radius-pill);
  text-transform: none;
}

/* Contact band */
.partners-contact-band {
  display: grid;
  gap: 1.5rem;
  align-items: center;
  padding: clamp(2rem, 5vw, 3rem);
  border-radius: var(--radius-2xl);
  background: linear-gradient(
    160deg,
    var(--color-black),
    color-mix(in srgb, var(--color-necha-green-dark) 35%, var(--color-black))
  );
  color: var(--color-white);
}

@media (min-width: 768px) {
  .partners-contact-band {
    grid-template-columns: 1.2fr auto;
    gap: 2rem;
  }
}

.partners-contact-band h2 {
  margin: 0 0 0.65rem;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 500;
  color: var(--color-white);
}

.partners-contact-band p {
  margin: 0;
  font-size: 15px;
  line-height: var(--leading-body);
  color: rgba(255, 255, 255, 0.82);
  max-width: 46ch;
}

.eyebrow-light {
  color: var(--color-necha-green-light);
}

.partners-contact-links {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
}

.partners-contact-links .btn {
  text-transform: none;
  letter-spacing: var(--tracking-label);
}

.partners-phone {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.partners-phone:hover {
  color: var(--color-white);
}
</style>
