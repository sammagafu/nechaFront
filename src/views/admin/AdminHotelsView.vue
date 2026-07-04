<template>
  <div v-if="loading" class="admin-loading">Loading hotels…</div>
  <p v-else-if="error" class="admin-error">{{ error }}</p>
  <div v-else class="admin-page">
    <div class="admin-card">
    <div class="admin-card-head">
      <h2>All hotels</h2>
      <router-link to="/admin/hotels/new" class="admin-btn admin-btn--primary">+ Add hotel</router-link>
    </div>
    <div v-if="hotels.length" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Slug</th>
            <th>Products</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hotel in hotels" :key="hotel.id">
            <td><strong>{{ hotel.name }}</strong></td>
            <td>{{ hotel.code }}</td>
            <td>{{ hotel.slug }}</td>
            <td>{{ hotel.product_count }}</td>
            <td>
              <span class="admin-badge" :class="hotel.is_active ? 'admin-badge--active' : 'admin-badge--inactive'">
                {{ hotel.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="admin-actions">
              <router-link :to="`/admin/hotels/${hotel.id}/edit`" class="admin-btn admin-btn--ghost">Edit</router-link>
              <router-link :to="`/admin/hotels/${hotel.id}/products`" class="admin-btn admin-btn--ghost">Products</router-link>
              <router-link :to="`/admin/hotels/${hotel.id}/menu`" class="admin-btn admin-btn--ghost">Menu</router-link>
              <router-link :to="`/admin/import/${hotel.id}`" class="admin-btn admin-btn--ghost">Import CSV</router-link>
              <a :href="hotelEntryUrl(hotel.referral_code || hotel.code, hotel.slug, 'room')" class="admin-btn admin-btn--ghost" target="_blank" rel="noopener">Room QR</a>
              <a :href="hotelEntryUrl(hotel.referral_code || hotel.code, hotel.slug, 'poster')" class="admin-btn admin-btn--ghost" target="_blank" rel="noopener">Poster QR</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="admin-empty">No hotels yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchHotels } from '@/api/admin'
import { getApiError } from '@/api/client'
import { hotelEntryUrl } from '@/config/app'
import type { AdminHotel } from '@/types/auth'

const hotels = ref<AdminHotel[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    hotels.value = await fetchHotels()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>
