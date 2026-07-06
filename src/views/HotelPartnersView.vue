<template>
  <div ref="pageRef" class="pl-page">
    <p v-if="showHotelError" class="pl-notice">
      That hotel link wasn't recognised.
      <router-link to="/#form-sec">Become a partner</router-link>
      or enter your property code on the demo portal.
    </p>

    <h2 class="sr-only">
      Necha Africa hotel partner landing — featured product showcase, how it works, earnings
      calculator, founding cohort, brand partner flow, platform features, and sign-up form.
    </h2>

    <!-- Homepage hero — Excel MOC / client brief -->
    <section class="pl-home-hero" :style="{ '--hero-bg': `url(${siteImages.partnerLanding.heroA})` }">
      <div class="pl-home-hero-scrim" aria-hidden="true" />
      <div class="pl-container pl-home-hero-inner">
        <p class="pl-home-hero-kicker">Necha Africa</p>
        <h1 class="pl-home-hero-title">Make hotels and rentals shoppable</h1>
        <p class="pl-home-hero-sub">
          A hospitality industry commerce infrastructure layer for African tourism.
        </p>
        <p class="pl-home-hero-lead">
          Turn every tourist touchpoint into a revenue stream — hospitality, discovery, and concierge commerce
          for hotels, brands and travellers.
        </p>
        <div class="pl-home-hero-ctas">
          <button type="button" class="pl-hero-cta-btn pl-hero-cta-btn--primary" @click="scrollTo('form-sec')">
            For hotels
          </button>
          <button type="button" class="pl-hero-cta-btn" @click="openBrandForm">For brands</button>
          <router-link to="/discovery" class="pl-hero-cta-btn pl-hero-cta-btn--ghost">For guests</router-link>
        </div>
      </div>
    </section>

    <!-- Why Necha -->
    <section id="why-sec" class="hp-section pl-sec-w pl-reveal" :class="{ 'is-visible': revealed.why }">
      <div class="section-inner">
        <header class="hp-head-row hp-head-row--center">
          <div>
            <p class="eyebrow">Why Necha</p>
            <h2 class="hp-title">Built for African tourism</h2>
          </div>
        </header>
        <div class="hp-why-grid">
          <article v-for="(item, i) in whyItems" :key="item.title" class="hp-why-tile">
            <span class="hp-why-num">0{{ i + 1 }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Partner hotel showcase -->
    <section v-if="partnerHotels.length" class="pl-showcase-strip pl-sec-g">
      <div class="pl-container">
        <header class="pl-sh pl-sh--center">
          <p class="pl-sh-pill"><span class="pl-sh-dot" />Our partner hotels</p>
          <h2>Trusted by leading properties</h2>
        </header>
        <ul class="pl-showcase-logos">
          <li v-for="hotel in partnerHotels" :key="hotel.slug">
            <span class="pl-partner-chip">{{ hotel.name }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Brand showcase -->
    <section class="pl-showcase-strip pl-sec-w">
      <div class="pl-container">
        <header class="pl-sh pl-sh--center">
          <p class="pl-sh-pill"><span class="pl-sh-dot" />Our partner brands</p>
          <h2>Authentic African commerce</h2>
          <p class="pl-sh-s">Curated personal care, wellness, travel essentials and local artisan products.</p>
        </header>
        <ul class="pl-brand-categories">
          <li v-for="cat in brandCategories" :key="cat">{{ cat }}</li>
        </ul>
        <div class="pl-showcase-cta">
          <router-link to="/brands" class="pl-hero-cta-btn">Explore brand partners</router-link>
        </div>
      </div>
    </section>

    <nav class="pl-jump" aria-label="On this page">
      <div class="pl-container pl-jump-inner">
        <a
          v-for="link in jumpLinks"
          :key="link.id"
          :href="`#${link.id}`"
          :class="{ 'is-active': activeSection === link.id }"
          @click.prevent="navTo(link.id)"
        >
          {{ link.label }}
        </a>
      </div>
    </nav>

    <!-- How it works -->
    <section id="how-sec" class="pl-sec pl-sec-w pl-reveal" :class="{ 'is-visible': revealed.how }">
      <div class="pl-container">
        <header class="pl-sh">
          <div class="pl-sh-pill"><span class="pl-sh-dot" />How it works</div>
          <h2>Four steps to your first commission</h2>
          <p class="pl-sh-s">From agreement to first guest order in one week</p>
        </header>
        <div class="pl-steps pl-steps--timeline">
          <article v-for="(step, i) in steps" :key="step.title" class="pl-step">
            <div class="pl-step-img">
              <img :src="step.image" :alt="step.imageAlt" loading="lazy" />
            </div>
            <div class="pl-step-body">
              <div class="pl-stn">{{ i + 1 }}</div>
              <div class="pl-stt">{{ step.title }}</div>
              <div class="pl-std">{{ step.body }}</div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Calculator -->
    <section id="calc-sec" class="pl-sec pl-sec-g pl-reveal" :class="{ 'is-visible': revealed.calc }">
      <div class="pl-container">
        <header class="pl-sh">
          <div class="pl-sh-pill"><span class="pl-sh-dot" />Earnings calculator</div>
          <h2>What would your hotel earn?</h2>
          <p class="pl-sh-s">Adjust the sliders to match your property</p>
        </header>
        <div class="pl-calc-layout">
          <div class="pl-calc-main">
            <HotelEarningsCalculator variant="classic" />
          </div>
          <aside class="pl-calc-visual" aria-hidden="true">
            <img
              :src="siteImages.partnerLanding.calculator"
              alt=""
              loading="lazy"
            />
            <p class="pl-calc-visual-cap">Curated wellness · delivered to your room in under 30 minutes</p>
          </aside>
        </div>
      </div>
    </section>

    <!-- Founding cohort (Excel: before Why) -->
    <section
      id="founding-sec"
      class="pl-founding pl-founding--center"
      :style="{ '--founding-bg': `url(${siteImages.partnerLanding.founding})` }"
    >
      <div class="pl-container pl-founding-inner">
        <div class="pl-founding-layout">
          <div class="pl-founding-copy">
            <div class="pl-f-pill"><span class="pl-f-dot" />Limited availability</div>
            <h2 class="pl-f-h">Join our founding hotel partner program</h2>
            <p class="pl-f-s">
              Sign up today and join our hotel network and traveller ecosystem. Access products and services
              curated specifically to enhance a traveller's experience.
            </p>
            <p class="pl-f-s">
              Only {{ foundingSpotsTotal }} founding hotel partner spots available. Founding partners receive a
              50% commission rate for Year 1 — then move to the standard 30% rate. This rate closes when the
              cohort fills. Spots are allocated in signing order.
            </p>
            <div class="pl-founding-stats">
              <span class="pl-founding-stat"><strong>TZS 0</strong> to join</span>
              <span class="pl-founding-stat"><strong>50%</strong> commission for founding partners</span>
            </div>
            <p class="pl-founding-count">
              <strong>{{ spotsRemaining }}</strong> of {{ foundingSpotsTotal }} spots still open · closing out soon
            </p>
            <button type="button" class="pl-bp pl-founding-btn pl-founding-btn--inline" @click="onFoundingCtaClick">
              Secure your spot before they close
            </button>
            <p class="pl-f-note">No commitment until the agreement is countersigned by both parties.</p>
          </div>
          <div class="pl-founding-visual">
            <div class="pl-founding-ring-wrap" aria-hidden="true">
              <svg viewBox="0 0 100 100" class="pl-founding-ring">
                <circle cx="50" cy="50" r="42" class="pl-founding-ring-bg" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  class="pl-founding-ring-fill"
                  :style="{ strokeDashoffset: foundingRingOffset }"
                />
              </svg>
              <span class="pl-founding-ring-label">{{ foundingFillPct }}% claimed</span>
            </div>
            <div
              class="pl-spots"
              :aria-label="`Founding spots: ${foundingSpotsTaken} taken, ${spotsRemaining} available`"
            >
              <button
                v-for="i in foundingSpotsTotal"
                :key="i"
                type="button"
                class="pl-spot"
                :class="{
                  'pl-spot-t': i <= foundingSpotsTaken,
                  'pl-spot-next': i === foundingSpotsTaken + 1,
                }"
                :disabled="i !== foundingSpotsTaken + 1 && i > foundingSpotsTaken"
                :aria-label="foundingSpotLabel(i)"
                @click="onFoundingSpotClick(i, $event)"
              >
                <span v-if="i <= foundingSpotsTaken" aria-hidden="true">✓</span>
                <span v-else-if="i === foundingSpotsTaken + 1" class="pl-spot-pulse" aria-hidden="true">?</span>
              </button>
            </div>
            <div v-if="partnerHotels.length" class="pl-partner-logos">
              <p class="pl-partner-logos-label">Our partner hotels</p>
              <ul class="pl-partner-chips">
                <li v-for="hotel in partnerHotels.slice(0, 8)" :key="hotel.slug">
                  <span class="pl-partner-chip">{{ hotel.name }}</span>
                </li>
              </ul>
            </div>
            <button type="button" class="pl-bp pl-founding-btn" @click="onFoundingCtaClick">
              Join now
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Why partner with Necha (hotel program) -->
    <section id="why-partner-sec" class="hp-section hp-section--soft pl-reveal" :class="{ 'is-visible': revealed.whyPartner }">
      <div class="section-inner">
        <header class="hp-head-row">
          <div>
            <p class="eyebrow">Hotel partnership</p>
            <h2 class="hp-title">Your guests explore the city from their room</h2>
            <p class="hp-lead">
              Guests scan, order, book, reserve and receive. You earn a commission on every purchase.
              No stock. No investment. No staff overhead.
            </p>
          </div>
        </header>
      </div>
    </section>

    <!-- Discovery Portal -->
    <DiscoveryShowcase :header-image="siteImages.partnerLanding.discovery" />

    <!-- Brands -->
    <section id="brands-sec" class="hp-section">
      <div class="section-inner">
        <div class="hp-promo">
          <div class="hp-promo-copy">
            <p class="eyebrow">For brand partners</p>
            <h2>Reach travellers &amp; tourists on their holiday journey</h2>
            <p>A direct channel into the tourism economy through our hotel &amp; partner network — without building your own distribution.</p>
            <ol class="hp-steps-list">
              <li v-for="(node, i) in brandFlowSimple" :key="node.title">
                <span>0{{ i + 1 }}</span>
                <strong>{{ node.title }}</strong> — {{ node.sub }}
              </li>
            </ol>
            <div class="hp-stat-grid" role="list">
              <article
                v-for="stat in brandStats"
                :key="stat.label"
                class="hp-stat-card"
                :class="{ 'hp-stat-card--accent': stat.accent }"
                role="listitem"
              >
                <p class="hp-stat-kicker">{{ stat.kicker }}</p>
                <p class="hp-stat-value">{{ stat.value }}</p>
                <p class="hp-stat-label">{{ stat.label }}</p>
              </article>
            </div>
            <p class="hp-source">
              Source: Tanzania NBS / Bank of Tanzania, 2024 International Visitors Exit Survey
            </p>
            <button type="button" class="btn btn-green" @click="openBrandForm">Apply to join Necha ecosystem</button>
          </div>
          <div class="hp-promo-visual">
            <img
              :src="siteImages.partnerLanding.brands"
              alt="Local wellness brands reaching hotel guests through Necha"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Platform -->
    <section id="platform-sec" class="hp-section hp-section--soft">
      <div class="section-inner">
        <header class="hp-head-row">
          <div>
            <p class="eyebrow">The platform</p>
            <h2 class="hp-title">Six key features</h2>
            <p class="hp-lead"><span class="font-numeric">TZS 30,000</span> per hotel per month — all modules included</p>
          </div>
        </header>

        <div class="hp-platform">
          <div class="hp-platform-visual">
            <img
              :src="siteImages.partnerLanding.platform"
              alt="Co-branded hotel storefront on guest phone"
              loading="lazy"
            />
            <div class="hp-platform-visual-cap">
              <span>Guest view</span>
              <strong>Your hotel shop</strong>
            </div>
          </div>

          <div>
            <ol class="hp-feature-list">
              <li v-for="(feature, i) in platformFeatures" :key="feature.title" class="hp-feature-item">
                <div class="hp-feature-item-head">
                  <span class="hp-feature-tag">{{ feature.tag }}</span>
                  <span class="hp-feature-num">0{{ i + 1 }}</span>
                </div>
                <h3>{{ feature.title }}</h3>
                <ul>
                  <li v-for="item in feature.items" :key="item">{{ item }}</li>
                </ul>
              </li>
            </ol>
            <p class="hp-platform-price">
              All six features included. <strong>TZS 30,000 per hotel per month.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Form -->
    <section id="form-sec" class="pl-sec pl-sec-w pl-form-sec">
      <div class="pl-container pl-container--narrow">
        <header class="pl-sh">
          <div class="pl-sh-pill"><span class="pl-sh-dot" />Join Necha Africa</div>
          <h2>Join Necha Africa</h2>
          <p class="pl-sh-s">We respond within 24 hours. No spam. No obligation until you countersign.</p>
        </header>
        <div class="pl-form-card">
          <PartnerSignupForm ref="signupFormRef" :initial-tab="formTab" />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPartnersLanding, type PartnerHotelCard } from '@/api/partners'
