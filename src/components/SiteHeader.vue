<template>
  <header class="site-header" :class="{ 'site-header--scrolled': scrolled, 'site-header--menu-open': menuOpen }">
    <!-- Hara-style top announcement bar -->
    <div class="header-topbar">
      <div class="header-topbar-inner">
        <p class="topbar-promo">
          Free delivery on orders over TZS {{ formatTzs(storefrontConfig.freeDeliveryThresholdTZS) }}
          — Delivering across Dar es Salaam by electric vehicle
          <span class="topbar-sep" aria-hidden="true">|</span>
          <a class="topbar-contact" :href="`tel:${appConfig.phone.replace(/\s/g, '')}`">Call Us: {{ appConfig.phone }}</a>
        </p>
      </div>
    </div>

    <!-- Main header: logo | search | utilities -->
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

        <router-link to="/" class="header-logo" @click="closeMenus">
          <img :src="appConfig.logoUrl" alt="NECHA" class="header-logo-img" width="120" height="32" />
        </router-link>

        <form class="header-search" role="search" @submit.prevent="onSearch">
          <label class="sr-only" for="header-search-input">Search products</label>
          <input
            id="header-search-input"
            v-model="searchQuery"
            type="search"
            placeholder="Search products…"
            autocomplete="off"
          />
          <button type="submit" aria-label="Search">
            <Icon name="search" :size="18" />
          </button>
        </form>

        <div class="header-utilities">
          <ThemeToggle class="header-theme-toggle" />

          <router-link to="/wishlist" class="utility-link" @click="closeMenus">
            <span class="utility-icon" aria-hidden="true">
              <Icon name="heart" :size="22" />
              <span v-if="wishlist.count" class="utility-badge">{{ wishlist.count }}</span>
            </span>
            <span class="utility-label">Wishlist</span>
          </router-link>

          <router-link to="/account" class="utility-link" @click="closeMenus">
            <span class="utility-icon" aria-hidden="true">
              <Icon name="user" :size="22" />
            </span>
            <span class="utility-label">Account</span>
          </router-link>

          <router-link to="/cart" class="utility-link utility-link--cart" @click="closeMenus">
            <span class="utility-icon" aria-hidden="true">
              <Icon name="cart" :size="22" />
              <span v-if="cart.count" class="utility-badge">{{ cart.count }}</span>
            </span>
            <span class="utility-label">Cart</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Bottom nav: categories + links -->
    <div class="header-nav">
      <div class="header-nav-inner">
        <div
          class="nav-dropdown"
          @mouseenter="onCategoriesEnter"
          @mouseleave="onCategoriesLeave"
        >
          <button
            type="button"
            class="categories-btn"
            :class="{ active: categoriesOpen }"
            :aria-expanded="categoriesOpen"
            aria-haspopup="true"
            @click="toggleCategories"
          >
            <Icon name="grid" :size="18" />
            All Categories
            <Icon class="categories-chevron" name="chevron-down" :size="14" />
          </button>

          <div v-show="categoriesOpen" class="category-mega" role="menu">
            <div class="category-mega-grid">
              <router-link
                v-for="cat in shopCategories"
                :key="cat.id"
                :to="categoryShopLink(cat.id)"
                class="category-mega-item"
                role="menuitem"
                @click="closeMenus"
              >
                <span class="category-mega-name">{{ cat.label }}</span>
                <span class="category-mega-count">({{ cat.count }})</span>
              </router-link>
            </div>
            <router-link to="/shop" class="category-mega-all" @click="closeMenus">
              View all products →
            </router-link>
          </div>
        </div>

        <nav class="main-nav" aria-label="Primary">
          <router-link to="/" :class="{ active: route.name === 'landing' }" @click="closeMenus">Home</router-link>
          <router-link to="/about" :class="{ active: route.name === 'about' }" @click="closeMenus">About</router-link>
          <router-link to="/shop" :class="{ active: isShopRoute }" @click="closeMenus">Shop</router-link>
          <router-link to="/brands" :class="{ active: route.name === 'brands' }" @click="closeMenus">Brands</router-link>
          <router-link to="/contact" :class="{ active: route.name === 'contact' }" @click="closeMenus">Contact</router-link>
          <router-link to="/hotel-partners" :class="{ active: route.name === 'hotel-partners' }" @click="closeMenus">Hotel Partners</router-link>
          <router-link to="/earn-with-necha" :class="{ active: route.name === 'earn-with-necha' }" @click="closeMenus">Earn With Necha</router-link>
        </nav>

        <div class="header-nav-meta">
          <span>{{ appConfig.hours }}</span>
        </div>
      </div>
    </div>

    <!-- Mobile panel -->
    <Transition name="mobile-menu">
      <div v-if="menuOpen" id="mobile-nav" class="mobile-panel">
        <form class="mobile-search" role="search" @submit.prevent="onSearch">
          <input v-model="searchQuery" type="search" placeholder="Search products…" aria-label="Search products" />
          <button type="submit" aria-label="Search">Search</button>
        </form>

        <nav class="mobile-nav" aria-label="Mobile">
          <router-link to="/" :class="{ active: route.name === 'landing' }" @click="closeMenus">Home</router-link>
          <router-link to="/shop" :class="{ active: isShopRoute }" @click="closeMenus">Shop</router-link>
          <router-link to="/brands" @click="closeMenus">Brands</router-link>
          <router-link to="/contact" @click="closeMenus">Contact</router-link>
          <router-link to="/hotel-partners" @click="closeMenus">Hotel Partners</router-link>
          <router-link to="/earn-with-necha" @click="closeMenus">Earn With Necha</router-link>
          <router-link to="/wishlist" @click="closeMenus">Wishlist</router-link>
          <router-link to="/cart" @click="closeMenus">Cart</router-link>
          <router-link to="/account" @click="closeMenus">Account</router-link>
          <router-link to="/about" @click="closeMenus">About</router-link>
          <a href="#enter-hotel" @click.prevent="navigateTo('#enter-hotel')">Hotel Portal</a>
        </nav>

        <div class="mobile-categories">
          <p class="mobile-categories-label">All Categories</p>
          <div class="mobile-category-list">
            <router-link
              v-for="cat in shopCategories"
              :key="cat.id"
              :to="categoryShopLink(cat.id)"
              class="mobile-category-row"
              @click="closeMenus"
            >
              <span>{{ cat.label }}</span>
              <span class="mobile-category-count">{{ cat.count }}</span>
            </router-link>
          </div>
        </div>
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
import { appConfig, shopPath } from '@/config/app'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { categoryShopLink, shopCategories } from '@/config/categories'
import { storefrontConfig } from '@/config/storefront'
import Icon from '@/components/ui/Icon.vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const wishlist = useWishlistStore()
const scrolled = ref(false)
const menuOpen = ref(false)
const categoriesOpen = ref(false)
const searchQuery = ref('')

