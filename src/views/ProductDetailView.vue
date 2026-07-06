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
        <div class="product-gallery">
          <figure class="product-gallery-main">
            <img
              v-if="activeImage"
              :src="activeImage"
              :alt="product.name"
              class="product-gallery-image"
            />
            <div v-else class="product-gallery-placeholder">
              <Icon name="sparkles" :size="48" />
            </div>
          </figure>
          <div v-if="galleryImages.length > 1" class="product-gallery-thumbs">
            <button
              v-for="(img, index) in galleryImages"
              :key="`${img}-${index}`"
              type="button"
              class="product-thumb"
              :class="{ active: activeImageIndex === index }"
              @click="activeImageIndex = index"
            >
              <img :src="img" :alt="`${product.name} view ${index + 1}`" />
            </button>
          </div>
        </div>

        <div class="product-info">
          <p v-if="product.brandName" class="product-brand">{{ product.brandName }}</p>
          <h1 class="product-title">{{ product.name }}</h1>

          <DualPrice :amount-tzs="product.price" stack class="product-price" />
          <p v-if="reviewSummary.count" class="product-rating">
            <span class="product-stars" aria-hidden="true">{{ starString(Math.round(reviewSummary.average)) }}</span>
            {{ reviewSummary.average.toFixed(1) }} · {{ reviewSummary.count }}
            {{ reviewSummary.count === 1 ? 'review' : 'reviews' }}
          </p>
          <p v-if="product.stock != null" class="product-stock">{{ product.stock }} in stock</p>

          <div class="product-qty">
            <span class="product-qty-label">Quantity</span>
            <div class="product-qty-controls">
              <button type="button" aria-label="Decrease quantity" @click="changeQty(-1)">−</button>
              <span>{{ quantity }}</span>
              <button type="button" aria-label="Increase quantity" @click="changeQty(1)">+</button>
            </div>
          </div>

          <div class="product-actions">
            <button class="btn btn-lg" type="button" @click="addToCart">
              <Icon name="cart" :size="18" />
              Add {{ quantity }} to cart
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

      <section v-if="product.description" class="product-detail section-inner">
        <h2>About this product</h2>
        <p>{{ product.description }}</p>
      </section>

      <section v-if="productSpecs.length" class="product-detail section-inner">
        <h2>Specifications</h2>
        <dl class="product-specs">
          <div v-for="spec in productSpecs" :key="spec.label">
            <dt>{{ spec.label }}</dt>
            <dd>{{ spec.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="product-reviews section-inner">
        <h2>Customer reviews</h2>

        <ul v-if="reviews.length" class="product-review-list">
          <li v-for="review in reviews" :key="review.id" class="product-review-item">
            <div class="product-review-head">
              <strong>{{ review.guest_name }}</strong>
              <span class="product-stars" aria-hidden="true">{{ starString(review.rating) }}</span>
            </div>
            <p class="product-review-body">{{ review.body }}</p>
          </li>
        </ul>
        <p v-else class="product-reviews-empty">No reviews yet — be the first to share your experience.</p>

        <form class="product-review-form" @submit.prevent="submitReview">
          <p class="product-reviews-lead">Leave a review</p>
          <div class="product-rating-input">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="product-rating-star"
              :class="{ on: star <= reviewForm.rating }"
              :aria-label="`${star} star${star === 1 ? '' : 's'}`"
              @click="reviewForm.rating = star"
            >
              ★
            </button>
          </div>
          <input v-model="reviewForm.guest_name" placeholder="Your name *" required />
          <input v-model="reviewForm.guest_phone" type="tel" placeholder="Phone (optional)" />
          <textarea v-model="reviewForm.body" rows="3" placeholder="Your review *" required />
          <p v-if="reviewError" class="product-review-error">{{ reviewError }}</p>
          <p v-if="reviewSuccess" class="product-review-success">Thank you — your review has been posted.</p>
          <button type="submit" class="btn" :disabled="reviewSubmitting">
            {{ reviewSubmitting ? 'Sending…' : 'Submit review' }}
          </button>
        </form>
      </section>

      <div class="product-sticky-bar" aria-label="Quick add to cart">
        <div class="product-sticky-price">
          <DualPrice :amount-tzs="product.price * quantity" stack />
          <span v-if="product.stock != null">{{ product.stock }} in stock</span>
        </div>
        <button class="btn btn-lg product-sticky-btn" type="button" @click="addToCart">
          <Icon name="cart" :size="18" />
          Add {{ quantity }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'
import DualPrice from '@/components/storefront/DualPrice.vue'
import { fetchProductReviews, submitProductReview, type ProductReview } from '@/api/hotels'
import { getApiError } from '@/api/client'
import { catalogConfig } from '@/config/app'
import { useCartStore } from '@/stores/cart'
import { useCatalogStore } from '@/stores/catalog'
import { useWishlistStore } from '@/stores/wishlist'
import { badgeLabel, categoryLabel } from '@/utils/storefront'
import type { CommerceProduct } from '@/types/commerce'
import type { StorefrontProduct } from '@/types/storefront'

const route = useRoute()
const catalog = useCatalogStore()
const cart = useCartStore()
const wishlist = useWishlistStore()

const product = ref<CommerceProduct | null>(null)
const rawProduct = ref<StorefrontProduct | null>(null)
const loading = ref(true)
const quantity = ref(1)
const activeImageIndex = ref(0)
const addedMessage = ref('')
const reviews = ref<ProductReview[]>([])
const reviewSubmitting = ref(false)
const reviewError = ref('')
const reviewSuccess = ref(false)
let addedTimer: ReturnType<typeof setTimeout> | undefined

const reviewForm = reactive({
  guest_name: '',
  guest_phone: '',
  rating: 5,
  body: '',
})

const galleryImages = computed(() => {
  if (!product.value) return []
  const extra = rawProduct.value?.images ?? []
  const all = [product.value.imageUrl, ...extra].filter((src): src is string => Boolean(src))
  return Array.from(new Set(all))
})

const activeImage = computed(() => galleryImages.value[activeImageIndex.value] ?? '')

const reviewSummary = computed(() => {
  const count = reviews.value.length
  if (!count) return { count: 0, average: 0 }
  const total = reviews.value.reduce((sum, r) => sum + r.rating, 0)
  return { count, average: total / count }
})

const productSpecs = computed(() => {
  if (!product.value) return []
  const specs: { label: string; value: string }[] = []
  if (rawProduct.value?.category) {
    specs.push({ label: 'Category', value: categoryLabel(rawProduct.value.category) })
  }
  if (product.value.brandName) specs.push({ label: 'Brand', value: product.value.brandName })
  if (product.value.badge) specs.push({ label: 'Badge', value: badgeLabel(product.value.badge) })
  if (product.value.stock != null) specs.push({ label: 'Availability', value: `${product.value.stock} in stock` })
  return specs
})

function starString(n: number) {
  const filled = Math.max(0, Math.min(5, n))
  return '★★★★★'.slice(0, filled) + '☆☆☆☆☆'.slice(0, 5 - filled)
}

async function loadProduct() {
  loading.value = true
  activeImageIndex.value = 0
  quantity.value = 1
  await catalog.load()
  const slug = String(route.params.slug || '')
  product.value = catalog.findBySlug(slug) ?? (await catalog.fetchProduct(slug))
  rawProduct.value = catalog.products.find((p) => p.slug === slug) ?? null
  if (product.value) {
    await loadReviews(slug)
  } else {
    reviews.value = []
  }
  loading.value = false
}

async function loadReviews(productSlug: string) {
  try {
    reviews.value = await fetchProductReviews(catalogConfig.hotelSlug, productSlug)
  } catch {
    reviews.value = []
  }
}

function changeQty(delta: number) {
  quantity.value = Math.max(1, quantity.value + delta)
}

function addToCart() {
  if (!product.value) return
  cart.add(product.value, quantity.value)
  addedMessage.value = `Added ${quantity.value} to cart!`
  clearTimeout(addedTimer)
  addedTimer = setTimeout(() => {
    addedMessage.value = ''
  }, 2500)
}

async function submitReview() {
  const productSlug = String(route.params.slug || '')
  if (!productSlug) return
  reviewSubmitting.value = true
  reviewError.value = ''
  reviewSuccess.value = false
  try {
    const created = await submitProductReview(catalogConfig.hotelSlug, productSlug, {
      guest_name: reviewForm.guest_name,
      guest_phone: reviewForm.guest_phone || undefined,
      rating: reviewForm.rating,
      body: reviewForm.body,
    })
    reviews.value = [created, ...reviews.value]
    reviewSuccess.value = true
    reviewForm.body = ''
    reviewForm.rating = 5
  } catch (e) {
    reviewError.value = getApiError(e)
  } finally {
    reviewSubmitting.value = false
  }
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

.product-gallery-main {
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

.product-gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.65rem;
  flex-wrap: wrap;
}

.product-thumb {
  padding: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: none;
}

.product-thumb.active {
  border-color: var(--color-necha-green);
}

.product-thumb img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  display: block;
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

.product-price {
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0 0;
  font-size: 13px;
  color: var(--color-muted);
}

.product-stars {
  color: #e0a500;
  letter-spacing: 1px;
}

.product-stock {
  margin: 0.35rem 0 0;
  font-size: 13px;
  color: var(--color-muted);
}

.product-qty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.25rem 0;
  padding: 0.75rem 0;
  border-block: 1px solid var(--color-border);
}

.product-qty-label {
  font-size: 13px;
  font-weight: 500;
}

.product-qty-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.product-qty-controls button {
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface-elevated);
  font-size: 18px;
  cursor: pointer;
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
  margin: 1.25rem 0 0;
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

.product-detail,
.product-reviews {
  padding: 1.5rem 0 2rem;
  max-width: 720px;
}

.product-detail h2,
.product-reviews h2 {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
}

.product-detail p {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-body);
}

.product-specs {
  display: grid;
  gap: 0.65rem;
  margin: 0;
}

.product-specs div {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.75rem;
  font-size: 13px;
}

.product-specs dt {
  margin: 0;
  font-weight: 600;
  color: var(--color-muted);
}

.product-specs dd {
  margin: 0;
}

.product-review-list {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.product-review-item {
  padding: 0.85rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.product-review-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.product-review-body {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-body);
}

.product-reviews-empty {
  margin: 0 0 1.5rem;
  font-size: 14px;
  color: var(--color-muted);
}

.product-reviews-lead {
  margin: 0 0 0.25rem;
  font-size: 14px;
  font-weight: 600;
}

.product-review-form {
  display: grid;
  gap: 0.65rem;
}

.product-rating-input {
  display: flex;
  gap: 0.25rem;
}

.product-rating-star {
  border: none;
  background: none;
  padding: 0;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  color: var(--color-border);
}

.product-rating-star.on {
  color: #e0a500;
}

.product-review-form input,
.product-review-form textarea {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font: inherit;
}

.product-review-error {
  color: #b42318;
  font-size: 13px;
  margin: 0;
}

.product-review-success {
  color: #027a48;
  font-size: 13px;
  margin: 0;
}

.product-status {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--color-muted);
}
</style>
