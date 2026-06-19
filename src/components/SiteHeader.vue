<template>
  <header class="site-header" :class="{ 'site-header--scrolled': scrolled, 'site-header--menu-open': isMobileOverlayOpen }">
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

        <button
          type="button"
          class="header-cats-mobile"
          :aria-expanded="categoriesOpen"
          aria-controls="mobile-category-sheet"
          aria-label="Browse shop categories"
          @click="toggleCategoriesMobile"
        >
          <Icon name="grid" :size="18" />
          <span>Categories</span>
        </button>

        <router-link to="/" class="header-logo" aria-label="Necha Africa home" @click="closeMenus">
          <NechaLogo alt="NECHA" class="header-logo-img" :width="120" :height="32" />
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

          <router-link :to="accountPath" class="utility-link" @click="closeMenus">
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

          <div
            v-show="categoriesOpen"
            class="category-mega"
            role="menu"
            @mouseenter="onCategoriesEnter"
            @mouseleave="onCategoriesLeave"
          >
            <div class="category-mega-panel">
              <div class="category-mega-grid">
                <router-link
                  v-for="cat in shopCategories"
                  :key="cat.id"
                  :to="categoryShopLink(cat.id)"
                  class="category-mega-item"
                  role="menuitem"
                  @click="closeMenus"
                >
                  <Icon :name="cat.icon" :size="18" class="category-mega-icon" />
                  <span class="category-mega-name">{{ cat.label }}</span>
                  <span class="category-mega-count">({{ cat.count }})</span>
                </router-link>
              </div>
              <router-link to="/shop" class="category-mega-all" @click="closeMenus">
                View all products →
              </router-link>
            </div>
          </div>
        </div>

        <nav class="main-nav" aria-label="Primary">
          <router-link to="/" :class="{ active: route.name === 'home' }" @click="closeMenus">Home</router-link>
          <router-link to="/about" :class="{ active: route.name === 'about' }" @click="closeMenus">About</router-link>
          <router-link to="/shop" :class="{ active: isShopRoute }" @click="closeMenus">Shop</router-link>
          <router-link to="/brands" :class="{ active: route.name === 'brands' }" @click="closeMenus">Brands</router-link>
          <router-link to="/contact" :class="{ active: route.name === 'contact' }" @click="closeMenus">Contact</router-link>
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
          <router-link to="/" :class="{ active: route.name === 'home' }" @click="closeMenus">Home</router-link>
          <router-link to="/shop" :class="{ active: isShopRoute }" @click="closeMenus">Shop</router-link>
          <router-link to="/brands" @click="closeMenus">Brands</router-link>
          <router-link to="/contact" @click="closeMenus">Contact</router-link>
          <router-link to="/earn-with-necha" @click="closeMenus">Earn With Necha</router-link>
          <router-link to="/wishlist" @click="closeMenus">Wishlist</router-link>
          <router-link to="/cart" @click="closeMenus">Cart</router-link>
          <router-link :to="accountPath" @click="closeMenus">Account</router-link>
          <router-link to="/about" @click="closeMenus">About</router-link>
          <a href="#enter-hotel" @click.prevent="navigateTo('#enter-hotel')">Hotel Portal</a>
        </nav>

        <div class="mobile-categories">
          <p class="mobile-categories-label">All Categories</p>
          <div class="mobile-category-list">
            <router-link to="/shop" class="mobile-category-row" @click="closeMenus">
              <span>All products</span>
            </router-link>
            <router-link
              v-for="cat in shopCategories"
              :key="cat.id"
              :to="categoryShopLink(cat.id)"
              class="mobile-category-row"
              @click="closeMenus"
            >
              <span class="mobile-category-row-label">
                <Icon :name="cat.icon" :size="18" />
                {{ cat.label }}
              </span>
              <span class="mobile-category-count">{{ cat.count }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="mobile-menu">
      <div
        v-if="categoriesOpen && !menuOpen"
        id="mobile-category-sheet"
        class="mobile-category-sheet"
        role="dialog"
        aria-label="Shop categories"
      >
        <div class="mobile-category-sheet-head">
          <p class="mobile-category-sheet-title">All categories</p>
          <button type="button" class="mobile-category-sheet-close" aria-label="Close categories" @click="closeMenus">
            <Icon name="close" :size="20" />
          </button>
        </div>
        <router-link to="/shop" class="mobile-category-all" @click="closeMenus">All products</router-link>
        <div class="mobile-category-sheet-grid">
          <router-link
            v-for="cat in shopCategories"
            :key="cat.id"
            :to="categoryShopLink(cat.id)"
            class="mobile-category-chip"
            @click="closeMenus"
          >
            <span class="mobile-category-chip-label">
              <Icon :name="cat.icon" :size="18" />
              {{ cat.label }}
            </span>
            <span class="mobile-category-count">{{ cat.count }}</span>
          </router-link>
        </div>
      </div>
    </Transition>

    <button
      v-if="menuOpen || (categoriesOpen && !menuOpen)"
      type="button"
      class="mobile-backdrop"
      :aria-label="menuOpen ? 'Close menu' : 'Close categories'"
      @click="closeMenus"
    />
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { appConfig, shopPath } from '@/config/app'
import NechaLogo from '@/components/NechaLogo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { categoryShopLink, shopCategories } from '@/config/categories'
import { storefrontConfig } from '@/config/storefront'
import Icon from '@/components/ui/Icon.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const scrolled = ref(false)
const menuOpen = ref(false)
const categoriesOpen = ref(false)
const searchQuery = ref('')
let savedScrollY = 0

const isShopRoute = computed(() => route.name === 'shop' || route.name === 'shop-category' || route.name === 'product')
const isMobileOverlayOpen = computed(() => menuOpen.value || categoriesOpen.value)
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
  if (categoriesOpen.value) menuOpen.value = false
  if (window.matchMedia('(max-width: 991px)').matches) {
    setBodyScroll(categoriesOpen.value)
  }
}

