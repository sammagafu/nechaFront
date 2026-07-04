<template>
  <header class="site-header" :class="{ 'site-header--scrolled': scrolled, 'site-header--menu-open': menuOpen }">
    <div class="header-topbar">
      <div class="header-topbar-inner">
        <p class="topbar-promo">
          Free delivery on orders over TZS {{ formatTzs(storefrontConfig.freeDeliveryThresholdTZS) }}
          <span class="topbar-sep" aria-hidden="true">|</span>
          <a class="topbar-contact" :href="`tel:${appConfig.phone.replace(/\s/g, '')}`">Call Us: {{ appConfig.phone }}</a>
        </p>
      </div>
    </div>

    <div class="header-main">
      <div class="header-main-inner">
        <button
          type="button"
          class="header-menu-btn"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
          @click="toggleMenu"
        >
          <Icon :name="menuOpen ? 'close' : 'menu'" :size="22" />
        </button>

        <router-link to="/" class="header-logo" aria-label="Necha Africa home" @click="closeMenus">
          <NechaLogo alt="Necha Africa" class="header-logo-img" :width="120" :height="32" />
        </router-link>

        <form class="header-search" role="search" @submit.prevent="onSearch">
          <label class="sr-only" for="header-search-input">Search</label>
          <input
            id="header-search-input"
            v-model="searchQuery"
            type="search"
            placeholder="Search discovery…"
            autocomplete="off"
          />
          <button type="submit" aria-label="Search">
            <Icon name="search" :size="18" />
          </button>
        </form>

        <div class="header-utilities">
          <ThemeToggle class="header-theme-toggle" />
          <router-link :to="accountPath" class="utility-link" @click="closeMenus">
            <span class="utility-icon" aria-hidden="true">
              <Icon name="user" :size="22" />
            </span>
            <span class="utility-label">Account</span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="header-nav">
      <div class="header-nav-inner">
        <nav class="main-nav" aria-label="Primary">
          <router-link to="/" :class="{ active: route.name === 'home' }" @click="closeMenus">Home</router-link>
          <router-link to="/about" :class="{ active: route.name === 'about' }" @click="closeMenus">About</router-link>
          <router-link to="/brands" :class="{ active: route.name === 'brands' }" @click="closeMenus">Brands</router-link>
          <router-link to="/discovery" :class="{ active: isDiscoveryRoute }" @click="closeMenus">Discover Tanzania</router-link>
        </nav>
        <div class="header-nav-meta">
          <span>{{ appConfig.hours }}</span>
        </div>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="menuOpen" id="mobile-nav" class="mobile-panel">
        <form class="mobile-search" role="search" @submit.prevent="onSearch">
          <input v-model="searchQuery" type="search" placeholder="Search discovery…" aria-label="Search" />
          <button type="submit" aria-label="Search">Search</button>
        </form>
        <nav class="mobile-nav" aria-label="Mobile">
          <router-link to="/" :class="{ active: route.name === 'home' }" @click="closeMenus">Home</router-link>
          <router-link to="/about" @click="closeMenus">About</router-link>
          <router-link to="/brands" @click="closeMenus">Brands</router-link>
          <router-link to="/discovery" @click="closeMenus">Discover Tanzania</router-link>
          <router-link to="/contact" @click="closeMenus">Contact</router-link>
          <router-link to="/partner/login" @click="closeMenus">Hotel Portal</router-link>
        </nav>
      </div>
    </Transition>

    <button
      v-if="menuOpen"
      type="button"
      class="mobile-backdrop"
      aria-label="Close menu"
      @click="closeMenus"
    />
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { appConfig } from '@/config/app'
import NechaLogo from '@/components/NechaLogo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { storefrontConfig } from '@/config/storefront'
import Icon from '@/components/ui/Icon.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const scrolled = ref(false)
const menuOpen = ref(false)
const searchQuery = ref('')
let savedScrollY = 0

const isDiscoveryRoute = computed(
  () => route.name === 'discovery' || route.name === 'discovery-detail',
)
const accountPath = computed(() => (auth.isCustomer ? '/account' : '/sign-in'))

function formatTzs(n: number) {
  return n.toLocaleString('en-US')
}

function onScroll() {
  scrolled.value = window.scrollY > 12
}

function setBodyScroll(locked: boolean) {
  const html = document.documentElement
  if (locked) {
    savedScrollY = window.scrollY
    html.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    return
  }
  html.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  document.body.style.overflow = ''
  window.scrollTo(0, savedScrollY)
}

function closeMenus() {
  menuOpen.value = false
  setBodyScroll(false)
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  setBodyScroll(menuOpen.value)
}

function onSearch() {
  closeMenus()
  router.push({
    path: '/discovery',
    query: searchQuery.value ? { q: searchQuery.value } : {},
  })
}

watch(
  () => route.fullPath,
  () => closeMenus(),
)

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  setBodyScroll(false)
})
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 300;
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  transition: box-shadow 0.25s ease;
}

