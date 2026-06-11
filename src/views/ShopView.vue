<template>
  <div class="shop-page">
    <header class="shop-hero">
      <div class="shop-hero-inner">
        <p class="kicker">Necha collection</p>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="shop-lead">{{ pageSubtitle }}</p>
        <div class="shop-hero-actions">
          <button
            class="btn btn-lg btn-surprise"
            type="button"
            :disabled="!filteredProducts.length || catalog.loading"
            @click="surpriseMe"
          >
            <Icon name="sparkles" :size="18" />
            Surprise me
          </button>
          <router-link to="/shop" class="shop-hero-link" @click="clearSurprise">Browse all</router-link>
        </div>
      </div>
      <img v-if="heroImage" :src="heroImage" alt="" class="shop-hero-image" loading="eager" />
    </header>

    <div class="shop-delivery-strip section-inner">
      <p>
        Delivering to: Mbezi Beach · Kunduchi · Mikocheni · City Centre · Oysterbay-Masaki · Airport
        — Same day by electric vehicle
      </p>
      <p class="shop-delivery-note">
        Same-day delivery across Dar es Salaam · Free on orders over TZS 180,000
      </p>
    </div>

    <div class="shop-toolbar section-inner">
      <div class="shop-filter-bar">
        <form class="shop-filter-search" role="search" @submit.prevent="applySearch">
          <Icon name="search" :size="18" class="shop-filter-search-icon" />
          <input
            v-model="localSearch"
            type="search"
            placeholder="Search products, brands…"
            aria-label="Search products"
            autocomplete="off"
            @input="onSearchInput"
          />
          <button
            v-if="localSearch"
            type="button"
            class="shop-filter-clear"
            aria-label="Clear search"
            @click="clearSearch"
          >
            Clear
          </button>
        </form>
        <label class="shop-filter-sort">
          <span class="sr-only">Sort by</span>
          <select v-model="sortBy" aria-label="Sort products">
            <option value="default">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      <nav class="shop-cats" aria-label="Categories">
        <router-link
          to="/shop"
          class="shop-cat-pill"
          :class="{ active: !activeCategory }"
          @click="clearSurprise"
        >
          All
        </router-link>
        <router-link
          v-for="cat in shopCategories"
          :key="cat.id"
          :to="categoryShopLink(cat.id)"
          class="shop-cat-pill"
          :class="{ active: activeCategory === cat.id }"
          @click="clearSurprise"
        >
          {{ cat.label }}
        </router-link>
      </nav>

      <p v-if="hasActiveFilters" class="shop-filter-meta">
        {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'product' : 'products' }}
        <template v-if="searchQuery"> matching “{{ searchQuery }}”</template>
        <button type="button" class="text-link shop-filter-reset" @click="resetFilters">Reset filters</button>
      </p>
    </div>

    <Transition name="surprise-reveal">
      <section v-if="surprisePick" class="surprise-spotlight section-inner">
        <div class="surprise-spotlight-inner">
          <div class="surprise-spotlight-copy">
            <p class="surprise-eyebrow">{{ surpriseTagline }}</p>
            <h2>{{ surprisePick.name }}</h2>
            <p>{{ surprisePick.description }}</p>
            <div class="surprise-actions">
              <router-link
                v-if="surprisePick.slug"
                :to="productPath(surprisePick.slug)"
                class="btn btn-green"
              >
                View product →
              </router-link>
              <button class="btn btn-outline" type="button" @click="addSurpriseToCart">
                <Icon name="cart" :size="16" />
                Add to cart
              </button>
              <button class="btn-link surprise-again" type="button" @click="surpriseMe">
                Pick another
              </button>
            </div>
          </div>
          <div v-if="surprisePick.imageUrl" class="surprise-visual">
            <img :src="surprisePick.imageUrl" :alt="surprisePick.name" loading="lazy" />
            <span class="surprise-ring" aria-hidden="true">Lucky pick</span>
          </div>
        </div>
      </section>
    </Transition>

    <div class="section-inner shop-body">
      <p v-if="catalog.loading" class="shop-status">Loading collection…</p>
      <p v-else-if="catalog.error" class="shop-status error">{{ catalog.error }}</p>
      <p v-else-if="!filteredProducts.length" class="shop-status">No products match your filters.</p>

      <div v-else class="shop-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          :to="product.slug ? productPath(product.slug) : undefined"
          :highlighted="surprisePick?.id === product.id"
          :card-id="surprisePick?.id === product.id ? 'surprise-pick' : undefined"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'
import ProductCard from '@/components/ProductCard.vue'
import { productPath } from '@/config/app'
import { categoryShopLink, isValidCategoryId, shopCategories } from '@/config/categories'
import { siteImages } from '@/config/images'
import { useCartStore } from '@/stores/cart'
import { useCatalogStore } from '@/stores/catalog'
import { normalizeCategory } from '@/composables/useProductCategories'
import type { CommerceProduct } from '@/types/commerce'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const cart = useCartStore()

