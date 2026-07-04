<template>
  <div class="discovery-page discovery-detail-page">
    <p v-if="loading" class="discovery-page-status section-inner">Loading…</p>
    <p v-else-if="error" class="discovery-page-status section-inner">{{ error }}</p>

    <template v-else-if="item">
      <nav class="discovery-detail-breadcrumb section-inner">
        <router-link to="/discovery" class="text-link">Discovery</router-link>
        <span aria-hidden="true">/</span>
        <span>{{ item.name }}</span>
      </nav>

      <header class="discovery-detail-hero">
        <div v-if="item.image_url" class="discovery-detail-hero-media">
          <img :src="item.image_url" :alt="item.name" />
        </div>
        <div v-else class="discovery-detail-hero-placeholder">{{ item.name.charAt(0) }}</div>
        <div class="discovery-detail-hero-overlay section-inner">
          <div class="discovery-detail-badges">
            <span class="discovery-detail-badge">{{ sectionTitle }}</span>
            <span v-if="subcategoryTitle" class="discovery-detail-badge discovery-detail-badge--soft">{{ subcategoryTitle }}</span>
            <span v-if="item.is_featured" class="discovery-detail-badge discovery-detail-badge--featured">Featured</span>
          </div>
          <h1 class="discovery-detail-title">{{ item.name }}</h1>
          <p v-if="heroMeta" class="discovery-detail-lead">{{ heroMeta }}</p>
        </div>
      </header>

      <div class="section-inner discovery-detail-body">
        <div class="discovery-detail-layout">
          <section class="discovery-detail-main">
            <h2 class="discovery-detail-section-title">About</h2>
            <p class="discovery-detail-description">{{ item.description }}</p>
          </section>

          <aside class="discovery-detail-aside">
            <div class="discovery-detail-card">
              <h2 class="discovery-detail-section-title">Details</h2>
              <dl class="discovery-detail-facts">
                <div v-if="item.venue">
                  <dt>Venue</dt>
                  <dd>{{ item.venue }}</dd>
                </div>
                <div v-if="item.location">
                  <dt>Location</dt>
                  <dd>{{ item.location }}</dd>
                </div>
                <div v-if="item.distance">
                  <dt>Distance</dt>
                  <dd>{{ item.distance }} from hotel</dd>
                </div>
                <div v-if="eventWhen">
                  <dt>When</dt>
                  <dd>{{ eventWhen }}</dd>
                </div>
                <div v-if="item.price_hint">
                  <dt>Price</dt>
                  <dd>{{ item.price_hint }}</dd>
                </div>
                <div v-if="item.organizer_name">
                  <dt>Organizer</dt>
                  <dd>{{ item.organizer_name }}</dd>
                </div>
                <div v-if="item.phone">
                  <dt>Phone</dt>
                  <dd>
                    <a :href="`tel:${item.phone.replace(/\s/g, '')}`" class="text-link">{{ item.phone }}</a>
                  </dd>
                </div>
              </dl>

              <div class="discovery-detail-actions">
                <a
                  v-if="item.ticket_url"
                  :href="item.ticket_url"
                  class="btn btn-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ ticketCta }}
                </a>
                <a
                  v-else-if="item.phone"
                  :href="`tel:${item.phone.replace(/\s/g, '')}`"
                  class="btn btn-lg"
                >
                  Call to book
                </a>
                <a
                  v-if="item.website"
                  :href="item.website"
                  class="btn btn-outline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit website
                </a>
              </div>
            </div>

            <router-link :to="backLink" class="discovery-detail-back">← Back to Discovery</router-link>
          </aside>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchDiscoveryItem } from '@/api/discovery'
import { getApiError } from '@/api/client'
import { sectionLabel, subcategoryLabel, type DiscoverySectionId } from '@/config/discovery'
import type { DiscoveryItem } from '@/types/discovery'
import '@/assets/discovery-page.css'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const item = ref<DiscoveryItem | null>(null)

const sectionTitle = computed(() =>
  item.value ? sectionLabel(item.value.section as DiscoverySectionId) : '',
)

const subcategoryTitle = computed(() =>
  item.value?.subcategory
    ? subcategoryLabel(item.value.section as DiscoverySectionId, item.value.subcategory)
    : '',
)

const heroMeta = computed(() => {
  if (!item.value) return ''
  return [item.value.venue, item.value.location, item.value.distance ? `${item.value.distance} from hotel` : '']
    .filter(Boolean)
    .join(' · ')
})

const eventWhen = computed(() => {
  if (!item.value?.event_starts_at) return ''
  const start = new Date(item.value.event_starts_at)
  const fmt: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }
  let text = start.toLocaleString('en-GB', fmt)
  if (item.value.event_ends_at) {
    const end = new Date(item.value.event_ends_at)
    text += ` – ${end.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
  }
  return text
})

const ticketCta = computed(() => {
  if (!item.value?.ticket_url) return 'Book now'
  if (item.value.ticket_mode === 'platform') return 'Get tickets'
  if (item.value.ticket_mode === 'referral') return 'View tickets'
  return 'Book now'
})

const backLink = computed(() => {
  const section = item.value?.section
  return section ? { path: '/discovery', hash: `#${section}` } : '/discovery'
})

async function load(slug: string) {
  loading.value = true
  error.value = ''
  item.value = null
  try {
    item.value = await fetchDiscoveryItem(slug)
  } catch (err) {
    error.value = getApiError(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void load(String(route.params.slug))
})

watch(
  () => route.params.slug,
  (slug) => {
    if (route.name === 'discovery-detail' && slug) void load(String(slug))
  },
)
</script>
