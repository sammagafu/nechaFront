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

    <div v-else class="product-grid">
      <ProductCard
        v-for="item in wishlist.items"
        :key="item.id"
        :product="item"
        :to="item.slug ? productPath(item.slug) : undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
import { productPath } from '@/config/app'
import { useWishlistStore } from '@/stores/wishlist'

const wishlist = useWishlistStore()
</script>

<style scoped>
.empty-state {
  text-align: center;
  display: grid;
  gap: 1rem;
  justify-items: center;
  padding: 3rem;
}
</style>
