<template>
  <div class="about-page">
    <header class="about-hero">
      <img :src="siteImages.banner" alt="" class="about-hero-image" loading="eager" />
      <div class="about-hero-inner section-inner">
        <p class="kicker">About us</p>
        <h1 class="about-title">Rooted in Africa,<br />built for hospitality</h1>
        <p class="about-lead">
          Necha Africa connects travellers with curated beauty, wellness, and in-room commerce
          across Dar es Salaam — without an app, without friction.
        </p>
      </div>
    </header>

    <section class="section about-story">
      <div class="section-inner story-grid">
        <figure class="story-figure">
          <img :src="siteImages.editorial" alt="Necha natural care products" loading="lazy" />
        </figure>
        <div class="story-copy">
          <p class="kicker">Welcome to Necha Africa</p>
          <h2 class="section-title">Something pretty and authentic</h2>
          <p>
            Necha Africa is a personal care, beauty and wellness platform anchored in Africa's
            hospitality industry. We connect hotel guests, everyday consumers, and wellness seekers
            with authentic African and curated international brands — delivered same-day across Dar es
            Salaam by electric vehicle.
          </p>
          <p>
            Our name comes from the Chagga language of the Kilimanjaro mountains — Necha means
            "something pretty and authentic." That is exactly what we stand for: products that are
            real, clean, and made with care.
          </p>
          <p>
            Founded in Tanzania and built for Africa, Necha is a registered limited liability company
            operating from Mbezi Beach, Dar es Salaam.
          </p>
        </div>
      </div>
    </section>

    <section class="section about-pillars">
      <div class="section-inner">
        <header class="section-intro">
          <div>
            <p class="kicker">What we stand for</p>
            <h2 class="section-title">Four commitments</h2>
          </div>
        </header>
        <div class="pillar-grid">
          <article v-for="(pillar, index) in pillars" :key="pillar.title" class="pillar-card">
            <span class="pillar-index">0{{ index + 1 }}</span>
            <h3>{{ pillar.title }}</h3>
            <p>{{ pillar.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section about-vision">
      <div class="section-inner vision-grid">
        <article>
          <p class="kicker">Vision</p>
          <h2 class="section-title">Africa's most trusted wellness platform</h2>
          <p>
            Our vision is to be Africa's most trusted personal care, beauty and wellness platform —
            anchored in hospitality and serving every guest, consumer and professional who seeks
            quality, authenticity and care.
          </p>
        </article>
        <article>
          <p class="kicker">Mission</p>
          <h2 class="section-title">Accessible, authentic care</h2>
          <p>
            Our mission is to make authentic African personal care, beauty and wellness accessible to
            everyone — hotel guests, everyday shoppers, and professional buyers. We do this by
            partnering with hotels, empowering influencers, supporting African brands, and delivering
            with care across every zone we serve.
          </p>
          <p>
            We are committed to giving back: 10% of our profits support women seaweed farmers in
            Tanzania through health insurance partnerships.
          </p>
        </article>
      </div>
    </section>

    <section class="about-mission">
      <div class="section-inner mission-inner">
        <p class="kicker">What we believe</p>
        <p class="mission-mark" aria-hidden="true">“</p>
        <blockquote>
          We believe beauty and wellness should be authentic — starting with what you put in and on
          your body. Every product on Necha Africa is chosen for its quality, its ingredients, and
          the integrity of the brand behind it. Clean formulations, honest sourcing, and real results
          are non-negotiable for us.
        </blockquote>
      </div>
    </section>

    <section class="section about-founder">
      <div class="section-inner founder-grid">
        <div class="founder-copy">
          <p class="kicker">Meet our founder</p>
          <h2 class="section-title">Daniella Kwayu</h2>
          <p>
            Necha Africa was built from a belief that African hospitality deserves a wellness layer
            as thoughtful as the stay itself — real products, real brands, delivered with care.
          </p>
          <p>
            From our base in Mbezi Beach, we partner with hotels across Dar es Salaam so guests can
            order botanical personal care from their room, and we champion African makers who craft
            with integrity.
          </p>
          <p>
            Thank you for being part of this journey — whether you are a guest, a hotel partner, or
            discovering Necha for the first time.
          </p>
          <p class="founder-signoff">
            <strong>Daniella Kwayu</strong><br />
            CEO &amp; Founder, Necha Africa
          </p>
        </div>
        <figure class="founder-figure">
          <img :src="siteImages.editorial" alt="Necha Africa founder" loading="lazy" />
        </figure>
      </div>
    </section>

    <section class="section about-hotels">
      <div class="section-inner hotels-grid">
        <div class="hotels-copy">
          <p class="kicker">For hotel partners</p>
          <h2 class="section-title">Your property, your portal</h2>
          <p class="section-lead">
            Each partner hotel receives a unique referral code and branded guest storefront. Guests
            scan a QR in the lobby or room, browse products, and check out with their room number.
          </p>
          <ul class="hotels-list">
            <li v-for="item in partnerBenefits" :key="item">{{ item }}</li>
          </ul>
          <p class="hotels-contact">
            To onboard a property, email
            <a :href="`mailto:${appConfig.email}`">{{ appConfig.email }}</a>
            or call
            <a :href="`tel:${appConfig.phone.replace(/\s/g, '')}`">{{ appConfig.phone }}</a>.
          </p>
        </div>
        <figure class="hotels-figure">
          <img :src="siteImages.why.delivery" alt="Room delivery at partner hotels" loading="lazy" />
          <figcaption>
            <ul class="hotels-stats">
              <li v-for="stat in partnerStats" :key="stat.label">
                <strong>{{ stat.value }}</strong>
                <span>{{ stat.label }}</span>
              </li>
            </ul>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="section about-visit">
      <div class="section-inner visit-band">
        <div>
          <p class="kicker visit-kicker">Visit us</p>
          <h2 class="visit-title">House No. 2, Salous Street</h2>
          <p class="visit-address">{{ appConfig.address }}</p>
          <p class="visit-hours">{{ appConfig.hours }}</p>
        </div>
        <div class="visit-actions">
          <router-link to="/shop" class="btn btn-lg">Shop collection</router-link>
          <router-link to="/hotel-partners" class="btn btn-lg btn-outline">Hotel partners</router-link>
        </div>
        <div class="visit-contact">
          <a :href="`tel:${appConfig.phone.replace(/\s/g, '')}`">{{ appConfig.phone }}</a>
          <span class="visit-divider" aria-hidden="true" />
          <a :href="`mailto:${appConfig.email}`">{{ appConfig.email }}</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { appConfig } from '@/config/app'
import { siteImages } from '@/config/images'

const pillars = [
  {
    title: 'African sourcing',
    body: 'We curate personal care, beauty, and wellness from trusted African brands — starting with NECHA NATURALS.',
  },
  {
    title: 'Same-day delivery',
    body: 'Orders reach hotel rooms and homes across Dar es Salaam, with zone-based logistics and EV fleet coverage.',
  },
  {
    title: 'Guest-first checkout',
    body: 'No app download. Scan a QR, enter a property code, and complete checkout from any mobile browser.',
  },
  {
    title: 'Trusted payments',
    body: 'M-Pesa, Tigo Pesa, Airtel Money, and card — settled securely at checkout.',
  },
]

const partnerBenefits = [
  'Unique referral code and branded guest portal per property',
  'Commission on qualifying purchases — no inventory burden on staff',
  'Products, dining, spa, and reservations in one guest link',
  'Real-time order tracking for front office and guests',
]

const partnerStats = [
  { value: 'QR', label: 'Lobby & room entry' },
  { value: '24h', label: 'Guest checkout window' },
  { value: '0', label: 'Apps to install' },
]
</script>

<style scoped>
.about-page {
  background: var(--color-bg);
}

/* Hero */
.about-hero {
  position: relative;
  min-height: clamp(280px, 42vw, 440px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.about-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--color-black) 88%, transparent) 0%,
    color-mix(in srgb, var(--color-black) 40%, transparent) 50%,
    color-mix(in srgb, var(--color-black) 20%, transparent) 100%
  );
}

