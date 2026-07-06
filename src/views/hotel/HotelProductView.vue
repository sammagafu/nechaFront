<template>
  <div v-if="product" class="hotel-product-page">
    <StorefrontPageHero
      badge="Product"
      :title="product.name"
      :description="product.brand_name || 'Personal care & wellness'"
    />

    <div class="hotel-product-layout">
      <div class="hotel-product-gallery">
        <div class="hotel-product-gallery-main">
          <img
            v-if="activeImage"
            :src="activeImage"
            :alt="product.name"
            class="hotel-product-gallery-image"
          />
        </div>
        <div v-if="galleryImages.length > 1" class="hotel-product-gallery-thumbs">
          <button
            v-for="(img, index) in galleryImages"
            :key="`${img}-${index}`"
            type="button"
            class="hotel-product-thumb"
            :class="{ active: activeImageIndex === index }"
            @click="activeImageIndex = index"
          >
            <img :src="img" :alt="`${product.name} view ${index + 1}`" />
          </button>
        </div>
      </div>

      <div class="hotel-product-purchase">
        <p v-if="product.brand_name" class="sf-brand">{{ product.brand_name }}</p>
        <DualPrice :amount-tzs="product.price" stack class="hotel-product-price" />
        <p v-if="reviewSummary.count" class="hotel-product-rating">
          <span class="hotel-product-stars" aria-hidden="true">{{ starString(Math.round(reviewSummary.average)) }}</span>
          {{ reviewSummary.average.toFixed(1) }} · {{ reviewSummary.count }} {{ reviewSummary.count === 1 ? 'review' : 'reviews' }}
        </p>
        <p v-if="product.stock != null" class="hotel-product-stock">{{ product.stock }} in stock</p>

        <div class="hotel-product-qty">
          <span class="hotel-product-qty-label">Quantity</span>
          <div class="hotel-product-qty-controls">
            <button type="button" aria-label="Decrease quantity" @click="changeQty(-1)">−</button>
            <span>{{ quantity }}</span>
            <button type="button" aria-label="Increase quantity" @click="changeQty(1)">+</button>
          </div>
        </div>

        <button type="button" class="sf-btn-primary hotel-product-add" @click="addToCart">
          Add {{ quantity }} to cart
        </button>
      </div>
    </div>

    <section v-if="product.description" class="hotel-product-detail">
      <h2>About this product</h2>
      <p>{{ product.description }}</p>
    </section>

    <section v-if="productSpecs.length" class="hotel-product-detail">
      <h2>Specifications</h2>
      <dl class="hotel-product-specs">
        <div v-for="spec in productSpecs" :key="spec.label">
          <dt>{{ spec.label }}</dt>
          <dd>{{ spec.value }}</dd>
        </div>
      </dl>
    </section>

    <section class="hotel-product-reviews">
      <h2>Guest reviews</h2>

      <ul v-if="reviews.length" class="hotel-product-review-list">
        <li v-for="review in reviews" :key="review.id" class="hotel-product-review-item">
          <div class="hotel-product-review-head">
            <strong>{{ review.guest_name }}</strong>
            <span class="hotel-product-stars" aria-hidden="true">{{ starString(review.rating) }}</span>
          </div>
          <p class="hotel-product-review-body">{{ review.body }}</p>
        </li>
      </ul>
      <p v-else class="hotel-product-reviews-empty">No reviews yet — be the first to share your experience.</p>

      <form class="hotel-product-review-form" @submit.prevent="submitReview">
        <p class="hotel-product-reviews-lead">Leave a review</p>
        <div class="hotel-product-rating-input">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="hotel-product-rating-star"
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
        <p v-if="reviewError" class="hotel-product-review-error">{{ reviewError }}</p>
        <p v-if="reviewSuccess" class="hotel-product-review-success">Thank you — your review has been posted.</p>
        <button type="submit" class="sf-btn-primary" :disabled="reviewSubmitting">
          {{ reviewSubmitting ? 'Sending…' : 'Submit review' }}
        </button>
      </form>
    </section>
  </div>
  <div v-else class="hotel-product-loading">Loading product…</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  fetchProductBySlug,
  fetchProductReviews,
  submitProductReview,
  type ProductReview,
} from '@/api/hotels'
import { getApiError } from '@/api/client'
import StorefrontPageHero from '@/components/storefront/StorefrontPageHero.vue'
import DualPrice from '@/components/storefront/DualPrice.vue'
import { useHotelSessionStore } from '@/stores/hotelSession'
import { useCartStore } from '@/stores/cart'
import { toCommerceProduct } from '@/utils/storefront'
import type { StorefrontProduct } from '@/types/storefront'

const route = useRoute()
const session = useHotelSessionStore()
const cart = useCartStore()
const product = ref<StorefrontProduct | null>(null)
const quantity = ref(1)
const activeImageIndex = ref(0)
const reviews = ref<ProductReview[]>([])
const reviewSubmitting = ref(false)
const reviewError = ref('')
const reviewSuccess = ref(false)

const reviewForm = reactive({
  guest_name: '',
  guest_phone: '',
  rating: 5,
  body: '',
})

