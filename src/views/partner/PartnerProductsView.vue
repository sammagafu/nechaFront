<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <div>
        <h2>Products</h2>
        <p class="admin-muted">Your storefront catalogue. Contact Necha to add or update products.</p>
      </div>
    </header>

    <div v-if="loading" class="admin-loading">Loading products…</div>
    <div v-else-if="error" class="admin-error">{{ error }}</div>
    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.brand_name || '—' }}</td>
              <td>{{ product.category || '—' }}</td>
              <td>{{ formatPrice(product.price, product.currency) }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <span class="admin-badge" :class="product.is_active ? 'admin-badge--active' : 'admin-badge--inactive'">
                  {{ product.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
            <tr v-if="!products.length">
              <td colspan="6" class="admin-empty">No products yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPartnerProducts } from '@/api/partner'
import { getApiError } from '@/api/client'
import type { AdminProduct } from '@/types/auth'
import { formatPrice } from '@/utils/commerce'

const products = ref<AdminProduct[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    products.value = await fetchPartnerProducts()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