function toggleCategoriesMobile() {
  categoriesOpen.value = !categoriesOpen.value
  if (categoriesOpen.value) {
    menuOpen.value = false
    setBodyScroll(true)
  } else {
    setBodyScroll(false)
  }
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
  const scrollOnPage = route.name === 'home'
  if (!scrollOnPage) {
    const path = '/'
    router.push({ path, hash })
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
  background: var(--color-brand);
  color: var(--color-on-brand);
  font-size: 11px;
  border-bottom: none;
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
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'menu logo cats'
    'search search search'
    'utils utils utils';
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
  min-height: var(--touch-min, 44px);
  padding: 0.35rem 0.5rem 0.35rem 0;
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
  top: 100%;
  left: 0;
  width: min(520px, calc(100vw - 40px));
  padding-top: 8px;
  z-index: 310;
}

.category-mega-panel {
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-premium);
}

.category-mega-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.15rem;
}

.category-mega-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.65rem;
  padding: 0.65rem 0.75rem;
  min-height: var(--touch-min, 44px);
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-body);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.category-mega-item:hover {
  background: var(--color-bg-soft);
  color: var(--color-text);
}

.category-mega-icon {
  flex-shrink: 0;
  color: var(--color-necha-green);
}

.category-mega-name {
  flex: 1;
  font-weight: 500;
}

.category-mega-count {
  margin-left: auto;
  font-size: 12px;
  color: var(--color-muted);
}

.mobile-category-row-label,
.mobile-category-chip-label {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--color-necha-green);
}

.category-mega-all {
  display: block;
  margin-top: 0.65rem;
  padding: 0.65rem 0.75rem 0;
  border-top: 1px solid var(--color-border);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
}

.header-cats-mobile {
  grid-area: cats;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  justify-self: end;
  min-height: var(--touch-min, 44px);
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

@media (min-width: 992px) {
  .header-cats-mobile {
    display: none;
  }
}

.mobile-category-sheet {
  position: fixed;
  inset: 0;
  z-index: 295;
  height: 100dvh;
  height: 100svh;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: calc(var(--header-topbar-height) + var(--header-main-height) + env(safe-area-inset-top, 0px) + 0.75rem)
    max(var(--page-gutter), env(safe-area-inset-left, 0px))
    max(1.25rem, env(safe-area-inset-bottom, 0px));
  padding-right: max(var(--page-gutter), env(safe-area-inset-right, 0px));
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
}

@media (min-width: 992px) {
  .mobile-category-sheet {
    display: none;
  }
}

.mobile-category-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.mobile-category-sheet-title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-muted);
}

.mobile-category-sheet-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--touch-min, 44px);
  height: var(--touch-min, 44px);
  border: none;
  border-radius: 50%;
  background: var(--color-bg-soft);
  color: var(--color-text);
  cursor: pointer;
}

.mobile-category-all {
  display: flex;
  align-items: center;
  min-height: var(--touch-min, 44px);
  margin-bottom: 0.65rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-necha-green) 12%, var(--color-surface));
  border: 1px solid color-mix(in srgb, var(--color-necha-green) 35%, var(--color-border));
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
}

.mobile-category-sheet-grid {
  display: grid;
  gap: 0.5rem;
}

.mobile-category-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: var(--touch-min, 44px);
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: 14px;
  color: var(--color-body);
  text-decoration: none;
  background: var(--color-bg);
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
  border: none;
  background: rgba(0, 0, 0, 0.45);
  z-index: 280;
  cursor: pointer;
  touch-action: none;
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
  height: 100svh;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  padding: calc(var(--header-topbar-height) + var(--header-main-height) + env(safe-area-inset-top, 0px) + 0.75rem)
    max(var(--page-gutter), env(safe-area-inset-left, 0px))
    max(1.5rem, env(safe-area-inset-bottom, 0px));
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
}
</style>
