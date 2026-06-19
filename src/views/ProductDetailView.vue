<template>
  <div class="product-page">
    <p v-if="loading" class="product-status">Loading product…</p>
    <p v-else-if="!product" class="product-status">Product not found.</p>

    <template v-else>
      <nav class="product-breadcrumb section-inner">
        <router-link to="/shop" class="text-link">Shop</router-link>
        <span aria-hidden="true">/</span>
        <span>{{ product.name }}</span>
      </nav>

      <div class="product-layout section-inner">
        <figure class="product-gallery">
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            :alt="product.name"
            class="product-gallery-image"
          />
          <div v-else class="product-gallery-placeholder">
            <Icon name="sparkles" :size="48" />
          </div>
        </figure>

        <div class="product-info">
          <p v-if="product.brandName" class="product-brand">{{ product.brandName }}</p>
          <h1 class="product-title">{{ product.name }}</h1>
          <p class="product-desc">{{ product.description }}</p>

          <div class="product-price-row">
            <strong class="product-price">{{ formatTzs(product.price) }}</strong>
            <span v-if="product.stock != null" class="product-stock">{{ product.stock }} in stock</span>
          </div>

          <div class="product-actions">
            <button class="btn btn-lg" type="button" @click="addToCart">
              <Icon name="cart" :size="18" />
              Add to cart
            </button>
            <button
              class="btn btn-outline"
              type="button"
              :class="{ active: wishlist.has(product.id) }"
              @click="wishlist.toggle(product)"
            >
              <Icon name="heart" :size="18" :filled="wishlist.has(product.id)" />
              {{ wishlist.has(product.id) ? 'Saved' : 'Save' }}
            </button>
          </div>
          <p v-if="addedMessage" class="product-added-msg" role="status">{{ addedMessage }}</p>

          <ul class="product-perks">
            <li><Icon name="truck" :size="16" /> Same-day delivery in Dar es Salaam</li>
            <li><Icon name="sparkles" :size="16" /> Curated African beauty brands</li>
            <li><Icon name="droplet" :size="16" /> Botanical personal care</li>
            <li><Icon name="shield" :size="16" /> Secure mobile payments</li>
          </ul>
        </div>
      </div>

      <div class="product-sticky-bar" aria-label="Quick add to cart">
        <div class="product-sticky-price">
          <strong>{{ formatTzs(product.price) }}</strong>
          <span v-if="product.stock != null">{{ product.stock }} in stock</span>
        </div>
        <button class="btn btn-lg product-sticky-btn" type="button" @click="addToCart">
          <Icon name="cart" :size="18" />
          Add to cart
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'
import { useCartStore } from '@/stores/cart'
import { useCatalogStore } from '@/stores/catalog'
import { useWishlistStore } from '@/stores/wishlist'
import type { CommerceProduct } from '@/types/commerce'

const route = useRoute()
const catalog = useCatalogStore()
const cart = useCartStore()
const wishlist = useWishlistStore()

const product = ref<CommerceProduct | null>(null)
const loading = ref(true)
const addedMessage = ref('')
let addedTimer: ReturnType<typeof setTimeout> | undefined

function formatTzs(n: number) {
  return `TZS ${n.toLocaleString('en-TZ')}`
}

async function loadProduct() {
  loading.value = true
  await catalog.load()
  const slug = String(route.params.slug || '')
  product.value = catalog.findBySlug(slug) ?? (await catalog.fetchProduct(slug))
  loading.value = false
}

function addToCart() {
  if (!product.value) return
  cart.add(product.value)
  addedMessage.value = 'Added to cart!'
  clearTimeout(addedTimer)
  addedTimer = setTimeout(() => {
    addedMessage.value = ''
  }, 2500)
}

onMounted(loadProduct)

watch(
  () => route.params.slug,
  () => loadProduct(),
)
</script>

<style scoped>
.product-page {
  padding-bottom: calc(5.5rem + env(safe-area-inset-bottom, 0px));
}

@media (min-width: 900px) {
  .product-page {
    padding-bottom: 4rem;
  }
}

.product-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1.25rem;
  font-size: 13px;
  color: var(--color-muted);
}

.product-layout {
  display: grid;
  gap: 2rem;
  padding-top: 1.5rem;
}

@media (min-width: 768px) {
  .product-layout {
    gap: 2.5rem;
    padding-top: 2rem;
  }
}

@media (min-width: 900px) {
  .product-layout {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: start;
    gap: 4rem;
  }
}

.product-gallery {
  margin: 0;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-soft);
}

.product-gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-gallery-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
}

.product-brand {
  margin: 0 0 0.5rem;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-necha-green);
}

.product-title {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 4vw, 3rem);
}

.product-desc {
  margin: 0 0 1.5rem;
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-body);
}

.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1.75rem;
  border-bottom: 1px solid var(--color-border);
}

.product-price {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 500;
}

.product-stock {
  font-size: 13px;
  color: var(--color-muted);
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.product-added-msg {
  margin: 0 0 1.25rem;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-necha-green-dark);
}

.product-actions .btn {
  width: 100%;
}

@media (min-width: 480px) {
  .product-actions {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .product-actions .btn {
    width: auto;
  }
}

.product-sticky-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 220;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem max(var(--page-gutter), env(safe-area-inset-left, 0px));
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
  padding-right: max(var(--page-gutter), env(safe-area-inset-right, 0px));
  background: var(--header-bg);
  border-top: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
}

@media (min-width: 900px) {
  .product-sticky-bar {
    display: none;
  }
}

.product-sticky-price {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.product-sticky-price strong {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  white-space: nowrap;
}

.product-sticky-price span {
  font-size: 11px;
  color: var(--color-muted);
}

.product-sticky-btn {
  flex-shrink: 0;
  min-height: var(--touch-min);
}

.product-actions .btn-outline.active {
  border-color: var(--color-necha-green);
  color: var(--color-necha-green-dark);
  background: color-mix(in srgb, var(--color-necha-green) 8%, var(--color-surface-elevated));
}

.product-perks {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.product-perks li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 14px;
  color: var(--color-body);
}

.product-status {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--color-muted);
}
</style>
