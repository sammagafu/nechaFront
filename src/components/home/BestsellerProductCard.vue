<template>
  <article class="bpc">
    <router-link v-if="to" :to="to" class="bpc-visual">
      <img :src="product.imageUrl" :alt="product.name" loading="lazy" />
      <button
        type="button"
        class="bpc-wish"
        :class="{ active: wishlist.has(product.id) }"
        :aria-label="wishlist.has(product.id) ? 'Remove from favourites' : 'Add to favourites'"
        @click.prevent="wishlist.toggle(product)"
      >
        <Icon name="heart" :size="18" :filled="wishlist.has(product.id)" />
      </button>
    </router-link>
    <div v-else class="bpc-visual">
      <img :src="product.imageUrl" :alt="product.name" loading="lazy" />
    </div>

    <div class="bpc-body">
      <p v-if="product.brandName" class="bpc-brand">{{ product.brandName }}</p>
      <h3>
        <router-link v-if="to" :to="to">{{ product.name }}</router-link>
        <span v-else>{{ product.name }}</span>
      </h3>
      <div class="bpc-rating" aria-label="5 star rating">
        <span class="bpc-stars">★★★★★</span>
        <span class="bpc-reviews">Guest favourite</span>
      </div>
      <div class="bpc-foot">
        <div>
          <strong class="bpc-price">TZS {{ formatPrice(product.price) }}</strong>
          <span v-if="usdApprox" class="bpc-usd">{{ usdApprox }}</span>
        </div>
        <button type="button" class="bpc-cart" aria-label="Add to cart" @click="cart.add(product)">
          +
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import { formatUSD } from '@/composables/usePricing'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import type { CommerceProduct } from '@/types/commerce'

const props = defineProps<{
  product: CommerceProduct
  to?: string
}>()

const cart = useCartStore()
const wishlist = useWishlistStore()

const usdApprox = computed(() => (props.product.price ? formatUSD(props.product.price) : ''))

function formatPrice(n: number) {
  return n.toLocaleString('en-TZ')
}
</script>

<style scoped>
.bpc {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.bpc:hover {
  box-shadow: var(--shadow-card);
  transform: translateY(-3px);
}

.bpc-visual {
  position: relative;
  display: block;
  aspect-ratio: 1;
  background: var(--color-bg-soft);
  overflow: hidden;
}

.bpc-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s var(--ease-out);
}

.bpc:hover .bpc-visual img {
  transform: scale(1.05);
}

.bpc-wish {
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
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.bpc-wish:hover {
  color: var(--color-necha-green-dark);
  transform: scale(1.06);
}

.bpc-wish.active {
  color: var(--color-necha-green-dark);
}

.bpc-body {
  padding: 1.15rem 1.2rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.bpc-brand {
  margin: 0 0 0.25rem;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.bpc-body h3 {
  margin: 0 0 0.35rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.2;
}

.bpc-body h3 a {
  color: inherit;
  text-decoration: none;
}

.bpc-body h3 a:hover {
  color: var(--color-necha-green-dark);
}

.bpc-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
}

.bpc-stars {
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--color-necha-green);
}

.bpc-reviews {
  font-size: 10px;
  color: var(--color-muted);
}

.bpc-foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.5rem;
}

.bpc-price {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.bpc-usd {
  display: block;
  font-size: 10px;
  color: var(--color-muted);
  margin-top: 0.1rem;
}

.bpc-cart {
  flex-shrink: 0;
  width: var(--touch-min);
  height: var(--touch-min);
  border: none;
  border-radius: 50%;
  background: var(--color-black);
  color: var(--color-white);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.bpc-cart:hover {
  background: var(--color-necha-green-dark);
  transform: scale(1.05);
}
</style>