import DiscoveryShowcase from '@/components/partners/DiscoveryShowcase.vue'
import HotelEarningsCalculator from '@/components/partners/HotelEarningsCalculator.vue'
import PartnerSignupForm from '@/components/partners/PartnerSignupForm.vue'
import { appConfig } from '@/config/app'
import { siteImages } from '@/config/images'
import '@/assets/partner-landing.css'
import '@/assets/home-sections.css'

const route = useRoute()
const pageRef = ref<HTMLElement | null>(null)

const activeSection = ref('how-sec')
const partnerHotels = ref<PartnerHotelCard[]>([])
const revealed = reactive({ how: false, calc: false, why: false, whyPartner: false })
const FOUNDING_RING_C = 2 * Math.PI * 42

const jumpLinks = [
  { id: 'why-sec', label: 'Why Necha' },
  { id: 'how-sec', label: 'How it works' },
  { id: 'calc-sec', label: 'Earnings calculator' },
  { id: 'founding-sec', label: 'Founding program' },
  { id: 'discovery-sec', label: 'Discovery' },
  { id: 'platform-sec', label: 'The platform' },
  { id: 'form-sec', label: 'Join Necha' },
]

const formTab = ref<'hotel' | 'brand'>('hotel')
const signupFormRef = ref<InstanceType<typeof PartnerSignupForm> | null>(null)