const galleryImages = computed(() => {
  if (!product.value) return []
  const extra = product.value.images ?? []
  const all = [product.value.image_url, ...extra].filter((src): src is string => Boolean(src))
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
  if (product.value.category) specs.push({ label: 'Category', value: product.value.category })
  if (product.value.brand_name) specs.push({ label: 'Brand', value: product.value.brand_name })
  if (product.value.badge) specs.push({ label: 'Badge', value: product.value.badge.replace(/_/g, ' ') })
  if (product.value.stock != null) specs.push({ label: 'Availability', value: `${product.value.stock} in stock` })
  return specs
})

function starString(n: number) {
  const filled = Math.max(0, Math.min(5, n))
  return '★★★★★'.slice(0, filled) + '☆☆☆☆☆'.slice(0, 5 - filled)
}

onMounted(async () => {
  const slug = route.params.slug as string
  const productSlug = route.params.productSlug as string
  product.value = await fetchProductBySlug(slug, productSlug)
  await loadReviews(slug, productSlug)
})

async function loadReviews(slug: string, productSlug: string) {
  try {
    reviews.value = await fetchProductReviews(slug, productSlug)
  } catch {
    reviews.value = []
  }
}

function changeQty(delta: number) {
  quantity.value = Math.max(1, quantity.value + delta)
}

function addToCart() {
  if (!product.value || !session.hotel) return
  const commerce = toCommerceProduct(product.value, session.slug, session.hotel.code)
  for (let i = 0; i < quantity.value; i += 1) {
    cart.add(commerce)
  }
}

async function submitReview() {
  const slug = route.params.slug as string
  const productSlug = route.params.productSlug as string
  if (!slug || !productSlug) return
  reviewSubmitting.value = true
  reviewError.value = ''
  reviewSuccess.value = false
  try {
    const created = await submitProductReview(slug, productSlug, {
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
</script>

<style scoped>
.hotel-product-layout {
  display: grid;
  gap: 1.5rem;
  max-width: 960px;
  margin: 0 auto;
  padding: 1.25rem 0 2rem;
}

@media (min-width: 768px) {
  .hotel-product-layout {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: start;
  }
}

.hotel-product-gallery-main {
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
  background: var(--sf-bg-soft, #f5f4f2);
}

.hotel-product-gallery-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.hotel-product-gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.65rem;
  flex-wrap: wrap;
}

.hotel-product-thumb {
  padding: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: none;
}

.hotel-product-thumb.active {
  border-color: var(--sf-green, #86bc42);
}

.hotel-product-thumb img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  display: block;
}

.hotel-product-purchase {
  padding: 0.5rem 0;
}

.hotel-product-price {
  font-size: 20px;
  margin-top: 0.35rem;
}

.hotel-product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0 0;
  font-size: 13px;
  color: var(--sf-muted);
}

.hotel-product-stars {
  color: #e0a500;
  letter-spacing: 1px;
}

.hotel-product-stock {
  margin: 0.35rem 0 0;
  font-size: 12px;
  color: var(--sf-muted);
}

.hotel-product-qty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.25rem 0;
  padding: 0.75rem 0;
  border-block: 1px solid var(--sf-border, #e8e6e3);
}

.hotel-product-qty-label {
  font-size: 13px;
  font-weight: 500;
}

.hotel-product-qty-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.hotel-product-qty-controls button {
  width: 36px;
  height: 36px;
  border: 1px solid var(--sf-border, #e8e6e3);
  border-radius: 50%;
  background: var(--sf-surface, #fff);
  font-size: 18px;
  cursor: pointer;
}

.hotel-product-add {
  width: 100%;
}

.hotel-product-detail,
.hotel-product-reviews {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 0 2rem;
}

.hotel-product-detail h2,
.hotel-product-reviews h2 {
  margin: 0 0 0.75rem;
  font-family: var(--font-display, Georgia, serif);
  font-size: 1.35rem;
  font-weight: 500;
}

.hotel-product-detail p {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--sf-text-muted);
}

.hotel-product-review-list {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.hotel-product-review-item {
  padding: 0.85rem 1rem;
  border: 1px solid var(--sf-border, #e8e6e3);
  border-radius: 10px;
}

.hotel-product-review-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.hotel-product-review-body {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--sf-text-muted);
}

.hotel-product-reviews-empty {
  margin: 0 0 1.5rem;
  font-size: 14px;
  color: var(--sf-muted);
}

.hotel-product-reviews-lead {
  margin: 0 0 0.25rem;
  font-size: 14px;
  font-weight: 600;
}

.hotel-product-review-form {
  display: grid;
  gap: 0.65rem;
}

.hotel-product-rating-input {
  display: flex;
  gap: 0.25rem;
}

.hotel-product-rating-star {
  border: none;
  background: none;
  padding: 0;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  color: var(--sf-border, #d8d6d3);
}

.hotel-product-rating-star.on {
  color: #e0a500;
}

.hotel-product-review-form input,
.hotel-product-review-form textarea {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--sf-border, #e8e6e3);
  border-radius: 8px;
  font: inherit;
}

.hotel-product-review-error {
  color: #b42318;
  font-size: 13px;
  margin: 0;
}

.hotel-product-review-success {
  color: #027a48;
  font-size: 13px;
  margin: 0;
}

.hotel-product-loading {
  padding: 2rem;
  text-align: center;
}

.hotel-product-specs {
  display: grid;
  gap: 0.65rem;
  margin: 0;
}

.hotel-product-specs div {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.75rem;
  font-size: 13px;
}

.hotel-product-specs dt {
  margin: 0;
  font-weight: 600;
  color: var(--sf-muted);
}

.hotel-product-specs dd {
  margin: 0;
}
</style>
