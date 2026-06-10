<template>
  <div>
    <div class="sf-page-hero">
      <p class="breadcrumb">{{ session.hotel?.name }} / {{ activeCategoryLabel }}</p>
      <h1>Shop</h1>
      <p>Personal care, beauty &amp; wellness — delivered to your room.</p>
    </div>
    <CategoryPills
      v-model="activeCategory"
      :categories="visibleCategories"
      :products="session.products"
      style="padding-top: 16px"
    />
    <div v-if="filteredProducts.length" class="sf-product-grid" style="padding-bottom: 24px">
      <StorefrontProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :hotel-slug="session.slug"
        @add="addProduct"
      />
    </div>
    <p v-else class="category-empty">No products in this category yet.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHotelSessionStore } from '@/stores/hotelSession'
import { useCartStore } from '@/stores/cart'
import { isValidCategoryId } from '@/config/categories'
import { productCategories } from '@/config/storefront'
import { useProductCategoryFilter } from '@/composables/useProductCategories'
import StorefrontProductCard from '@/components/storefront/StorefrontProductCard.vue'
import CategoryPills from '@/components/storefront/CategoryPills.vue'
import { toCommerceProduct } from '@/utils/storefront'
import type { StorefrontProduct } from '@/types/storefront'

const route = useRoute()
const session = useHotelSessionStore()
const cart = useCartStore()

onMounted(() => {
  session.loadAllProducts()
  applyCategoryFromQuery()
})

const productsRef = computed(() => session.products)
const { activeCategory, visibleCategories, filteredProducts } = useProductCategoryFilter(productsRef)

const activeCategoryLabel = computed(() => {
  const match = productCategories.find((c) => c.id === activeCategory.value)
  return match?.label ?? 'All products'
})

watch(
  () => route.query.category,
  () => applyCategoryFromQuery(),
)

function applyCategoryFromQuery() {
  const raw = route.query.category
  const id = typeof raw === 'string' ? raw : ''
  if (id && isValidCategoryId(id)) {
    activeCategory.value = id
  }
}

function addProduct(product: StorefrontProduct) {
  if (!session.hotel) return
  cart.add(toCommerceProduct(product, session.slug, session.hotel.code))
}
</script>

<style scoped>
.category-empty {
  padding: 2rem 20px;
  text-align: center;
  font-size: 13px;
  color: var(--sf-muted);
}
</style>
