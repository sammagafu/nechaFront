<template>
  <div class="admin-page">
    <div v-if="loading" class="admin-loading">Loading discovery items…</div>
    <p v-else-if="error" class="admin-error">{{ error }}</p>
    <div v-else class="admin-stack">
      <div class="admin-card">
        <div class="admin-card-head">
          <h2>Discovery Portal</h2>
          <div class="admin-actions">
            <router-link to="/admin/discovery/new" class="admin-btn admin-btn--primary">+ Add listing</router-link>
          </div>
        </div>
        <div class="admin-filters">
          <label>
            Section
            <select v-model="filterSection" @change="load">
              <option value="">All</option>
              <option value="events">Events</option>
              <option value="restaurants">Restaurants</option>
              <option value="tours">Tours</option>
            </select>
          </label>
          <label>
            Status
            <select v-model="filterStatus" @change="load">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="pending">Pending review</option>
              <option value="removed">Removed</option>
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
                <th>Section</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <strong>{{ item.name }}</strong>
                  <br><small style="color:#888780">{{ item.location || item.venue }}</small>
                </td>
                <td>{{ item.section }}</td>
                <td>{{ item.subcategory.replace(/_/g, ' ') }}</td>
                <td>
                  <span class="admin-badge" :class="statusClass(item.status)">{{ item.status }}</span>
                </td>
                <td>{{ item.is_featured ? 'Yes' : 'No' }}</td>
                <td>
                  <div class="admin-row-actions">
                    <router-link :to="`/admin/discovery/${item.id}/edit`" class="admin-btn admin-btn--ghost">Edit</router-link>
                    <button
                      v-if="item.status === 'pending'"
                      type="button"
                      class="admin-btn admin-btn--ghost"
                      @click="approve(item.id)"
                    >
                      Approve
                    </button>
                    <button
                      v-if="item.status === 'active'"
                      type="button"
                      class="admin-btn admin-btn--ghost"
                      @click="remove(item.id)"
                    >
                      Remove
                    </button>
                    <button
                      v-if="item.status === 'removed'"
                      type="button"
                      class="admin-btn admin-btn--ghost"
                      @click="restore(item.id)"
                    >
                      Restore
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="admin-empty">No discovery listings match your filters.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchAdminDiscovery, updateDiscoveryItem } from '@/api/discovery'
import { getApiError } from '@/api/client'
import type { AdminDiscoveryItem } from '@/types/discovery'

const items = ref<AdminDiscoveryItem[]>([])
const loading = ref(true)
const error = ref('')
const filterSection = ref('')
const filterStatus = ref('')

function statusClass(status: string) {
  if (status === 'active') return 'admin-badge--active'
  if (status === 'pending') return 'admin-badge--pending'
  return 'admin-badge--inactive'
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    items.value = await fetchAdminDiscovery(filterSection.value || undefined, filterStatus.value || undefined)
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function approve(id: string) {
  await updateDiscoveryItem(id, { status: 'active' })
  await load()
}

async function remove(id: string) {
  await updateDiscoveryItem(id, { status: 'removed' })
  await load()
}

async function restore(id: string) {
  await updateDiscoveryItem(id, { status: 'active' })
  await load()
}

onMounted(load)
</script>

<style scoped>
.admin-badge--pending {
  background: #fff3cd;
  color: #856404;
}
</style>