let sectionObserver: IntersectionObserver | null = null
let revealObserver: IntersectionObserver | null = null

const prefersReducedMotion = ref(false)

const foundingSpotsTotal = ref(10)
const foundingSpotsTaken = ref(3)

const showHotelError = computed(() => route.query.hotelError === '1')

const spotsRemaining = computed(() =>
  Math.max(0, foundingSpotsTotal.value - foundingSpotsTaken.value),
)

const foundingFillPct = computed(() =>
  foundingSpotsTotal.value
    ? Math.round((foundingSpotsTaken.value / foundingSpotsTotal.value) * 100)
    : 0,
)

const foundingRingOffset = computed(
  () => FOUNDING_RING_C * (1 - foundingSpotsTaken.value / Math.max(foundingSpotsTotal.value, 1)),
)

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

async function loadLandingData() {
  try {
    const data = await fetchPartnersLanding(appConfig.demoHotel.hotelSlug)
    foundingSpotsTotal.value = data.founding_spots_total
    foundingSpotsTaken.value = data.founding_spots_taken
    partnerHotels.value = data.partner_hotels ?? []
  } catch {
    // Keep defaults when API is unavailable
  }
}

const steps = [
  {
    title: 'Sign the agreement',
    body: 'One page. Commission based. No upfront fee.',
    image: siteImages.partnerLanding.steps[0],
    imageAlt: 'Hotel partnership agreement signing',
  },
  {
    title: 'We install QR codes',
    body: "Necha's team places hotel branded QR codes in your rooms, front desk, spa and lounge.",
    image: siteImages.partnerLanding.steps[1],
    imageAlt: 'Branded QR codes in hotel rooms',
  },
  {
    title: 'Brief your staff',
    body: 'One 60-minute session. Mention it at check-in. That is all we ask.',
    image: siteImages.partnerLanding.steps[2],
    imageAlt: 'Hotel front desk team briefing',
  },
  {
    title: 'Earn every month',
    body: 'Commission paid monthly. Automatic. No invoicing needed. Sales data sent monthly.',
    image: siteImages.partnerLanding.steps[3],
    imageAlt: 'Wellness products delivered to hotel guest room',
  },
]

