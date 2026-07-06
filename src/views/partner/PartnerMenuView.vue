<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <div>
        <h2>Menu</h2>
        <p class="admin-muted">Food, bar and wellness menu items shown on your storefront.</p>
      </div>
    </header>

    <div v-if="loading" class="admin-loading">Loading menu…</div>
    <div v-else-if="error" class="admin-error">{{ error }}</div>
    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Kind</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th v-if="canEdit"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <template v-if="editingId === item.id">
                  <input v-model="editForm.name" class="partner-inline-input" />
                  <textarea v-model="editForm.description" rows="2" class="partner-inline-input" />
                </template>
                <template v-else>
                  {{ item.name }}
                  <br />
                  <small class="admin-muted">{{ item.description }}</small>
                </template>
              </td>
              <td>{{ item.menu_kind || '—' }}</td>
              <td>{{ item.category || '—' }}</td>
              <td>
                <input
                  v-if="editingId === item.id"
                  v-model.number="editForm.price"
                  type="number"
                  min="0"
                  class="partner-inline-input partner-inline-input--narrow"
                />
                <template v-else>{{ formatPrice(item.price, item.currency) }}</template>
              </td>
              <td>
                <label v-if="editingId === item.id" class="partner-inline-check">
                  <input v-model="editForm.is_active" type="checkbox" /> Active
                </label>
                <span v-else class="admin-badge" :class="item.is_active ? 'admin-badge--active' : 'admin-badge--inactive'">
                  {{ item.is_active ? 'Active' : 'Hidden' }}
                </span>
              </td>
              <td v-if="canEdit">
                <button
                  v-if="editingId !== item.id"
                  type="button"
                  class="admin-btn admin-btn--ghost"
                  @click="startEdit(item)"
                >
                  Edit
                </button>
                <template v-else>
                  <button type="button" class="admin-btn admin-btn--primary" :disabled="saving" @click="saveEdit(item.id)">
                    Save
                  </button>
                  <button type="button" class="admin-btn admin-btn--ghost" @click="cancelEdit">Cancel</button>
                </template>
              </td>
            </tr>
            <tr v-if="!items.length">
              <td :colspan="canEdit ? 6 : 5" class="admin-empty">No menu items yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="saveError" class="admin-error">{{ saveError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { fetchPartnerMenuItems, updatePartnerMenuItem } from '@/api/partner'
import { getApiError } from '@/api/client'
import { usePlatformSettings } from '@/composables/usePlatformSettings'
import type { AdminMenuItem } from '@/api/admin'
import { formatPrice } from '@/utils/commerce'

const { ensureLoaded, features } = usePlatformSettings()
const canEdit = computed(() => features.value.partner_products_manage_enabled)

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const saveError = ref('')
const items = ref<AdminMenuItem[]>([])
const editingId = ref('')
const editForm = reactive({
  name: '',
  description: '',
  price: 0,
  is_active: true,
})

onMounted(async () => {
  await ensureLoaded()
  try {
    items.value = await fetchPartnerMenuItems()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})

function startEdit(item: AdminMenuItem) {
  editingId.value = item.id
  editForm.name = item.name
  editForm.description = item.description
  editForm.price = item.price
  editForm.is_active = item.is_active
  saveError.value = ''
}

function cancelEdit() {
  editingId.value = ''
}

async function saveEdit(id: string) {
  saving.value = true
  saveError.value = ''
  try {
    const updated = await updatePartnerMenuItem(id, {
      name: editForm.name,
      description: editForm.description,
      price: editForm.price,
      is_active: editForm.is_active,
    })
    items.value = items.value.map((row) => (row.id === id ? updated : row))
    editingId.value = ''
  } catch (e) {
    saveError.value = getApiError(e)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.partner-inline-input {
  width: 100%;
  margin-bottom: 0.35rem;
  padding: 0.35rem 0.5rem;
  font: inherit;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 6px;
}

.partner-inline-input--narrow {
  max-width: 120px;
}

.partner-inline-check {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 12px;
}
</style>
