<template>
  <div class="admin-page">
    <header class="admin-page-head">
      <h1>Central catalogue</h1>
      <p>Shared catalogue items exposed to partner hotels via property visibility rules.</p>
    </header>

    <details class="admin-card admin-form" :open="!suppliers.length">
      <summary class="admin-card-head admin-details-summary">
        <h2>Suppliers</h2>
        <span class="admin-muted">{{ suppliers.length }} registered</span>
      </summary>
      <form class="admin-supplier-form" @submit.prevent="submitSupplier">
        <p class="admin-page-lead">Catalogue items need a supplier (brand, tour operator, etc.).</p>
        <p v-if="supplierError" class="admin-error">{{ supplierError }}</p>
        <div class="admin-form-row">
          <label>Type *
            <select v-model="supplierForm.supplier_type" required>
              <option value="brand">Brand</option>
              <option value="tour_operator">Tour operator</option>
              <option value="event_organiser">Event organiser</option>
              <option value="external_spa_provider">External spa provider</option>
              <option value="property">Property (in-house)</option>
            </select>
          </label>
          <label>Name *<input v-model="supplierForm.name" required /></label>
        </div>
        <div class="admin-form-row">
          <label>Phone<input v-model="supplierForm.contact_phone" /></label>
          <label>Email<input v-model="supplierForm.contact_email" type="email" /></label>
        </div>
        <button type="submit" class="admin-btn admin-btn--primary" :disabled="supplierSaving">
          {{ supplierSaving ? 'Saving…' : 'Add supplier' }}
        </button>
      </form>
      <ul v-if="suppliers.length" class="admin-supplier-list">
        <li v-for="s in suppliers" :key="s.id">
          <strong>{{ s.name }}</strong>
          <span class="admin-muted">{{ s.supplier_type }}</span>
        </li>
      </ul>
    </details>

    <form class="admin-card admin-form" @submit.prevent="submit">
      <h2>{{ editingId ? 'Edit catalogue item' : 'Add catalogue item' }}</h2>
      <p v-if="formError" class="admin-error">{{ formError }}</p>
      <div class="admin-form-row">
        <label>Supplier *
          <select v-model="form.supplier_id" required :disabled="!!editingId">
            <option value="">Select supplier</option>
            <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }} ({{ s.supplier_type }})</option>
          </select>
        </label>
        <label>Category *
          <select v-model="form.category" required>
            <option value="product">Product</option>
            <option value="tour">Tour</option>
            <option value="event">Event</option>
            <option value="dining_experience">Dining (external)</option>
            <option value="spa_service">Spa (external)</option>
          </select>
        </label>
      </div>
      <label>Name *<input v-model="form.name" required /></label>
      <label>Description<textarea v-model="form.description" rows="2" /></label>
      <div class="admin-form-row">
        <label>Base price (TZS)<input v-model.number="form.base_price" type="number" min="0" required /></label>
        <label>Capacity / stock<input v-model.number="form.capacity_or_stock" type="number" min="0" /></label>
      </div>
      <div class="admin-form-row">
        <label>Event date (tours/events)<input v-model="form.event_date" type="date" /></label>
        <label style="flex-direction: row; align-items: center; gap: 0.5rem; margin-top: 1.5rem">
          <input v-model="form.is_digital" type="checkbox" /> Digital delivery
        </label>
      </div>
      <label v-if="editingId" style="flex-direction: row; align-items: center; gap: 0.5rem">
        <input v-model="form.is_active" type="checkbox" /> Active
      </label>
      <div class="admin-actions">
        <button type="submit" class="admin-btn admin-btn--primary" :disabled="saving || !suppliers.length">
          {{ saving ? 'Saving…' : editingId ? 'Update' : 'Create' }}
        </button>
        <button v-if="editingId" type="button" class="admin-btn admin-btn--ghost" @click="resetForm">Cancel</button>
      </div>
    </form>

    <div class="admin-card">
      <div class="admin-card-head">
        <h2>All items</h2>
        <button type="button" class="admin-btn admin-btn--ghost" @click="load">Refresh</button>
      </div>
      <p v-if="error" class="admin-error">{{ error }}</p>
      <div v-if="loading" class="admin-empty">Loading…</div>
      <div v-else-if="items.length" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <strong>{{ item.name }}</strong>
                <br /><small>{{ supplierName(item.supplier_id) }}</small>
              </td>
              <td>{{ item.category }}</td>
              <td>{{ formatPrice(item.base_price, item.currency || 'TZS') }}</td>
              <td>{{ item.capacity_or_stock || '—' }}</td>
              <td>
                <span class="admin-badge" :class="item.is_active ? 'admin-badge--active' : 'admin-badge--inactive'">
                  {{ item.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="admin-actions">
                <button type="button" class="admin-btn admin-btn--ghost" @click="startEdit(item)">Edit</button>
                <button type="button" class="admin-btn admin-btn--ghost" @click="openVisibility(item)">Visibility</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="admin-empty">No catalogue items yet.</p>
    </div>

    <div v-if="visibilityItem" class="admin-modal-backdrop" @click.self="visibilityItem = null">
      <form class="admin-card admin-form admin-modal" @submit.prevent="submitVisibility">
        <h2>Property visibility</h2>
        <p>Show <strong>{{ visibilityItem.name }}</strong> on a hotel storefront.</p>
        <p v-if="visibilityError" class="admin-error">{{ visibilityError }}</p>
        <label>Hotel *
          <select v-model="visibilityForm.hotel_id" required>
            <option value="">Select hotel</option>
            <option v-for="h in hotels" :key="h.id" :value="h.id">{{ h.name }}</option>
          </select>
        </label>
        <label style="flex-direction: row; align-items: center; gap: 0.5rem">
          <input v-model="visibilityForm.is_visible" type="checkbox" /> Visible on storefront
        </label>
        <label>Price override (TZS, optional)<input v-model.number="visibilityForm.price_override" type="number" min="0" /></label>
        <div class="admin-actions">
          <button type="submit" class="admin-btn admin-btn--primary" :disabled="visibilitySaving">Save</button>
          <button type="button" class="admin-btn admin-btn--ghost" @click="visibilityItem = null">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { fetchHotels } from '@/api/admin'
import {
  createCatalogueItem,
  createSupplier,
  fetchCatalogue,
  fetchSuppliers,
  setCatalogueVisibility,
  updateCatalogueItem,
} from '@/api/commerce'
import { getApiError } from '@/api/client'
import type { AdminHotel } from '@/types/auth'
import type { CatalogueItem, Supplier } from '@/types/commerce'
import { formatPrice } from '@/utils/commerce'

const items = ref<CatalogueItem[]>([])
const suppliers = ref<Supplier[]>([])
const hotels = ref<AdminHotel[]>([])
const loading = ref(true)
const saving = ref(false)
const supplierSaving = ref(false)
const error = ref('')
const formError = ref('')
const supplierError = ref('')
const editingId = ref('')

const visibilityItem = ref<CatalogueItem | null>(null)
const visibilitySaving = ref(false)
const visibilityError = ref('')
const visibilityForm = reactive({
  hotel_id: '',
  is_visible: true,
  price_override: undefined as number | undefined,
})

const supplierForm = reactive({
  supplier_type: 'brand',
  name: '',
  contact_phone: '',
  contact_email: '',
})

const form = reactive({
  supplier_id: '',
  category: 'product',
  name: '',
  description: '',
  base_price: 0,
  capacity_or_stock: 0,
  is_digital: false,
  event_date: '',
  is_active: true,
})

function supplierName(id: string) {
  return suppliers.value.find((s) => s.id === id)?.name || id.slice(0, 8)
}

function resetForm() {
  editingId.value = ''
  form.supplier_id = suppliers.value[0]?.id || ''
  form.category = 'product'
  form.name = ''
  form.description = ''
  form.base_price = 0
  form.capacity_or_stock = 0
  form.is_digital = false
  form.event_date = ''
  form.is_active = true
  formError.value = ''
}

function startEdit(item: CatalogueItem) {
  editingId.value = item.id
  form.supplier_id = item.supplier_id
  form.category = item.category
  form.name = item.name
  form.description = item.description
  form.base_price = item.base_price
  form.capacity_or_stock = item.capacity_or_stock
  form.is_digital = item.is_digital
  form.event_date = item.event_date ? item.event_date.slice(0, 10) : ''
  form.is_active = item.is_active
  formError.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openVisibility(item: CatalogueItem) {
  visibilityItem.value = item
  visibilityForm.hotel_id = hotels.value[0]?.id || ''
  visibilityForm.is_visible = true
  visibilityForm.price_override = undefined
  visibilityError.value = ''
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [catalogue, supplierList, hotelList] = await Promise.all([
      fetchCatalogue(),
      fetchSuppliers(),
      fetchHotels(),
    ])
    items.value = catalogue
    suppliers.value = supplierList
    hotels.value = hotelList
    if (!form.supplier_id && supplierList.length) {
      form.supplier_id = supplierList[0].id
    }
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function submitSupplier() {
  supplierSaving.value = true
  supplierError.value = ''
  try {
    await createSupplier({
      supplier_type: supplierForm.supplier_type,
      name: supplierForm.name,
      contact_phone: supplierForm.contact_phone,
      contact_email: supplierForm.contact_email,
    })
    supplierForm.name = ''
    supplierForm.contact_phone = ''
    supplierForm.contact_email = ''
    await load()
  } catch (e) {
    supplierError.value = getApiError(e)
  } finally {
    supplierSaving.value = false
  }
}

async function submit() {
  saving.value = true
  formError.value = ''
  try {
    if (editingId.value) {
      await updateCatalogueItem(editingId.value, {
        name: form.name,
        description: form.description,
        base_price: form.base_price,
        capacity_or_stock: form.capacity_or_stock,
        is_digital: form.is_digital,
        is_active: form.is_active,
      })
    } else {
      await createCatalogueItem({
        supplier_id: form.supplier_id,
        category: form.category,
        name: form.name,
        description: form.description,
        currency: 'TZS',
        base_price: form.base_price,
        capacity_or_stock: form.capacity_or_stock,
        is_digital: form.is_digital,
        event_date: form.event_date || undefined,
      })
    }
    resetForm()
    await load()
  } catch (e) {
    formError.value = getApiError(e)
  } finally {
    saving.value = false
  }
}

async function submitVisibility() {
  if (!visibilityItem.value) return
  visibilitySaving.value = true
  visibilityError.value = ''
  try {
    await setCatalogueVisibility(visibilityItem.value.id, {
      hotel_id: visibilityForm.hotel_id,
      is_visible: visibilityForm.is_visible,
      price_override: visibilityForm.price_override || undefined,
    })
    visibilityItem.value = null
  } catch (e) {
    visibilityError.value = getApiError(e)
  } finally {
    visibilitySaving.value = false
  }
}

onMounted(() => void load())
</script>

<style scoped>
.admin-page-lead {
  margin: 0 0 1rem;
  font-size: 14px;
  color: var(--color-muted);
}

.admin-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.45);
}

.admin-modal {
  width: 100%;
  max-width: 420px;
  margin: 0;
}

.admin-details-summary {
  cursor: pointer;
  list-style: none;
}

.admin-details-summary::-webkit-details-marker {
  display: none;
}

.admin-supplier-form {
  margin-top: 1rem;
}

.admin-supplier-list {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.admin-supplier-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-top: 1px solid var(--admin-border, #e8e6e3);
  font-size: 14px;
}
</style>
