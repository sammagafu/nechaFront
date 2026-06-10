<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Saved</p>
      <h1 class="page-title">Favourites</h1>
      <p class="page-subtitle">{{ wishlist.count }} item(s) saved for later</p>
    </header>

    <div v-if="wishlist.items.length === 0" class="card card-elevated empty-state">
      <p>Your favourites list is empty.</p>
      <router-link to="/shop" class="btn">Browse products</router-link>
    </div>

    <div v-else class="grid grid-2">
      <article v-for="item in wishlist.items" :key="item.id" class="card wishlist-item">
        <h3>{{ item.name }}</h3>
        <p class="muted">{{ item.description }}</p>
        <p class="price">{{ formatPrice(item.price, item.currency) }}</p>
        <div class="actions">
          <button class="btn btn-sm" type="button" @click="moveToCart(item)">Add to cart</button>
          <button class="btn-link" type="button" @click="wishlist.remove(item.id)">Remove</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { formatPrice } from '@/utils/commerce'
import type { CommerceProduct } from '@/types/commerce'

const wishlist = useWishlistStore()
const cart = useCartStore()

function moveToCart(item: CommerceProduct) {
  cart.add(item)
  wishlist.remove(item.id)
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  display: grid;
  gap: 1rem;
  justify-items: center;
  padding: 3rem;
}

.wishlist-item h3 {
  margin: 0 0 0.5rem;
}

.price {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0.75rem 0;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
