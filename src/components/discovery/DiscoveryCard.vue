<template>
  <article class="discovery-card">
    <div class="discovery-card-media">
      <img v-if="item.image_url" :src="item.image_url" :alt="item.name" loading="lazy" />
      <div v-else class="discovery-card-placeholder" aria-hidden="true">
        <span>{{ placeholderInitial }}</span>
      </div>
      <span v-if="item.is_featured" class="discovery-badge">Featured</span>
      <span v-if="subcategoryLabel" class="discovery-cat">{{ subcategoryLabel }}</span>
    </div>
    <div class="discovery-card-body">
      <h3>{{ item.name }}</h3>
      <p class="discovery-desc">{{ item.description }}</p>
      <ul class="discovery-meta">
        <li v-if="item.venue">{{ item.venue }}</li>
        <li v-if="item.location">{{ item.location }}</li>
        <li v-if="item.distance">{{ item.distance }} from hotel</li>
        <li v-if="eventWhen">{{ eventWhen }}</li>
        <li v-if="item.price_hint">{{ item.price_hint }}</li>
      </ul>
      <div class="discovery-actions">
        <a
          v-if="item.ticket_url"
          :href="item.ticket_url"
          class="discovery-btn discovery-btn--primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ ticketCta }}
        </a>
        <a v-else-if="item.phone" :href="`tel:${item.phone.replace(/\s/g, '')}`" class="discovery-btn discovery-btn--primary">
          Call to book
        </a>
        <a
          v-else-if="item.website"
          :href="item.website"
          class="discovery-btn discovery-btn--primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
        <a
          v-if="item.website && item.ticket_url"
          :href="item.website"
          class="discovery-btn discovery-btn--ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          Website
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { subcategoryLabel as labelFor } from '@/config/discovery'
import type { DiscoveryItem } from '@/types/discovery'

const props = defineProps<{
  item: DiscoveryItem
}>()

const subcategoryLabel = computed(() =>
  props.item.subcategory ? labelFor(props.item.section, props.item.subcategory) : '',
)

const placeholderInitial = computed(() => props.item.name.charAt(0).toUpperCase())

const eventWhen = computed(() => {
  if (!props.item.event_starts_at) return ''
  const start = new Date(props.item.event_starts_at)
  const fmt: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
  return start.toLocaleString('en-GB', fmt)
})

const ticketCta = computed(() => {
  if (props.item.ticket_mode === 'platform') return 'Get tickets'
  if (props.item.ticket_mode === 'referral') return 'View tickets'
  return 'Book now'
})
</script>

<style scoped>
.discovery-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--sf-warm-grey, #e8e6e0);
  border-radius: 16px;
  overflow: hidden;
  background: var(--sf-white, #fff);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.discovery-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.discovery-card-media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--sf-cream, #f5f3ee);
  overflow: hidden;
}

.discovery-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discovery-card-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-display, Georgia, serif);
  font-size: 2.5rem;
  color: var(--sf-muted, #888780);
  background: linear-gradient(135deg, #f0ede6, #e8e4db);
}

.discovery-badge,
.discovery-cat {
  position: absolute;
  top: 10px;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.discovery-badge {
  left: 10px;
  background: var(--sf-charcoal, #1a1a1a);
  color: #fff;
}

.discovery-cat {
  right: 10px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--sf-charcoal, #1a1a1a);
}

.discovery-card-body {
  padding: 1rem 1.1rem 1.15rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.discovery-card-body h3 {
  margin: 0 0 0.4rem;
  font-family: var(--font-display, Georgia, serif);
  font-size: 1.15rem;
  font-weight: 500;
  line-height: 1.25;
}

.discovery-desc {
  margin: 0 0 0.65rem;
  font-size: 12px;
  line-height: 1.55;
  color: var(--sf-muted, #888780);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.discovery-meta {
  margin: 0 0 0.85rem;
  padding: 0;
  list-style: none;
  font-size: 11px;
  color: var(--sf-charcoal, #1a1a1a);
  display: grid;
  gap: 0.2rem;
}

.discovery-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.discovery-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
}

.discovery-btn--primary {
  background: var(--sf-charcoal, #1a1a1a);
  color: #fff;
}

.discovery-btn--primary:hover {
  background: var(--sf-green-dark, #5a8f2a);
}

.discovery-btn--ghost {
  background: transparent;
  color: var(--sf-charcoal, #1a1a1a);
  border: 1px solid var(--sf-warm-grey, #e8e6e0);
}
</style>
