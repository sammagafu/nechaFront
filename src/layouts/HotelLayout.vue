<template>
  <HotelLoadingScreen v-if="session.loading" />
  <div v-else-if="session.hotel" class="storefront-page">
    <div class="hotel-top-bar sf-reveal">
      <div class="sf-container hotel-top-bar-inner">
        <router-link to="/" class="hotel-top-bar-logo" aria-label="Necha Africa home">
          <NechaLogo alt="Necha Africa" on-dark :width="96" :height="24" />
        </router-link>
        <span class="hotel-top-bar-name">{{ session.hotel.name }} · {{ session.hotel.location }}</span>
        <span class="qr-pulse">
          <span class="qr-dot" aria-hidden="true" />
          In-room QR
        </span>
      </div>
    </div>

    <header class="storefront-nav sf-reveal sf-reveal-1">
      <div class="sf-container storefront-nav-inner">
        <router-link to="/" class="sf-logo" aria-label="Necha Africa home">
          <NechaLogo alt="Necha Africa" class="sf-logo-img" :width="120" :height="30" />
        </router-link>

        <div class="sf-nav-scroll-wrap">
          <nav class="sf-nav-links" aria-label="Hotel storefront">
            <div class="sf-nav-group">
              <router-link
                :to="basePath"
                :class="{ 'router-link-active': route.name === 'hotel-storefront' }"
                @click="closeNav"
              >
                Hotel
              </router-link>
              <router-link :to="`${basePath}/shop`" @click="closeNav">Shop</router-link>
              <router-link :to="`${basePath}/food`" @click="closeNav">Food</router-link>
              <router-link v-if="hasService('spa')" :to="`${basePath}/spa`" @click="closeNav">Wellness</router-link>
              <router-link v-if="hasService('gym')" :to="`${basePath}/gym`" @click="closeNav">Gym</router-link>
              <router-link v-if="hasService('restaurant')" :to="`${basePath}/restaurant`" @click="closeNav">Dining</router-link>
              <router-link v-if="hasService('bar')" :to="`${basePath}/bar`" @click="closeNav">Bar</router-link>
            </div>
          </nav>
        </div>

        <router-link
          :to="`${basePath}/checkout`"
          class="sf-cart-btn"
          :class="{ 'sf-cart-btn--pulse': cartPulse > 0 }"
          :key="cartPulse"
        >
          <span class="sf-cart-label">Cart</span>
          <span class="sf-cart-count">{{ cart.count }}</span>
        </router-link>
      </div>
    </header>

    <main class="sf-main">
      <div class="sf-storefront-panel">
        <router-view v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
    </main>

    <StorefrontFooter />
    <StickyCartBar :hotel-slug="session.slug" />
    <CartToast />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHotelSessionStore } from '@/stores/hotelSession'
import { useCartStore } from '@/stores/cart'
import { hotelCartScope } from '@/utils/cartScope'
import StorefrontFooter from '@/components/storefront/StorefrontFooter.vue'
import StickyCartBar from '@/components/storefront/StickyCartBar.vue'
import CartToast from '@/components/storefront/CartToast.vue'
import NechaLogo from '@/components/NechaLogo.vue'
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

function closeNav() {
  /* scroll snap reset — no mobile drawer needed */
}

async function init() {
  const slug = route.params.slug as string
  const ref = (route.query.ref as string) || undefined
  try {
    cart.setScope(hotelCartScope(slug))
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
