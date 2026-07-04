<template>
  <div class="admin-shell" :class="{ 'admin-shell--nav-open': navOpen }">
    <button
      v-if="navOpen"
      type="button"
      class="admin-backdrop"
      aria-label="Close navigation"
      @click="navOpen = false"
    />

    <aside class="admin-sidebar">
      <router-link
        to="/partner"
        class="admin-brand admin-brand--partner"
        active-class=""
        exact-active-class=""
        @click="navOpen = false"
      >
        <HotelBrandMark
          v-if="hotelBrand"
          :name="hotelBrand.name"
          :initials="hotelBrand.initials"
          :logo-url="hotelBrand.logo_url"
          size="lg"
          on-dark
        />
        <p v-if="hotelBrand" class="admin-brand-property">{{ hotelBrand.name }}</p>
        <span class="admin-brand-powered">Powered by</span>
        <NechaLogo alt="Necha Africa" class="admin-brand-logo" :width="96" :height="24" on-dark />
        <span class="admin-brand-kicker">Partner portal</span>
        <span class="admin-brand-tagline">{{ hotelBrand?.location || 'Your property, your storefront' }}</span>
      </router-link>

      <nav class="admin-nav" aria-label="Partner navigation">
        <p class="admin-nav-label">Overview</p>
        <router-link
          to="/partner"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/partner', { exact: true }) }"
          @click="navOpen = false"
        >
          Dashboard
        </router-link>

        <p class="admin-nav-label">Storefront</p>
        <router-link
          to="/partner/orders"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/partner/orders') }"
          @click="navOpen = false"
        >
          Orders
        </router-link>
        <router-link
          to="/partner/products"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/partner/products') }"
          @click="navOpen = false"
        >
          Products
        </router-link>

        <p class="admin-nav-label">Site</p>
        <router-link
          v-if="hotelBrand"
          :to="`/hotel/${hotelBrand.slug}`"
          class="admin-nav-external"
          target="_blank"
          rel="noopener"
          @click="navOpen = false"
        >
          View storefront
        </router-link>
        <router-link to="/" class="admin-nav-external" target="_blank" rel="noopener" @click="navOpen = false">
          View necha.africa
        </router-link>
      </nav>

      <div class="admin-sidebar-foot">
        <p>{{ auth.user?.full_name || 'Signed in' }}</p>
        <small>{{ auth.user?.email }}</small>
        <button type="button" class="admin-btn admin-btn--sidebar" @click="logout">
          Sign out
        </button>
      </div>
    </aside>

    <div class="admin-main">
      <header class="admin-topbar">
        <div class="admin-topbar-start">
          <button type="button" class="admin-menu-btn" aria-label="Toggle navigation" @click="navOpen = !navOpen">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
          <h1>{{ title }}</h1>
        </div>
      </header>
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPartnerDashboard } from '@/api/partner'
import HotelBrandMark from '@/components/HotelBrandMark.vue'
import NechaLogo from '@/components/NechaLogo.vue'
import { useAuthStore } from '@/stores/auth'
import type { AdminHotel } from '@/types/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const navOpen = ref(false)
const hotelBrand = ref<AdminHotel | null>(null)

const titles: Record<string, string> = {
  'partner-dashboard': 'Dashboard',
  'partner-orders': 'Orders',
  'partner-products': 'Products',
}

function navActive(path: string, options?: { exact?: boolean }) {
  const current = route.path
  if (options?.exact) {
    return current === path || current === `${path}/`
  }
  return current === path || current.startsWith(`${path}/`)
}

const title = computed(() => titles[String(route.name)] || 'Partner portal')

watch(
  () => route.fullPath,
  () => {
    navOpen.value = false
  },
)

function logout() {
  auth.logout()
  router.push('/partner/login')
}

onMounted(async () => {
  try {
    const dashboard = await fetchPartnerDashboard()
    hotelBrand.value = dashboard.hotel
  } catch {
    hotelBrand.value = null
  }
})
</script>

<style scoped>
.admin-brand--partner {
  gap: 0.45rem;
}

.admin-brand-property {
  margin: 0.15rem 0 0;
  font-family: var(--font-display, Georgia, serif);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.95);
}

.admin-brand-powered {
  margin-top: 0.35rem;
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}
</style>