const isShopRoute = computed(() => route.name === 'shop' || route.name === 'shop-category' || route.name === 'product')

function formatTzs(n: number) {
  return n.toLocaleString('en-US')
}

function onScroll() {
  scrolled.value = window.scrollY > 12
}

function setBodyScroll(locked: boolean) {
  document.body.style.overflow = locked ? 'hidden' : ''
}

function closeMenus() {
  menuOpen.value = false
  categoriesOpen.value = false
  setBodyScroll(false)
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) categoriesOpen.value = false
  setBodyScroll(menuOpen.value)
}

function toggleCategories() {
  categoriesOpen.value = !categoriesOpen.value
}

function onCategoriesEnter() {
  if (window.matchMedia('(min-width: 992px)').matches) {
    categoriesOpen.value = true
  }
}

function onCategoriesLeave() {
  if (window.matchMedia('(min-width: 992px)').matches) {
    categoriesOpen.value = false
  }
}

function navigateTo(hash: string) {
  closeMenus()
  if (route.name !== 'landing') {
    router.push({ path: '/', hash })
    return
  }
  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
}

function onSearch() {
  closeMenus()
  router.push({ path: shopPath, query: searchQuery.value ? { q: searchQuery.value } : {} })
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

/* Top bar */
.header-topbar {
  background: transparent;
  color: var(--color-muted);
  font-size: 11px;
  border-bottom: 1px solid var(--color-border);
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
    opacity: 0.85;
    color: inherit;
    text-decoration: none;
  }

  .topbar-contact:hover {
    color: var(--color-text);
  }
}

