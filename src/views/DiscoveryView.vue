<template>
  <div class="discovery-page">
    <header class="discovery-page-hero">
      <div class="section-inner">
        <p class="eyebrow">Discovery</p>
        <h1 class="discovery-page-title">Explore Dar es Salaam</h1>
        <p class="discovery-page-lead">
          Events, places to eat, experiences, partner hotels, and shop deals — curated for guests and locals.
        </p>
      </div>
    </header>

    <div class="discovery-page-toolbar section-inner">
      <nav class="discovery-page-tabs" aria-label="Discovery categories">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="discovery-page-tab"
          :class="{ on: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>
      <label class="discovery-page-search">
        <span class="sr-only">Search discovery</span>
        <input v-model="searchQuery" type="search" placeholder="Search events, hotels, deals…" />
      </label>
    </div>

    <div class="section-inner discovery-page-body">
      <p v-if="loading" class="discovery-page-status">Loading discovery…</p>

      <template v-else>
        <!-- Events & experiences -->
        <section
          v-if="showSection('events') && filteredEvents.length"
          id="events"
          class="discovery-page-section"
        >
          <header class="hp-head-row">
            <div>
              <h2 class="hp-title">Events</h2>
              <p class="hp-lead">What is happening in Dar this week</p>
            </div>
          </header>
          <div class="discovery-page-grid">
            <article v-for="item in filteredEvents" :key="item.id" class="hp-discovery-item">
              <DiscoveryItemBody :item="item" />
            </article>
          </div>
        </section>

        <section
          v-if="showSection('restaurants') && filteredRestaurants.length"
          id="restaurants"
          class="discovery-page-section"
        >
          <header class="hp-head-row">
            <div>
              <h2 class="hp-title">Restaurants</h2>
              <p class="hp-lead">Where to eat around you</p>
            </div>
          </header>
          <div class="discovery-page-grid">
            <article v-for="item in filteredRestaurants" :key="item.id" class="hp-discovery-item">
              <DiscoveryItemBody :item="item" />
            </article>
          </div>
        </section>

        <section
          v-if="showSection('tours') && filteredTours.length"
          id="tours"
          class="discovery-page-section"
        >
          <header class="hp-head-row">
            <div>
              <h2 class="hp-title">Tours &amp; experiences</h2>
              <p class="hp-lead">Things to do during your stay</p>
            </div>
          </header>
          <div class="discovery-page-grid">
            <article v-for="item in filteredTours" :key="item.id" class="hp-discovery-item">
              <DiscoveryItemBody :item="item" />
            </article>
          </div>
        </section>

        <!-- Hotels -->
        <section v-if="showSection('hotels') && filteredHotels.length" id="hotels" class="discovery-page-section">
          <header class="hp-head-row">
            <div>
              <h2 class="hp-title">Partner hotels</h2>
              <p class="hp-lead">Order to your room or browse the in-hotel shop</p>
            </div>
          </header>
          <div class="discovery-hotel-grid">
            <router-link
              v-for="hotel in filteredHotels"
              :key="hotel.slug"
              :to="hotelPortalPath(hotel.slug)"
              class="discovery-hotel-card"
            >
              <span class="discovery-hotel-initials">{{ hotel.initials }}</span>
              <div>
                <h3>{{ hotel.name }}</h3>
                <p>{{ hotel.location }}</p>
              </div>
              <span class="discovery-hotel-go" aria-hidden="true">→</span>
            </router-link>
          </div>
        </section>

        <!-- Deals -->
        <section v-if="showSection('deals') && filteredDeals.length" id="deals" class="discovery-page-section">
          <header class="hp-head-row">
            <div>
              <h2 class="hp-title">Shop deals</h2>
              <p class="hp-lead">Wellness favourites — delivered by electric vehicle</p>
            </div>
            <router-link to="/shop" class="btn-view">View shop →</router-link>
          </header>
          <div class="discovery-deals-grid">
            <ProductCard
              v-for="product in filteredDeals"
              :key="product.id"
              :product="product"
              :to="product.slug ? productPath(product.slug) : undefined"
            />
          </div>
        </section>

        <p v-if="!hasVisibleResults" class="discovery-page-status">
          Nothing matched your search. Try another category or clear the search box.
        </p>
      </template>
    </div>

    <section id="list-event" class="hp-section hp-section--soft">
      <div class="section-inner discovery-submit">
        <div>
          <p class="eyebrow">List your event</p>
          <h2 class="hp-title">Got something happening in Dar?</h2>
          <p class="hp-lead">
            Submit your event for review — we publish approved listings to hotel guests across the Necha network.
          </p>
        </div>
        <EventSubmitForm />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { fetchDiscoveryPortal } from '@/api/discovery'