const localSearch = ref('')
const sortBy = ref<'default' | 'price-asc' | 'price-desc' | 'name'>('default')
let searchDebounce: ReturnType<typeof setTimeout> | undefined

const surprisePick = ref<CommerceProduct | null>(null)

const surpriseTaglines = [
  'Your lucky pick',
  'We think you will love this',
  "Tonight's self-care suggestion",
  'A guest favourite, just for you',
  'Treat-yourself energy',
]

const surpriseTagline = ref(surpriseTaglines[0])

onMounted(() => {
  catalog.load()
  syncSearchFromRoute()
})

const activeCategory = computed(() => {
  const param = route.params.categoryId
  const id = typeof param === 'string' ? param : ''
  return id && isValidCategoryId(id) ? id : ''
})

const searchQuery = computed(() => {
  const q = route.query.q
  return typeof q === 'string' ? q.trim() : ''
})

const filteredProducts = computed(() => {
  let list = catalog.commerceProducts
  if (activeCategory.value) {
    list = list.filter((p) => {
      const raw = catalog.products.find((r) => r.id === p.id)
      return raw && normalizeCategory(raw.category) === activeCategory.value
    })
  }
  if (searchQuery.value) {
    const needle = searchQuery.value.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        (p.brandName?.toLowerCase().includes(needle) ?? false),
    )
  }

  const sorted = [...list]
  switch (sortBy.value) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      break
  }
  return sorted
})

const hasActiveFilters = computed(
  () => Boolean(searchQuery.value || activeCategory.value || sortBy.value !== 'default'),
)

const activeCategoryMeta = computed(() =>
  shopCategories.find((c) => c.id === activeCategory.value),
)

const pageTitle = computed(() => {
  if (searchQuery.value) return 'Search'
  return activeCategoryMeta.value?.label ?? 'Shop Personal Care, Beauty & Wellness'
})

const pageSubtitle = computed(() => {
  if (searchQuery.value) return `${filteredProducts.value.length} products found`
  return activeCategoryMeta.value?.description ?? 'Personal care, beauty and wellness — delivered to your room or door across Dar es Salaam.'
})

const heroImage = computed(() => activeCategoryMeta.value?.image ?? siteImages.banner)

function shopRoutePath() {
  return activeCategory.value ? categoryShopLink(activeCategory.value) : '/shop'
}

function syncSearchFromRoute() {
  localSearch.value = searchQuery.value
}

function applySearch() {
  clearTimeout(searchDebounce)
  const q = localSearch.value.trim()
  router.push({ path: shopRoutePath(), query: q ? { q } : {} })
}

function onSearchInput() {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(applySearch, 280)
}

function clearSearch() {
  localSearch.value = ''
  applySearch()
}

function resetFilters() {
  localSearch.value = ''
  sortBy.value = 'default'
  clearSurprise()
  router.push('/shop')
}

function clearSurprise() {
  surprisePick.value = null
}

function pickRandomProduct(list: CommerceProduct[]) {
  if (!list.length) return null
  if (list.length === 1) return list[0]
  const others = list.filter((p) => p.id !== surprisePick.value?.id)
  const pool = others.length ? others : list
  return pool[Math.floor(Math.random() * pool.length)]
}

async function surpriseMe() {
  const pick = pickRandomProduct(filteredProducts.value)
  if (!pick) return

  surprisePick.value = pick
  surpriseTagline.value = surpriseTaglines[Math.floor(Math.random() * surpriseTaglines.length)]

  await nextTick()
  const el = document.getElementById('surprise-pick')
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function addSurpriseToCart() {
  if (surprisePick.value) cart.add(surprisePick.value)
}

watch(
  () => route.fullPath,
  () => {
    if (!catalog.loaded) catalog.load()
    syncSearchFromRoute()
    clearSurprise()
  },
)

watch(searchQuery, syncSearchFromRoute)
</script>

<style scoped>
.shop-page {
  background: var(--color-bg);
}

.shop-hero {
  position: relative;
  min-height: clamp(220px, 32vw, 360px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.shop-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shop-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--color-black) 82%, transparent),
    color-mix(in srgb, var(--color-black) 35%, transparent) 55%,
    color-mix(in srgb, var(--color-black) 15%, transparent)
  );
}

.shop-hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--container);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 3.5rem) max(var(--page-gutter), env(safe-area-inset-left, 0px));
  padding-right: max(var(--page-gutter), env(safe-area-inset-right, 0px));
}

.shop-hero .kicker {
  color: var(--color-necha-green-light);
}

.shop-hero .page-title,
.shop-lead {
  color: var(--color-white);
}

.shop-lead {
  margin: 0.75rem 0 0;
  max-width: 52ch;
  font-size: 15px;
  line-height: 1.7;
}

.shop-hero-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.65rem;
  margin-top: 1.35rem;
}

@media (min-width: 480px) {
  .shop-hero-actions {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.85rem 1.25rem;
  }
}

.btn-surprise {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  border-radius: var(--radius-pill) !important;
  background: var(--color-necha-green) !important;
  border: none !important;
  color: var(--color-white) !important;
  text-transform: none;
  letter-spacing: 0.02em;
}