/* Main row */
.header-main {
  border-bottom: 1px solid var(--color-border);
}

.header-main-inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0.85rem max(var(--page-gutter), env(safe-area-inset-left, 0px));
  padding-right: max(var(--page-gutter), env(safe-area-inset-right, 0px));
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    'menu logo'
    'search search'
    'utils utils';
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
  transition: border-color var(--transition-fast);
}

.header-search:focus-within {
  border-color: var(--color-focus);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.header-search input {
  flex: 1;
  min-width: 0;
  height: 44px;
  min-height: 44px;
  padding: 0.65rem 1rem;
  border: none;
  background: transparent;
  font-size: 15px;
  line-height: 1.5;
  letter-spacing: var(--tracking-body);
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

.header-search button:hover {
  color: var(--color-text);
}

.header-utilities {
  grid-area: utils;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
}

@media (min-width: 480px) {
  .header-utilities {
    gap: 0.5rem;
  }
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
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.utility-link:hover {
  background: var(--color-bg-soft);
  color: var(--color-interactive-hover);
}

.utility-icon {
  position: relative;
  display: flex;
  line-height: 0;
}

.utility-badge {
  position: absolute;
  top: -5px;
  right: -8px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: var(--radius-pill);
  background: var(--color-black);
  color: var(--color-white);
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
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

  .utility-link {
    min-width: 56px;
    padding: 0.4rem 0.55rem;
    min-height: auto;
  }
}

@media (min-width: 992px) {
  .utility-link {
    min-width: auto;
    min-height: auto;
    padding: 0.35rem;
  }
}

.utility-link:hover .utility-label {
  color: var(--color-text);
}

/* Bottom nav */
.header-nav {
  display: none;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
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

.nav-dropdown {
  position: relative;
  flex-shrink: 0;
}

.categories-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0;
  border: none;
  background: none;
  color: var(--color-text);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
}

.categories-btn:hover,
.categories-btn.active {
  color: var(--color-muted);
}

.categories-chevron {
  opacity: 0.8;
}

.category-mega {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: min(520px, calc(100vw - 40px));
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-premium);
  z-index: 310;
}

.category-mega-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.15rem;
}

.category-mega-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.65rem;
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-body);
  transition: background 0.15s, color 0.15s;
}

.category-mega-item:hover {
  background: var(--color-bg-soft);
  color: var(--color-text);
}

.category-mega-name {
  font-weight: 500;
}

.category-mega-count {
  font-size: 12px;
  color: var(--color-muted);
}

.category-mega-all {
  display: block;
  margin-top: 0.65rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  flex: 1;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.main-nav a {
  color: var(--color-body);
  position: relative;
  padding: 0.35rem 0;
  white-space: nowrap;
}

.main-nav a:hover,
.main-nav a.active {
  color: var(--color-text);
}

.main-nav a.active {
  font-weight: 500;
}

.header-nav-meta {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--color-muted);
  white-space: nowrap;
}

/* Mobile panel */
.mobile-backdrop {
  position: fixed;
  inset: 0;
  top: calc(var(--header-topbar-height) + var(--header-main-height));
  border: none;
  background: rgba(0, 0, 0, 0.35);
  z-index: 280;
  cursor: pointer;
}

@media (min-width: 992px) {
  .mobile-backdrop {
    display: none;
  }
}

.mobile-panel {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  max-height: calc(100dvh - var(--header-topbar-height) - var(--header-main-height));
  overflow-y: auto;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  z-index: 290;
  padding: 1rem max(var(--page-gutter), env(safe-area-inset-left, 0px)) 1.5rem;
  padding-right: max(var(--page-gutter), env(safe-area-inset-right, 0px));
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
  margin-bottom: 1.25rem;
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

.mobile-categories-label {
  margin: 0 0 0.65rem;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.mobile-category-list {
  display: grid;
  gap: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.mobile-category-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border);
}

.mobile-category-row:last-child {
  border-bottom: none;
}

.mobile-category-count {
  font-size: 12px;
  color: var(--color-muted);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