.about-hero-inner {
  position: relative;
  z-index: 1;
  padding-block: clamp(2.5rem, 6vw, 4rem);
}

.about-hero .kicker {
  color: var(--color-necha-green-light);
  margin-bottom: 1rem;
}

.about-title {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  line-height: 1.05;
  color: var(--color-white);
}

.about-lead {
  margin: 0;
  max-width: 48ch;
  font-size: 16px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.85);
}

/* Story */
.about-story {
  background: var(--color-bg);
}

.story-grid {
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 900px) {
  .story-grid {
    grid-template-columns: 1fr 1.05fr;
    gap: 4rem;
  }
}

.story-figure {
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.story-figure img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.story-copy p {
  margin: 0 0 1.15rem;
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-body);
}

.story-copy p:last-child {
  margin-bottom: 0;
}

.story-copy .section-title {
  margin-bottom: 1.25rem;
}

/* Pillars */
.about-pillars {
  background: var(--color-bg-soft);
}

.section-intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.pillar-grid {
  display: grid;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .pillar-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .pillar-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.pillar-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1.5rem 1.25rem;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-top: 2px solid var(--color-necha-green);
}

.pillar-index {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-necha-green);
}

.pillar-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.2;
}

.pillar-card p {
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: var(--color-body);
}

/* Vision */
.about-vision {
  background: var(--color-bg-soft);
}