import { fetchPartnersLanding, type PartnerHotelCard } from '@/api/partners'
import ProductCard from '@/components/ProductCard.vue'
import EventSubmitForm from '@/components/discovery/EventSubmitForm.vue'
import { catalogConfig, productPath } from '@/config/app'
import { subcategoryLabel } from '@/config/discovery'
import { useCatalogStore } from '@/stores/catalog'
import type { CommerceProduct } from '@/types/commerce'
import type { DiscoveryItem } from '@/types/discovery'
import '@/assets/home-sections.css'
import '@/assets/discovery-page.css'

type DiscoveryTab = 'all' | 'events' | 'restaurants' | 'tours' | 'hotels' | 'deals'

const tabs: { id: DiscoveryTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'events', label: 'Events' },
  { id: 'restaurants', label: 'Restaurants' },
  { id: 'tours', label: 'Experiences' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'deals', label: 'Deals' },
]

const catalog = useCatalogStore()
const loading = ref(true)
const activeTab = ref<DiscoveryTab>('all')
const searchQuery = ref('')

const events = ref<DiscoveryItem[]>([])
const restaurants = ref<DiscoveryItem[]>([])
const tours = ref<DiscoveryItem[]>([])
const hotels = ref<PartnerHotelCard[]>([])
const deals = ref<CommerceProduct[]>([])

const DiscoveryItemBody = defineComponent({
  props: { item: { type: Object as () => DiscoveryItem, required: true } },
  setup(props) {
    return () => {
      const item = props.item
      const tag = item.subcategory ? subcategoryLabel(item.section, item.subcategory) : ''
      const link = item.ticket_url || item.website || (item.phone ? `tel:${item.phone.replace(/\s/g, '')}` : '')
      const meta = [item.venue, item.location, item.distance ? `${item.distance} from hotel` : '', item.price_hint]
        .filter(Boolean)
        .slice(0, 3)
        .join(' · ')

      return h('div', { class: 'hp-discovery-item-inner' }, [
        h('div', { class: 'hp-discovery-item-media' }, [
          item.image_url
            ? h('img', { src: item.image_url, alt: item.name, loading: 'lazy' })
            : h('div', { class: 'hp-discovery-item-placeholder' }, item.name.charAt(0)),
          tag ? h('span', { class: 'hp-discovery-item-tag' }, tag) : null,
        ]),
        h('div', { class: 'hp-discovery-item-body' }, [
          h('h3', item.name),
          meta ? h('p', { class: 'hp-discovery-item-meta' }, meta) : null,
          link
            ? h(
                'a',
                {
                  class: 'hp-discovery-item-action',
                  href: link,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
                'View details →',
              )
            : null,
        ]),
      ])
    }
  },
})

function hotelPortalPath(slug: string) {
  return `/hotel/${slug}?ref=${encodeURIComponent(catalogConfig.hotelCode)}`
}

function showSection(section: DiscoveryTab) {
  return activeTab.value === 'all' || activeTab.value === section
}

function matchesSearch(text: string) {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return true
  return text.toLowerCase().includes(q)
}

function filterDiscoveryItems(items: DiscoveryItem[]) {
  return items.filter((item) =>
    matchesSearch([item.name, item.description, item.venue, item.location, item.subcategory].join(' ')),
  )
}

const filteredEvents = computed(() => filterDiscoveryItems(events.value))
const filteredRestaurants = computed(() => filterDiscoveryItems(restaurants.value))
const filteredTours = computed(() => filterDiscoveryItems(tours.value))
const filteredHotels = computed(() =>
  hotels.value.filter((h) => matchesSearch(`${h.name} ${h.location}`)),
)
const filteredDeals = computed(() =>
  deals.value.filter((p) => matchesSearch(`${p.name} ${p.description ?? ''}`)),
)

const hasVisibleResults = computed(() => {
  if (activeTab.value === 'events') return filteredEvents.value.length > 0
  if (activeTab.value === 'restaurants') return filteredRestaurants.value.length > 0
  if (activeTab.value === 'tours') return filteredTours.value.length > 0
  if (activeTab.value === 'hotels') return filteredHotels.value.length > 0
  if (activeTab.value === 'deals') return filteredDeals.value.length > 0
  return (
    filteredEvents.value.length +
      filteredRestaurants.value.length +
      filteredTours.value.length +
      filteredHotels.value.length +
      filteredDeals.value.length >
    0
  )
})

onMounted(async () => {
  try {
    await catalog.load()
    const [portal, landing] = await Promise.all([
      fetchDiscoveryPortal(catalogConfig.hotelSlug),
      fetchPartnersLanding(catalogConfig.hotelSlug),
    ])
    events.value = portal.events ?? []
    restaurants.value = portal.restaurants ?? []
    tours.value = portal.tours ?? []
    hotels.value = landing.partner_hotels ?? []
    deals.value = catalog.featuredProducts.slice(0, 8)
  } catch {
    deals.value = catalog.featuredProducts.slice(0, 8)
  } finally {
    loading.value = false
  }
})
</script>
