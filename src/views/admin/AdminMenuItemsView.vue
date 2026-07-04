<template>
  <div class="admin-page">
    <div v-if="loading" class="admin-loading">Loading menu…</div>
    <p v-else-if="error" class="admin-error">{{ error }}</p>
    <div v-else class="admin-stack">
      <div class="admin-card">
        <div class="admin-card-head">
          <h2>{{ hotelName }} — Menu items</h2>
          <div class="admin-actions">
            <router-link :to="`/admin/hotels/${hotelId}/menu/new`" class="admin-btn admin-btn--primary">+ Add item</router-link>
            <router-link :to="`/admin/import/${hotelId}`" class="admin-btn admin-btn--ghost">Import CSV</router-link>
            <router-link to="/admin/hotels" class="admin-btn admin-btn--ghost">Hotels</router-link>
          </div>
        </div>
        <div class="admin-form-row" style="margin-top: 1rem">
          <label>
            Filter by kind
            <select v-model="kindFilter" @change="load">
              <option value="">All</option>
              <option value="food">Food & drinks</option>
              <option value="wellness">Wellness</option>
            </select>
          </label>
        </div>
      </div>
      <div class="admin-card">
        <div v-if="items.length" class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Kind</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <strong>{{ item.name }}</strong>
                  <br><small style="color:#888780">{{ item.slug }}</small>
                </td>
                <td>{{ item.category }}</td>
                <td>{{ item.menu_kind }}</td>
                <td>{{ item.currency }} {{ item.price.toLocaleString() }}</td>
                <td>
                  <span class="admin-badge" :class="item.is_active ? 'admin-badge--active' : 'admin-badge--inactive'">
                    {{ item.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="admin-actions">
                  <router-link :to="`/admin/hotels/${hotelId}/menu/${item.id}/edit`" class="admin-btn admin-btn--ghost">Edit</router-link>
                  <button type="button" class="admin-btn admin-btn--ghost" @click="remove(item.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="admin-empty">No menu items for this hotel.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { deleteMenuItem, fetchHotel, fetchMenuItems, type AdminMenuItem } from '@/api/admin'
import { getApiError } from '@/api/client'

const route = useRoute()
const hotelId = route.params.hotelId as string
const items = ref<AdminMenuItem[]>([])
const hotelName = ref('')
const kindFilter = ref('')
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [hotel, menu] = await Promise.all([
      fetchHotel(hotelId),
      fetchMenuItems(hotelId, kindFilter.value || undefined),
    ])
    hotelName.value = hotel.name
    items.value = menu
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function remove(id: string) {
  if (!window.confirm('Delete this menu item?')) return
  try {
    await deleteMenuItem(id)
    items.value = items.value.filter((item) => item.id !== id)
  } catch (e) {
    error.value = getApiError(e)
  }
}

onMounted(load)
</script>
