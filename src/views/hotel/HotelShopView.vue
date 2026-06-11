<template>
  <div>
    <div class="sf-page-hero">
      <p class="breadcrumb">{{ session.hotel?.name }} / {{ activeCategoryLabel }}</p>
      <h1>Shop</h1>
      <p>Personal care, beauty &amp; wellness — delivered to your room.</p>
    </div>
    <div class="shop-filter-toolbar">
      <form class="shop-filter-search" role="search" @submit.prevent>
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search products…"
          aria-label="Search products"
          autocomplete="off"
        />
        <button v-if="searchTerm" type="button" class="shop-filter-clear" @click="searchTerm = ''">
          Clear
        </button>
      </form>
      <CategoryPills
        v-model="activeCategory"
        :categories="visibleCategories"
        :products="session.products"
      />
    </div>
    <p v-if="searchTerm" class="shop-filter-count">
      {{ displayProducts.length }} {{ displayProducts.length === 1 ? 'result' : 'results' }}
    </p>
    <div v-if="displayProducts.length" class="sf-product-grid" style="padding-bottom: 24px">
      <StorefrontProductCard
        v-for="product in displayProducts"
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
import { computed, onMounted, ref, watch } from 'vue'
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

const searchTerm = ref('')

const productsRef = computed(() => session.products)
const { activeCategory, visibleCategories, filteredProducts } = useProductCategoryFilter(productsRef)

const displayProducts = computed(() => {
  const needle = searchTerm.value.trim().toLowerCase()
  if (!needle) return filteredProducts.value
  return filteredProducts.value.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      p.description.toLowerCase().includes(needle) ||
      (p.brand_name?.toLowerCase().includes(needle) ?? false),
  )
})

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
.shop-filter-toolbar {
  padding: 16px 20px 0;
}

.shop-filter-toolbar :deep(.category-pills) {
  padding-inline: 0;
}

.shop-filter-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 12px;
  padding: 0 12px;
  min-height: 40px;
  border: 0.5px solid var(--sf-warm-grey);
  border-radius: 20px;
  background: var(--sf-white);
}

.shop-filter-search input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-family: inherit;
  font-size: 13px;
  color: var(--sf-charcoal);
}

.shop-filter-search input:focus {
  outline: none;
}

.shop-filter-clear {
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  color: var(--sf-green-dark);
  cursor: pointer;
}

.shop-filter-count {
  margin: 0;
  padding: 0 20px 8px;
  font-size: 11px;
  color: var(--sf-muted);
}

.category-empty {
  padding: 2rem 20px;
  text-align: center;
  font-size: 13px;
  color: var(--sf-muted);
}
</style>
