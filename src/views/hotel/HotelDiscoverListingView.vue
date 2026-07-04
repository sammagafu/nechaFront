<template>
  <div v-if="session.hotel && sectionMeta">
    <StorefrontPageHero
      badge="Discover Tanzania"
      :title="sectionMeta.title"
      :description="sectionMeta.description"
    />
    <p v-if="loading" class="discover-loading">Loading…</p>
    <div v-else class="sf-product-grid sf-product-grid--cols-3" style="padding-bottom: 24px">
      <article v-for="item in sectionMeta.items" :key="item.slug || item.name" class="sf-product-card">
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
    <p v-if="!loading && !sectionMeta.items.length" class="category-empty">No listings in this section yet.</p>
    <router-link :to="`${basePath}/discover`" class="discover-back">← Back to Discover</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import StorefrontPageHero from '@/components/storefront/StorefrontPageHero.vue'
import { fetchDiscoveryPortal } from '@/api/discovery'
import { useHotelSessionStore } from '@/stores/hotelSession'
import type { DiscoveryItem, DiscoveryPortal } from '@/types/discovery'

const route = useRoute()
const session = useHotelSessionStore()
const basePath = computed(() => `/hotel/${session.slug}`)
const portal = ref<DiscoveryPortal | null>(null)
const loading = ref(true)

const sectionCatalog: Record<string, { title: string; description: string; key: keyof DiscoveryPortal | null }> = {
  restaurants: {
    title: 'Restaurant',
    description: 'Recommended restaurants near your hotel.',
    key: 'restaurants',
  },
  'activities-events': {
    title: 'Activities & Events',
    description: 'All activities and events for this hotel area.',
    key: 'events',
  },
  'local-tours': {
    title: 'Local Tours & Experiences',
    description: 'All bookable tours and experiences.',
    key: 'tours',
  },
  'hotel-services': {
    title: 'Your Hotel Services',
    description: 'In-hotel and external services available to you.',
    key: null,
  },
}

function mapItem(item: DiscoveryItem) {
  return {
    tag: item.subcategory || item.section,
    name: item.name,
    description: item.description,
    slug: item.slug,
  }
}

const sectionMeta = computed(() => {
  const id = route.params.section as string
  const meta = sectionCatalog[id]
  if (!meta) return null
  const items =
    meta.key && portal.value
      ? (portal.value[meta.key] ?? []).map(mapItem)
      : []
  return { title: meta.title, description: meta.description, items }
})

onMounted(async () => {
  if (!session.slug) {
    loading.value = false
    return
  }
  try {
    portal.value = await fetchDiscoveryPortal(session.slug)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.discover-back {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 13px;
  font-weight: 600;
  color: var(--sf-purple);
}

.discover-loading {
  font-size: 13px;
  color: var(--sf-muted);
  margin-bottom: 1rem;
}
</style>
