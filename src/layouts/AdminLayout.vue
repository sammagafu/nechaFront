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
      <div class="admin-brand">
        <strong>NECHA Admin</strong>
        <span>Platform control</span>
      </div>
      <nav class="admin-nav">
        <router-link to="/admin" @click="navOpen = false">Dashboard</router-link>
        <router-link to="/admin/hotels" @click="navOpen = false">Hotels</router-link>
        <router-link to="/admin/orders" @click="navOpen = false">Orders</router-link>
        <router-link to="/admin/reservations" @click="navOpen = false">Reservations</router-link>
        <router-link to="/about" target="_blank" rel="noopener">About page</router-link>
        <router-link to="/terms" target="_blank" rel="noopener">Terms page</router-link>
        <router-link to="/" target="_blank" rel="noopener">View site</router-link>
      </nav>
      <div class="admin-sidebar-foot">
        <p>{{ auth.user?.email }}</p>
        <button type="button" class="admin-btn admin-btn--ghost admin-btn--sidebar" @click="logout">
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
        <slot name="actions" />
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
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const navOpen = ref(false)

const titles: Record<string, string> = {
  'admin-dashboard': 'Dashboard',
  'admin-hotels': 'Hotels',
  'admin-hotel-new': 'New hotel',
  'admin-hotel-edit': 'Edit hotel',
  'admin-products': 'Products',
  'admin-product-new': 'New product',
  'admin-product-edit': 'Edit product',
  'admin-orders': 'Orders',
  'admin-reservations': 'Reservations',
}

const title = computed(() => titles[String(route.name)] || 'Admin')

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
