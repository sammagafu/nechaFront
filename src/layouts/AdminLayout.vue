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
        to="/admin"
        class="admin-brand"
        active-class=""
        exact-active-class=""
        @click="navOpen = false"
      >
        <NechaLogo :alt="adminBrand.name" class="admin-brand-logo" :width="120" :height="32" on-dark />
        <span class="admin-brand-kicker">{{ adminBrand.console }}</span>
        <span class="admin-brand-tagline">{{ adminBrand.sidebarTagline }}</span>
      </router-link>

      <nav class="admin-nav" aria-label="Admin navigation">
        <p class="admin-nav-label">Overview</p>
        <router-link
          to="/admin"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin', { exact: true }) }"
          @click="navOpen = false"
        >
          Dashboard
        </router-link>
        <router-link
          to="/admin/analytics"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin/analytics') }"
          @click="navOpen = false"
        >
          Analytics
        </router-link>
        <router-link
          to="/admin/store"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin/store') }"
          @click="navOpen = false"
        >
          Store owner
        </router-link>

        <p class="admin-nav-label">Commerce</p>
        <router-link
          to="/admin/orders"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin/orders') || navActive('/admin/reservations') }"
          @click="navOpen = false"
        >
          Orders &amp; bookings
        </router-link>
        <router-link
          to="/admin/guest-stays"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin/guest-stays', { exact: true }) }"
          @click="navOpen = false"
        >
          Guest stays
        </router-link>

        <p class="admin-nav-label">Partners</p>
        <router-link
          to="/admin/hotels"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin/hotels') }"
          @click="navOpen = false"
        >
          Hotels
        </router-link>
        <router-link
          to="/admin/import"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin/import') }"
          @click="navOpen = false"
        >
          CSV import
        </router-link>
        <router-link
          to="/admin/discovery"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin/discovery') }"
          @click="navOpen = false"
        >
          Discovery Portal
        </router-link>

        <p class="admin-nav-label">Engagement</p>
        <router-link
          to="/admin/chat"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin/chat') }"
          @click="navOpen = false"
        >
          Messages
        </router-link>
        <router-link
          to="/admin/alerts"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin/alerts', { exact: true }) }"
          @click="navOpen = false"
        >
          Alerts
        </router-link>
        <router-link
          to="/admin/webhooks"
          active-class=""
          exact-active-class=""
          :class="{ 'router-link-active': navActive('/admin/webhooks', { exact: true }) }"
          @click="navOpen = false"
        >
          Webhooks
        </router-link>

        <p class="admin-nav-label">Site</p>
        <router-link to="/" class="admin-nav-external" target="_blank" rel="noopener" @click="navOpen = false">
          View necha.africa
        </router-link>
        <router-link to="/shop" class="admin-nav-external" target="_blank" rel="noopener" @click="navOpen = false">
          Shop
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
        <div class="admin-topbar-actions">
          <NotificationBell />
          <slot name="actions" />
        </div>
      </header>
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NechaLogo from '@/components/NechaLogo.vue'
import NotificationBell from '@/components/NotificationBell.vue'
import { adminBrand } from '@/config/admin'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const navOpen = ref(false)

const titles: Record<string, string> = {
  'admin-dashboard': 'Dashboard',
  'admin-analytics': 'Analytics',
  'admin-store': 'Store owner',
  'admin-store-hotel': 'Store owner',
  'admin-hotels': 'Partner hotels',
  'admin-hotel-new': 'Add hotel',
  'admin-hotel-edit': 'Edit hotel',
  'admin-products': 'Storefront products',
  'admin-product-new': 'Add product',
  'admin-product-edit': 'Edit product',
  'admin-orders': 'Orders & bookings',
  'admin-order-detail': 'Order detail',
  'admin-guest-stays': 'Guest stays',
  'admin-reservations': 'Orders & bookings',
  'admin-reservation-detail': 'Booking detail',
  'admin-discovery': 'Discovery Portal',
  'admin-discovery-new': 'New listing',
  'admin-discovery-edit': 'Edit listing',
  'admin-chat': 'Messages',
  'admin-chat-detail': 'Messages',
  'admin-alerts': 'System alerts',
  'admin-hotel-import': 'CSV import',
  'admin-webhooks': 'Webhooks',
}

function navActive(path: string, options?: { exact?: boolean }) {
  const current = route.path
  if (options?.exact) {
    return current === path || current === `${path}/`
  }
  return current === path || current.startsWith(`${path}/`)
}

const title = computed(() => titles[String(route.name)] || adminBrand.console)

watch(
  () => route.fullPath,
  () => {
    navOpen.value = false
  },
)

function logout() {
  auth.logout()
  router.push('/admin/login')
}
</script>
