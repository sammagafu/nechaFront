<template>
  <div>
    <StorefrontPageHero
      badge="Discovery"
      title="Nearby experiences"
      :description="`Curated restaurants, wellness spots and leisure experiences near ${session.hotel?.name}, ${session.hotel?.location}`"
    />
    <div class="category-pills" style="padding-top: 16px">
      <button
        v-for="cat in filters"
        :key="cat.id"
        type="button"
        class="category-pill"
        :class="{ active: activeFilter === cat.id }"
        @click="activeFilter = cat.id"
      >
        {{ cat.label }}
      </button>
    </div>
    <div class="sf-product-grid" style="padding-bottom: 24px">
      <article v-for="exp in filtered" :key="exp.name" class="sf-product-card">
        <div class="sf-product-image" style="aspect-ratio: 16/9">
          <span class="sf-badge african_brand" style="text-transform: uppercase">{{ exp.category }}</span>
        </div>
        <div class="sf-product-body">
          <p class="sf-brand">{{ exp.category }}</p>
          <h3 class="sf-product-name">{{ exp.name }}</h3>
          <p class="sf-product-desc">{{ exp.description }}</p>
          <p style="font-size: 10px; color: var(--sf-muted); margin: 6px 0">{{ exp.distance }} from {{ session.hotel?.name }}</p>
          <a v-if="exp.phone" :href="`tel:${exp.phone}`" style="font-size: 11px; color: var(--sf-purple)">Call to book</a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import StorefrontPageHero from '@/components/storefront/StorefrontPageHero.vue'
import { useHotelSessionStore } from '@/stores/hotelSession'

const session = useHotelSessionStore()
const activeFilter = ref('all')

const filters = [
  { id: 'all', label: 'All' },
  { id: 'dining', label: 'Dining' },
  { id: 'wellness', label: 'Wellness & Spa' },
  { id: 'beach', label: 'Beach & Leisure' },
  { id: 'nightlife', label: 'Nightlife' },
]

const experiences = [
  { name: 'The Rock Restaurant', category: 'Dining', type: 'dining', description: 'Iconic seafood restaurant perched on a rock off the Masaki shore', distance: '1.2km', phone: '+255712000001' },
  { name: 'Kivulini Spa', category: 'Wellness', type: 'wellness', description: 'Holistic spa treatments with African botanicals and ocean views', distance: '0.8km', phone: '+255712000002' },
  { name: 'Oysterbay Beach Club', category: 'Beach', type: 'beach', description: 'Sunset cocktails and loungers on the Oysterbay waterfront', distance: '1.5km' },
  { name: 'Jahazi Lounge', category: 'Nightlife', type: 'nightlife', description: 'Live music and craft cocktails in a relaxed Masaki setting', distance: '0.6km', phone: '+255712000003' },
]

const filtered = computed(() => {
  if (activeFilter.value === 'all') return experiences
  return experiences.filter((e) => e.type === activeFilter.value)
})
</script>
