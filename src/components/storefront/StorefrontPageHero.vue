<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import { useHotelSessionStore } from '@/stores/hotelSession'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    badge?: string
    crumbLabel?: string
    /** Defaults to hotel home (`/hotel/:slug`). */
    crumbTo?: string
    showCrumb?: boolean
    crumbLink?: boolean
  }>(),
  {
    showCrumb: true,
    crumbLink: true,
  },
)

const session = useHotelSessionStore()
const discoverPath = computed(() => `/hotel/${session.slug}`)
const crumbText = computed(() => props.crumbLabel ?? session.hotel?.name ?? '')
const crumbHref = computed(() => props.crumbTo ?? discoverPath.value)
</script>

<template>
  <div class="sf-page-hero discover-hero">
    <div class="discover-hero-glow" aria-hidden="true" />
    <div class="discover-hero-inner">
      <router-link
        v-if="showCrumb && crumbLink && crumbText"
        :to="crumbHref"
        class="discover-hero-crumb"
      >
        <Icon name="map-pin" :size="14" />
        {{ crumbText }}
      </router-link>
      <span v-else-if="showCrumb && crumbText" class="discover-hero-crumb discover-hero-crumb--static">
        <Icon name="map-pin" :size="14" />
        {{ crumbText }}
      </span>
      <span v-if="badge" class="discover-hero-badge">{{ badge }}</span>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>