const whyItems = [
  {
    title: 'New revenue, zero risk',
    body: 'Earn on every guest order. No stock. No capital. No staff overhead.',
  },
  {
    title: 'Secure payments',
    body: 'Our system is integrated with a payment gateway for both mobile and card payments.',
  },
  {
    title: 'Better guest experience',
    body: 'Essentials and wellness delivered to the room in under 30 minutes.',
  },
  {
    title: 'Your brand, front and centre',
    body: 'Guests see your hotel name and logo — not Necha. Feels like your service.',
  },
  {
    title: 'Guest spending insights',
    body: 'Monthly reports: what your guests buy, when, and how often.',
  },
  {
    title: 'Built for Africa tourism',
    body: 'Designed around Tanzania and East Africa hospitality reality.',
  },
]

const brandFlowSimple = [
  { title: 'Sign the agreement', sub: 'Fill in KYC form. Agree to commission rates.' },
  { title: 'Onboard products', sub: 'Provide product price list. Agree fulfilment terms.' },
  { title: 'Go live', sub: 'Products featured on Necha platform for customers' },
  { title: 'Earn every month', sub: 'Commission and brand payouts monthly. Sales data sent monthly.' },
]

const brandStats = [
  { kicker: 'Visitor volume', value: '2.14M', label: 'International visitors to Tanzania, 2024' },
  { kicker: 'Avg. spend', value: 'USD 243', label: 'Average tourist spend per night' },
  {
    kicker: 'The gap',
    value: '0',
    label: 'Local brands with hotel-room distribution today',
    accent: true,
  },
]

