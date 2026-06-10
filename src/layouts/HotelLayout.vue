<template>
  <HotelLoadingScreen v-if="session.loading" />
  <div v-else-if="session.hotel" class="storefront-page">
    <div class="hotel-top-bar sf-reveal">
      <span>{{ session.hotel.name }} · {{ session.hotel.location }}, Dar es Salaam</span>
      <span class="qr-pulse">
        <span class="qr-dot" aria-hidden="true" />
        Scanned from in-room QR code
      </span>
    </div>

    <div class="storefront-nav sf-reveal sf-reveal-1">
      <router-link to="/" class="sf-logo">NECHA<span>AFRICA</span></router-link>
      <nav class="sf-nav-links">
        <router-link :to="`${basePath}/shop`">Shop</router-link>
        <router-link :to="`${basePath}/food`">Food</router-link>
        <router-link v-if="hasService('spa')" :to="`${basePath}/spa`">Wellness</router-link>
        <router-link v-if="hasService('gym')" :to="`${basePath}/gym`">Gym</router-link>
        <router-link v-if="hasService('restaurant')" :to="`${basePath}/restaurant`">Dining</router-link>
        <router-link v-if="hasService('bar')" :to="`${basePath}/bar`">Bar</router-link>
        <router-link v-if="hasService('nearby')" :to="`${basePath}/nearby`">Nearby</router-link>
      </nav>
      <router-link
        :to="`${basePath}/checkout`"
        class="sf-cart-btn"
        :class="{ 'sf-cart-btn--pulse': cartPulse > 0 }"
        :key="cartPulse"
      >
        Cart · {{ cart.count }} {{ cart.count === 1 ? 'item' : 'items' }}
      </router-link>
    </div>

    <router-view v-slot="{ Component }">
      <Transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>

    <StickyCartBar :hotel-slug="session.slug" />
    <CartToast />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHotelSessionStore } from '@/stores/hotelSession'
import { useCartStore } from '@/stores/cart'
import StickyCartBar from '@/components/storefront/StickyCartBar.vue'
import CartToast from '@/components/storefront/CartToast.vue'
import HotelLoadingScreen from '@/components/storefront/HotelLoadingScreen.vue'

const route = useRoute()
const router = useRouter()
const session = useHotelSessionStore()
const cart = useCartStore()

const basePath = computed(() => `/hotel/${session.slug}`)
const cartPulse = computed(() => cart.cartPulse)

function hasService(name: string) {
  return session.hotel?.services?.includes(name) ?? false
}

async function init() {
  const slug = route.params.slug as string
  const ref = (route.query.ref as string) || undefined
  try {
    await session.load(slug, ref)
  } catch {
    router.replace({ path: '/', query: { hotelError: '1' } })
  }
}

watch(() => route.params.slug, init, { immediate: true })
</script>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