.vision-grid {
  display: grid;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .vision-grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}

.vision-grid article p {
  margin: 0 0 1rem;
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-body);
}

.vision-grid .section-title {
  margin-bottom: 1rem;
}

/* Founder */
.about-founder {
  background: var(--color-bg);
}

.founder-grid {
  display: grid;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 900px) {
  .founder-grid {
    grid-template-columns: 1.1fr 0.9fr;
    gap: 3rem;
  }
}

.founder-copy p {
  margin: 0 0 1rem;
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-body);
}

.founder-signoff {
  margin-top: 1.5rem !important;
  font-size: 14px !important;
  color: var(--color-text) !important;
}

.founder-figure {
  margin: 0;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.founder-figure img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

/* Mission */
.about-mission {
  padding: clamp(3rem, 6vw, 5rem) 0;
  background: var(--color-bg-warm);
  border-block: 1px solid var(--color-border);
}

.mission-inner {
  max-width: 720px;
  text-align: center;
}

.mission-mark {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: 3.5rem;
  line-height: 1;
  color: var(--color-necha-green);
  opacity: 0.5;
}

.mission-inner blockquote {
  margin: 0 0 1.25rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 400;
  line-height: 1.35;
  color: var(--color-text);
}

.mission-cite {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
}

/* Hotels */
.about-hotels {
  background: var(--color-bg);
}

.hotels-grid {
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 960px) {
  .hotels-grid {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}

.hotels-copy .section-title {
  margin-bottom: 1rem;
}

.hotels-list {
  margin: 1.75rem 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.65rem;
}

.hotels-list li {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-body);
  padding-left: 1rem;
  border-left: 2px solid var(--color-necha-green);
}

.hotels-contact {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-body);
}

.hotels-contact a {
  color: var(--color-text);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hotels-figure {
  position: relative;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  min-height: 360px;
}

.hotels-figure img {
  width: 100%;
  height: 100%;
  min-height: 360px;
  object-fit: cover;
}

.hotels-figure figcaption {
  position: absolute;
  inset: auto 0 0 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(12, 12, 12, 0.9), transparent);
}

.hotels-stats {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 2.5rem;
}

.hotels-stats strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--color-white);
  line-height: 1;
}

.hotels-stats span {
  display: block;
  margin-top: 0.2rem;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
}

/* Visit */
.about-visit {
  padding-bottom: clamp(3rem, 6vw, 5rem);
}

.visit-band {
  display: grid;
  gap: 2rem;
  padding: clamp(2rem, 5vw, 3.5rem);
  background: var(--color-black);
  color: var(--color-white);
}

@media (min-width: 768px) {
  .visit-band {
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .visit-contact {
    grid-column: 1 / -1;
  }
}

.visit-kicker {
  color: var(--color-necha-green-light);
  margin-bottom: 0.75rem;
}

.visit-title {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 400;
  line-height: 1.15;
  color: var(--color-white);
}

.visit-address,
.visit-hours {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
}

.visit-hours {
  margin-top: 0.35rem;
}

.visit-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 480px) {
  .visit-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.visit-band .btn-outline {
  border-color: rgba(255, 255, 255, 0.35);
  color: var(--color-white);
  background: transparent;
}

.visit-band .btn-outline:hover {
  border-color: var(--color-white);
  background: rgba(255, 255, 255, 0.08);
}

.visit-band .btn:not(.btn-outline) {
  background: var(--color-necha-green);
  border-color: var(--color-necha-green);
}

.visit-contact {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  font-size: 14px;
}

.visit-contact a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
}

.visit-contact a:hover {
  color: var(--color-necha-green-light);
}

.visit-divider {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.25);
}

.kicker {
  margin: 0 0 0.75rem;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-muted);
}

@media (max-width: 639px) {
  .visit-actions {
    width: 100%;
  }

  .visit-actions .btn {
    width: 100%;
  }
}
</style>