.btn-surprise:hover:not(:disabled) {
  background: var(--color-necha-green-dark) !important;
  transform: translateY(-1px);
}

.btn-surprise:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (min-width: 480px) {
  .btn-surprise {
    width: auto;
  }
}

.shop-hero-link {
  color: rgba(255, 255, 255, 0.88);
  font-size: 13px;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.shop-hero-link:hover {
  color: var(--color-white);
}

.shop-delivery-strip {
  padding-top: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.shop-delivery-strip p {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-body);
}

.shop-delivery-note {
  margin-top: 0.35rem !important;
  color: var(--color-necha-green) !important;
  font-weight: 500;
}

.shop-toolbar {
  padding-top: 1.25rem;
  padding-bottom: 0.5rem;
}

.shop-filter-bar {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .shop-filter-bar {
    grid-template-columns: 1fr minmax(160px, 200px);
    align-items: center;
  }
}

.shop-filter-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: var(--touch-min, 44px);
  padding: 0 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.shop-filter-search:focus-within {
  border-color: var(--color-necha-green);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-necha-green) 14%, transparent);
}

.shop-filter-search-icon {
  flex-shrink: 0;
  color: var(--color-muted);
}

.shop-filter-search input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0.65rem 0;
  font-family: inherit;
  font-size: 14px;
  color: var(--color-text);
}

.shop-filter-search input:focus {
  outline: none;
}

.shop-filter-search input::placeholder {
  color: var(--color-muted);
}

.shop-filter-clear {
  flex-shrink: 0;
  border: none;
  background: transparent;
  padding: 0.35rem 0.5rem;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-necha-green-dark);
  cursor: pointer;
}

.shop-filter-sort select {
  width: 100%;
  min-height: var(--touch-min, 44px);
  padding: 0.55rem 2rem 0.55rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  font-family: inherit;
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888780' d='M3 4.5 6 7.5 9 4.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.85rem center;
}

.shop-filter-sort select:focus {
  outline: none;
  border-color: var(--color-necha-green);
}

.shop-filter-meta {
  margin: 0.85rem 0 0;
  font-size: 13px;
  color: var(--color-body);
}

.shop-filter-reset {
  margin-left: 0.5rem;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
}

.shop-cats {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  padding-inline: var(--page-gutter);
  margin-inline: calc(-1 * var(--page-gutter));
  scroll-padding-inline: var(--page-gutter);
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.shop-cats::-webkit-scrollbar {
  display: none;
}

.shop-cat-pill {
  flex-shrink: 0;
  touch-action: manipulation;
  padding: 0.55rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-body);
  background: var(--color-surface);
  transition: border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
}

.shop-cat-pill:hover,
.shop-cat-pill.active {
  border-color: var(--color-necha-green);
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-necha-green) 10%, var(--color-surface));
}

.surprise-spotlight {
  padding-top: 1.5rem;
}

.surprise-spotlight-inner {
  display: grid;
  gap: 1.5rem;
  align-items: center;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: var(--radius-2xl);
  border: 1px solid color-mix(in srgb, var(--color-necha-green) 35%, var(--color-border));
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-necha-green-light) 45%, var(--color-bg)) 0%,
    var(--color-surface) 100%
  );
  box-shadow: var(--shadow-premium);
}

@media (min-width: 768px) {
  .surprise-spotlight-inner {
    grid-template-columns: 1.2fr 0.8fr;
  }
}

.surprise-eyebrow {
  margin: 0 0 0.5rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-necha-green-dark);
}

.surprise-spotlight-copy h2 {
  margin: 0 0 0.65rem;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 500;
  line-height: 1.15;
}

.surprise-spotlight-copy p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-body);
  max-width: 48ch;
}

.surprise-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem 1rem;
  margin-top: 1.25rem;
}

.btn-green {
  background: var(--color-necha-green) !important;
  border-radius: var(--radius-pill) !important;
  color: var(--color-white) !important;
  border: none !important;
  text-transform: none;
}

.btn-green:hover {
  background: var(--color-necha-green-dark) !important;
}

.surprise-again {
  font-size: 13px;
}

.surprise-visual {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg-soft);
}

.surprise-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.surprise-ring {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--color-black);
  color: var(--color-white);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.2;
  box-shadow: var(--shadow-lg);
}

.surprise-reveal-enter-active,
.surprise-reveal-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.surprise-reveal-enter-from,
.surprise-reveal-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.shop-body {
  padding: 1.5rem 0 3rem;
}

@media (min-width: 768px) {
  .shop-body {
    padding: 2rem 0 4rem;
  }
}

.shop-status {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-muted);
}

.shop-status.error {
  color: var(--color-error);
}

.shop-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 1fr;
}

@media (min-width: 480px) {
  .shop-grid {
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  }
}

@media (min-width: 768px) {
  .shop-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

.kicker {
  margin: 0 0 0.75rem;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-muted);
}
</style>
