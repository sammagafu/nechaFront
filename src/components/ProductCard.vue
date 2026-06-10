<template>
  <component
    :is="to ? 'router-link' : 'article'"
    :to="to"
    :id="cardId"
    class="product-card premium-card premium-card--flat"
    :class="{
      'product-card--link': !!to,
      'product-card--highlight': highlighted,
    }"
  >
    <div class="product-media">
      <div v-if="product.imageUrl" class="product-image-wrap">
        <img :src="product.imageUrl" :alt="product.name" class="product-image" loading="lazy" />
      </div>
      <div v-else class="product-image-placeholder" aria-hidden="true">
        <Icon name="package" :size="32" />
      </div>
      <button
        class="product-wish"
        :class="{ active: wishlist.has(product.id) }"
        type="button"
        :title="wishlist.has(product.id) ? 'Remove from favourites' : 'Add to favourites'"
        :aria-label="wishlist.has(product.id) ? 'Remove from favourites' : 'Add to favourites'"
        @click.stop="toggleWishlist"
      >
        <Icon name="heart" :size="18" :filled="wishlist.has(product.id)" />
      </button>
      <span v-if="highlighted" class="product-pick-badge">Today's pick</span>
    </div>

    <div class="product-body">
      <p v-if="product.brandName" class="product-brand">{{ product.brandName }}</p>
      <h3>{{ product.name }}</h3>
      <p class="product-price">{{ formatPrice(product.price, product.currency) }}</p>
      <p v-if="product.stock != null" class="muted stock">In stock: {{ product.stock }}</p>

      <div class="product-actions">
        <button class="btn btn-sm" type="button" @click.stop="addToCart">
          <Icon name="cart" :size="16" />
          Add to cart
        </button>
      </div>
      <p v-if="addedMessage" class="added-msg success">{{ addedMessage }}</p>
    </div>
  </component>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import type { CommerceProduct } from '@/types/commerce'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { formatPrice } from '@/utils/commerce'

const props = defineProps<{
  product: CommerceProduct
  to?: string
  highlighted?: boolean
  cardId?: string
}>()

const cart = useCartStore()
const wishlist = useWishlistStore()

const addedMessage = ref('')

function addToCart() {
  cart.add(props.product)
  addedMessage.value = 'Added to cart!'
  setTimeout(() => { addedMessage.value = '' }, 2000)
}

function toggleWishlist() {
  wishlist.toggle(props.product)
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  border-radius: var(--radius-xl) !important;
  transition: box-shadow var(--transition-base), transform var(--transition-base), border-color var(--transition-base);
}

.product-card:hover {
  box-shadow: var(--shadow-card);
  transform: translateY(-3px);
}

.product-card--highlight {
  border-color: var(--color-necha-green) !important;
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--color-necha-green) 35%, transparent),
    var(--shadow-card);
  animation: pick-pulse 2.4s ease-in-out infinite;
}

@keyframes pick-pulse {
  0%,
  100% {
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--color-necha-green) 35%, transparent),
      var(--shadow-card);
  }
  50% {
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--color-necha-green) 22%, transparent),
      var(--shadow-premium);
  }
}

.product-card--link:hover h3 {
  color: var(--color-necha-green);
}

.product-media {
  position: relative;
}

.product-image-wrap,
.product-image-placeholder {
  background: linear-gradient(160deg, var(--color-bg-soft), var(--color-bg-warm));
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.product-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.product-card:hover .product-image {
  transform: scale(1.04);
}

.product-wish {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--touch-min);
  height: var(--touch-min);
  border: none;
  border-radius: 50%;
  background: var(--color-surface-overlay);
  color: var(--color-muted);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: color var(--transition-fast), transform var(--transition-fast), background var(--transition-fast);
}

.product-wish:hover {
  color: var(--color-necha-green-dark);
  transform: scale(1.06);
}

.product-wish.active {
  color: var(--color-necha-green-dark);
  background: var(--color-surface);
}

.product-pick-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-pill);
  background: var(--color-black);
  color: var(--color-white);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-body {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-brand {
  margin: 0 0 var(--space-1);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.product-body h3 {
  margin: 0 0 var(--space-3);
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.product-price {
  margin: 0 0 var(--space-2);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.stock {
  margin: 0 0 var(--space-4);
  font-size: 13px;
}

.product-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.added-msg {
  margin: var(--space-2) 0 0;
  font-size: 13px;
}
</style>
