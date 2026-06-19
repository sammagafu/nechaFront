<template>
  <div class="admin-page">
    <div v-if="loading" class="admin-loading">Loading products…</div>
    <p v-else-if="error" class="admin-error">{{ error }}</p>
    <div v-else class="admin-stack">
      <div class="admin-card">
        <div class="admin-card-head">
          <h2>{{ hotelName }} — Products</h2>
          <div class="admin-actions">
            <router-link :to="`/admin/hotels/${hotelId}/products/new`" class="admin-btn admin-btn--primary">+ Add product</router-link>
            <router-link :to="`/admin/import/${hotelId}`" class="admin-btn admin-btn--ghost">Import CSV</router-link>
            <router-link to="/admin/hotels" class="admin-btn admin-btn--ghost">Hotels</router-link>
          </div>
        </div>
      </div>
      <div class="admin-card">
        <div v-if="products.length" class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p.id">
                <td><strong>{{ p.name }}</strong><br><small style="color:#888780">{{ p.brand_name }}</small></td>
                <td>{{ p.category.replace(/_/g, ' ') }}</td>
                <td>{{ p.currency }} {{ p.price.toLocaleString() }}</td>
                <td>{{ p.stock }}</td>
                <td>{{ p.is_featured ? 'Yes' : 'No' }}</td>
                <td>
                  <span class="admin-badge" :class="p.is_active ? 'admin-badge--active' : 'admin-badge--inactive'">
                    {{ p.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <router-link :to="`/admin/hotels/${hotelId}/products/${p.id}/edit`" class="admin-btn admin-btn--ghost">Edit</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="admin-empty">No products for this hotel.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchHotel, fetchProducts } from '@/api/admin'
import { getApiError } from '@/api/client'
import type { AdminProduct } from '@/types/auth'

const route = useRoute()
const hotelId = route.params.hotelId as string
const hotelName = ref('')
const products = ref<AdminProduct[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const [hotel, list] = await Promise.all([fetchHotel(hotelId), fetchProducts(hotelId)])
    hotelName.value = hotel.name
    products.value = list
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
