<template>
  <section id="discovery-sec" class="hp-section hp-section--soft">
    <div class="section-inner">
      <div class="hp-discovery-split">
        <aside class="hp-discovery-aside">
          <div v-if="headerImage" class="hp-discovery-visual">
            <img :src="headerImage" alt="Discover Dar es Salaam from your hotel room" loading="lazy" />
          </div>
          <header class="hp-head-row" style="margin-bottom: 1rem">
            <div>
              <p class="eyebrow">Discovery Portal</p>
              <h2 class="hp-title">
                Help guests explore Dar — <em style="font-style: italic; color: var(--color-muted)">from their room</em>
              </h2>
              <p class="hp-lead">
                Events, dining, tours and experiences curated for hotel guests — co-branded under your property.
              </p>
            </div>
          </header>
          <div class="hp-discovery-tabs" role="tablist" aria-label="Discovery categories">
            <button
              v-for="section in discoverySections"
              :key="section.id"
              type="button"
              role="tab"
              class="hp-discovery-tab"
              :class="{ on: activeSection === section.id }"
              :aria-selected="activeSection === section.id"
              @click="activeSection = section.id"
            >
              {{ section.label }}
            </button>
          </div>
          <p class="hp-lead" style="margin-top: 0">{{ activeSectionMeta?.tagline }}</p>
          <router-link to="/discovery" class="btn btn-green" style="margin-top: 0.5rem">
            Explore Discovery →
          </router-link>
        </aside>

        <div class="hp-discovery-main">
          <div v-if="subcategories.length" class="hp-discovery-tabs" style="margin-bottom: 0.85rem">
            <button
              type="button"
              class="hp-discovery-tab"
              :class="{ on: !activeSubcategory }"
              @click="activeSubcategory = ''"
            >
              All
            </button>
            <button
              v-for="sub in subcategories"
              :key="sub.id"
              type="button"
              class="hp-discovery-tab"
              :class="{ on: activeSubcategory === sub.id }"
              @click="activeSubcategory = sub.id"
            >
              {{ sub.label }}
            </button>
          </div>

          <p v-if="loading" class="hp-lead">Loading experiences…</p>
          <div v-else-if="filteredItems.length" class="hp-discovery-rail" aria-label="Discovery experiences">
            <article
              v-for="item in filteredItems"
              :key="item.id"
              class="hp-discovery-item"
            >
              <div class="hp-discovery-item-media">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name" loading="lazy" />
                <div v-else class="hp-discovery-item-placeholder">{{ item.name.charAt(0) }}</div>
                <span v-if="subcategoryLabel(item)" class="hp-discovery-item-tag">{{ subcategoryLabel(item) }}</span>
              </div>
              <div class="hp-discovery-item-body">
                <h3>{{ item.name }}</h3>
                <p class="hp-discovery-item-meta">{{ itemMeta(item) }}</p>
                <a
                  v-if="itemLink(item)"
                  :href="itemLink(item)!"
                  class="hp-discovery-item-action"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ itemCta(item) }} →
                </a>
              </div>
            </article>
          </div>
          <p v-else class="hp-lead">Discovery listings will appear here once published.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { fetchDiscoveryPortal } from '@/api/discovery'
import { appConfig } from '@/config/app'
import {
  discoverySections,
  eventSubcategories,
  restaurantSubcategories,
  subcategoryLabel as labelFor,
  tourSubcategories,
  type DiscoverySectionId,
} from '@/config/discovery'
import type { DiscoveryItem } from '@/types/discovery'
import '@/assets/home-sections.css'

const props = withDefaults(
  defineProps<{
    hotelSlug?: string
    headerImage?: string
  }>(),
  {
    hotelSlug: () => appConfig.demoHotel.hotelSlug,
    headerImage: undefined,
  },
)

const loading = ref(true)
const portal = ref<{ events: DiscoveryItem[]; restaurants: DiscoveryItem[]; tours: DiscoveryItem[] } | null>(null)
const activeSection = ref<DiscoverySectionId>('events')
const activeSubcategory = ref('')

const activeSectionMeta = computed(() => discoverySections.find((s) => s.id === activeSection.value))

const subcategories = computed(() => {
  const map = {
    events: eventSubcategories,
    restaurants: restaurantSubcategories,
    tours: tourSubcategories,
  } as const
  return map[activeSection.value]
})

const sectionItems = computed(() => {
  if (!portal.value) return []
  if (activeSection.value === 'events') return portal.value.events
  if (activeSection.value === 'restaurants') return portal.value.restaurants
  return portal.value.tours
})

const filteredItems = computed(() => {
  const items = sectionItems.value
  if (!activeSubcategory.value) return items.slice(0, 10)
  return items.filter((item) => item.subcategory === activeSubcategory.value).slice(0, 10)
})

watch(activeSection, () => {
  activeSubcategory.value = ''
})

function subcategoryLabel(item: DiscoveryItem) {
  return item.subcategory ? labelFor(item.section, item.subcategory) : ''
}

function itemMeta(item: DiscoveryItem) {
  const parts = [item.venue, item.location, item.distance ? `${item.distance} from hotel` : '', item.price_hint]
    .filter(Boolean)
  if (item.event_starts_at) {
    const start = new Date(item.event_starts_at)
    parts.unshift(
      start.toLocaleString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    )
  }
  return parts.slice(0, 3).join(' · ')
}

function itemLink(item: DiscoveryItem) {
  return item.ticket_url || item.website || (item.phone ? `tel:${item.phone.replace(/\s/g, '')}` : '')
}

function itemCta(item: DiscoveryItem) {
  if (item.ticket_url) {
    if (item.ticket_mode === 'platform') return 'Get tickets'
    if (item.ticket_mode === 'referral') return 'View tickets'
    return 'Book now'
  }
  if (item.phone) return 'Call to book'
  return 'Learn more'
}

onMounted(async () => {
  try {
    portal.value = await fetchDiscoveryPortal(props.hotelSlug)
  } catch {
    portal.value = { events: [], restaurants: [], tours: [] }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.hp-discovery-aside {
  display: grid;
  gap: 1rem;
  align-content: start;
}

@media (min-width: 900px) {
  .hp-discovery-aside .hp-discovery-visual {
    display: none;
  }
}

@media (max-width: 899px) {
  .hp-discovery-visual {
    max-height: 240px;
    aspect-ratio: 16 / 9;
  }
}
</style>
