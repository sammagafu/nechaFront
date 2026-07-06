<template>
  <div v-if="session.hotel">
    <StorefrontPageHero
      badge="Discover Tanzania"
      title="Explore around your stay"
      :description="`Restaurants, activities, tours and hotel services curated for guests at ${session.hotel.name}.`"
    />

    <p v-if="loading" class="discover-loading">Loading discover listings…</p>
    <p v-else-if="loadError" class="discover-error">{{ loadError }}</p>

    <section v-for="section in sections" :key="section.id" class="discover-section">
      <div class="sf-section-head">
        <div>
          <h2>{{ section.title }}</h2>
          <p class="discover-section-desc">{{ section.description }}</p>
        </div>
        <router-link v-if="section.items.length" :to="`${basePath}/discover/${section.id}`">See more →</router-link>
      </div>
      <div v-if="section.items.length" class="sf-product-grid sf-product-grid--cols-3">
        <article v-for="item in section.items.slice(0, 3)" :key="item.slug || item.name" class="sf-product-card">
          <div class="sf-product-body">
            <p class="sf-brand">{{ item.tag }}</p>
            <h3 class="sf-product-name">
              <router-link v-if="item.slug" :to="`/discovery/${item.slug}`">{{ item.name }}</router-link>
              <span v-else>{{ item.name }}</span>
            </h3>
            <p class="sf-product-desc">{{ item.description }}</p>
          </div>
        </article>
      </div>
      <p v-else class="category-empty">Listings coming soon for this section.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import StorefrontPageHero from '@/components/storefront/StorefrontPageHero.vue'
import { fetchDiscoveryPortal } from '@/api/discovery'
import { getApiError } from '@/api/client'
import { useHotelSessionStore } from '@/stores/hotelSession'
import type { DiscoveryItem, DiscoveryPortal } from '@/types/discovery'

const session = useHotelSessionStore()
const basePath = computed(() => `/hotel/${session.slug}`)
const portal = ref<DiscoveryPortal | null>(null)
const loading = ref(true)
const loadError = ref('')

function mapItem(item: DiscoveryItem) {
  return {
    tag: item.subcategory || item.section,
    name: item.name,
    description: item.description,
    slug: item.slug,
  }
}

const sections = computed(() => {
  const hotelServices = (session.hotel?.services ?? []).map((svc) => ({
    tag: 'Hotel service',
    name: svc.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Available at ${session.hotel?.name ?? 'your hotel'}.`,
    slug: '',
  }))

  return [
  {
    id: 'restaurants',
    title: 'Restaurant',
    description: 'Recommended restaurants near your hotel — browse and visit at your own pace.',
    items: (portal.value?.restaurants ?? []).map(mapItem),
  },
  {
    id: 'activities-events',
    title: 'Activities & Events',
    description: 'Ticketed events you can book and pay on Necha, plus free listings to discover.',
    items: (portal.value?.events ?? []).map(mapItem),
  },
  {
    id: 'local-tours',
    title: 'Local Tours & Experiences',
    description: 'Tours fulfilled by partner operators — book and pay on Necha.',
    items: (portal.value?.tours ?? []).map(mapItem),
  },
  {
    id: 'hotel-services',
    title: 'Your Hotel Services',
    description: 'Optional in-hotel services from your property, or external suppliers where the hotel has no facility.',
    items: hotelServices,
  },
]})

onMounted(async () => {
  if (!session.slug) {
    loading.value = false
    return
  }
  try {
    portal.value = await fetchDiscoveryPortal(session.slug)
  } catch (e) {
    loadError.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.discover-section {
  margin-bottom: 2rem;
}

.discover-section-desc {
  margin: 0.35rem 0 0;
  font-size: 13px;
  color: var(--sf-muted);
  max-width: 42rem;
}

.discover-loading,
.discover-error {
  font-size: 13px;
  color: var(--sf-muted);
  margin-bottom: 1rem;
}

.discover-error {
  color: #c00;
}
</style>