const platformFeatures = [
  {
    tag: 'Branded storefront',
    title: "Your hotel's commerce layer",
    items: [
      'Purchase curated products and travel essentials from local brands',
      'Hotel-linked QR code in every room, reception desk and public lounge',
      'Live order and delivery tracking',
      'Co-branded with your hotel name and logo',
    ],
  },
  {
    tag: 'Room service',
    title: 'Order food & drinks',
    items: [
      'In-room dining from hotel kitchen',
      'Live order tracking',
      'In-room bar delivery',
    ],
  },
  {
    tag: 'Book experiences',
    title: 'Adventures & tours',
    items: [
      'Safari & spice tours',
      'Airport transfers',
      'Local events',
      'Curated dining experiences',
    ],
  },
  {
    tag: 'Spa & wellness',
    title: 'Book a session',
    items: [
      'Hotel spa appointments',
      'External wellness providers',
      'Authentic local treatments',
      'Sports activities',
    ],
  },
  {
    tag: 'Discovery',
    title: 'Explore the city',
    items: [
      'Discover events happening around the city',
      'Discover restaurants, bars & lounges around you',
      'Tours and experiences from partner operators',
    ],
  },
  {
    tag: 'Guest insights',
    title: 'Your data',
    items: [
      'Monthly sales and guest spending reports',
      'Commission paid automatically',
      'No invoicing needed from your side',
    ],
  },
]

function burstConfetti(x: number, y: number) {
  if (prefersReducedMotion.value || !pageRef.value) return
  const colors = ['#74c69d', '#ef9f27', '#0f6e56', '#9fe1cb', '#ffffff']
  for (let i = 0; i < 36; i++) {
    const bit = document.createElement('span')
    bit.className = 'pl-confetti-bit'
    bit.style.left = `${x}px`
    bit.style.top = `${y}px`
    bit.style.background = colors[i % colors.length]!
    bit.style.setProperty('--dx', `${(Math.random() - 0.5) * 220}px`)
    bit.style.setProperty('--dy', `${-60 - Math.random() * 160}px`)
    bit.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`)
    pageRef.value.appendChild(bit)
    bit.addEventListener('animationend', () => bit.remove())
  }
}

function foundingSpotLabel(i: number) {
  if (i <= foundingSpotsTaken.value) return `Founding spot ${i} — taken`
  if (i === foundingSpotsTaken.value + 1) return `Founding spot ${i} — next available`
  return `Founding spot ${i} — not yet open`
}

function onFoundingSpotClick(i: number, event: MouseEvent) {
  if (i !== foundingSpotsTaken.value + 1) return
  burstConfetti(event.clientX, event.clientY)
  scrollTo('form-sec')
}

function onFoundingCtaClick(event: MouseEvent) {
  burstConfetti(event.clientX, event.clientY)
  scrollTo('form-sec')
}

function setupRevealObserver() {
  revealObserver?.disconnect()
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const id = entry.target.id
        if (id === 'how-sec') revealed.how = true
        if (id === 'calc-sec') revealed.calc = true
        if (id === 'why-sec') revealed.why = true
        if (id === 'why-partner-sec') revealed.whyPartner = true
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )
  for (const id of ['how-sec', 'calc-sec', 'why-sec', 'why-partner-sec']) {
    const el = document.getElementById(id)
    if (el) revealObserver.observe(el)
  }
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function navTo(id: string) {
  scrollTo(id)
}

function setupSectionObserver() {
  sectionObserver?.disconnect()
  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      const top = visible[0]
      if (top?.target.id) activeSection.value = top.target.id
    },
    { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
  )
  for (const link of jumpLinks) {
    const el = document.getElementById(link.id)
    if (el) sectionObserver.observe(el)
  }
}

function openBrandForm() {
  formTab.value = 'brand'
  signupFormRef.value?.setTab('brand')
  scrollTo('form-sec')
}

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  void loadLandingData()
  setupSectionObserver()
  setupRevealObserver()
})

onUnmounted(() => {
  sectionObserver?.disconnect()
  revealObserver?.disconnect()
})
</script>
