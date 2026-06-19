<template>
  <component
    :is="to ? 'router-link' : 'article'"
    :to="to"
    class="product-card premium-card premium-card--flat"
    :class="{ 'product-card--link': !!to, 'product-card--list': layout === 'list' }"
  >
    <div class="product-media">
      <div v-if="product.imageUrl" class="product-image-wrap">
        <img :src="product.imageUrl" :alt="product.name" class="product-image" loading="lazy" />
      </div>
      <div v-else class="product-image-placeholder" aria-hidden="true">
        <Icon name="sparkles" :size="32" />
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

const props = withDefaults(
  defineProps<{
    product: CommerceProduct
    to?: string
    layout?: 'grid' | 'list'
  }>(),
  { layout: 'grid' },
)

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

