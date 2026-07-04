<script setup lang="ts">
import { computed } from 'vue'
import NechaLogo from '@/components/NechaLogo.vue'
import HotelBrandMark from '@/components/HotelBrandMark.vue'
import { useHotelSessionStore } from '@/stores/hotelSession'

const session = useHotelSessionStore()
const hotel = computed(() => session.hotel)
</script>

<template>
  <footer class="sf-footer">
    <div class="sf-container sf-footer-inner">
      <div v-if="hotel" class="sf-footer-cobrand">
        <HotelBrandMark
          :name="hotel.name"
          :initials="hotel.initials"
          :logo-url="hotel.logo_url"
          size="sm"
        />
        <p class="sf-footer-hotel">{{ hotel.name }}</p>
      </div>
      <router-link to="/" class="sf-footer-logo" aria-label="Necha Africa home">
        <NechaLogo alt="Necha Africa" :width="112" :height="28" />
      </router-link>
      <p class="sf-footer-tagline">
        <template v-if="hotel">
          Room delivery and guest services for {{ hotel.name }} — powered by Necha Africa.
        </template>
        <template v-else>
          Personal care, beauty &amp; wellness — powered by Necha Africa.
        </template>
      </p>
    </div>
  </footer>
</template>