.site-header--scrolled,
.site-header--menu-open {
  box-shadow: var(--shadow-md);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.header-topbar {
  background: var(--color-brand);
  color: var(--color-on-brand);
  font-size: 11px;
}

.header-topbar-inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0.5rem max(var(--page-gutter), env(safe-area-inset-left, 0px));
  padding-right: max(var(--page-gutter), env(safe-area-inset-right, 0px));
  text-align: center;
}

.topbar-promo {
  margin: 0;
  font-weight: 500;
  font-size: 11px;
  line-height: 1.55;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
}

@media (min-width: 640px) {
  .topbar-promo {
    font-size: 12px;
  }
}

.topbar-sep,
.topbar-contact {
  display: none;
}

@media (min-width: 640px) {
  .topbar-sep {
    display: inline;
    margin: 0 0.65rem;
    opacity: 0.35;
  }

  .topbar-contact {
    display: inline;
    opacity: 0.92;
    color: rgba(255, 255, 255, 0.92);
    text-decoration: none;
  }

  .topbar-contact:hover {
    color: var(--color-necha-green-light);
  }
}

.header-main {
  border-bottom: 1px solid var(--color-border);
}

.header-main-inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0.85rem max(var(--page-gutter), env(safe-area-inset-left, 0px));
  padding-right: max(var(--page-gutter), env(safe-area-inset-right, 0px));
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'menu logo utils'
    'search search search';
  align-items: center;
  gap: 0.75rem 1rem;
}

@media (min-width: 992px) {
  .header-main-inner {
    grid-template-columns: auto minmax(120px, 180px) 1fr auto;
    grid-template-areas: 'menu logo search utils';
    padding: 1rem 20px;
    gap: 1.5rem;
  }
}

.header-menu-btn {
  grid-area: menu;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--touch-min);
  height: var(--touch-min);
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.header-menu-btn:hover {
  background: var(--color-bg-soft);
}

@media (min-width: 992px) {
  .header-menu-btn {
    display: none;
  }
}

.header-logo {
  grid-area: logo;
  justify-self: start;
}

@media (min-width: 992px) {
  .header-logo {
    justify-self: center;
  }
}

.header-logo-img {
  height: 32px;
  width: auto;
  display: block;
}

@media (min-width: 768px) {
  .header-logo-img {
    height: 36px;
  }
}

.header-search {
  grid-area: search;
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-editorial);
  overflow: hidden;
}

.header-search input {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0.65rem 1rem;
  border: none;
  background: transparent;
  font-size: 15px;
  color: var(--color-text);
}

.header-search input:focus {
  outline: none;
}

.header-search button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 42px;
  border: none;
  background: transparent;
  color: var(--color-muted);
  cursor: pointer;
}

.header-utilities {
  grid-area: utils;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
}

.utility-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0.35rem;
  min-width: var(--touch-min);
  min-height: var(--touch-min);
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--radius);
}

.utility-link:hover {
  background: var(--color-bg-soft);
}

.utility-icon {
  display: flex;
  line-height: 0;
}

.utility-label {
  display: none;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-muted);
}

@media (min-width: 480px) and (max-width: 991px) {
  .utility-label {
    display: block;
  }
}

.header-nav {
  display: none;
  border-bottom: 1px solid var(--color-border);
}

@media (min-width: 992px) {
  .header-nav {
    display: block;
  }
}

.header-nav-inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-height: 48px;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  flex: 1;
  font-size: 13px;
}

.main-nav a {
  color: var(--color-body);
  padding: 0.35rem 0;
  white-space: nowrap;
}

.main-nav a:hover,
.main-nav a.active {
  color: var(--color-text);
  font-weight: 500;
}

.header-nav-meta {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--color-muted);
  white-space: nowrap;
}

.mobile-backdrop {
  position: fixed;
  inset: 0;
  border: none;
  background: rgba(0, 0, 0, 0.45);
  z-index: 280;
  cursor: pointer;
}

@media (min-width: 992px) {
  .mobile-backdrop {
    display: none;
  }
}

.mobile-panel {
  position: fixed;
  inset: 0;
  z-index: 290;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow-y: auto;
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  padding: calc(var(--header-topbar-height) + var(--header-main-height) + env(safe-area-inset-top, 0px) + 0.75rem)
    max(var(--page-gutter), env(safe-area-inset-left, 0px))
    max(1.5rem, env(safe-area-inset-bottom, 0px));
}

@media (min-width: 992px) {
  .mobile-panel {
    display: none;
  }
}

.mobile-search {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mobile-search input {
  flex: 1;
  min-width: 0;
  height: 42px;
  padding: 0 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: 14px;
}

.mobile-search button {
  padding: 0 1rem;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-black);
  color: var(--color-white);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.mobile-nav {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--color-border);
}

.mobile-nav a {
  display: block;
  padding: 0.85rem 0.25rem;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}

.mobile-nav a.active {
  color: var(--color-necha-green);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
</style>
