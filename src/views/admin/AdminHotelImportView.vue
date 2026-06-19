<template>
  <div class="admin-page">
    <header class="admin-page-intro">
      <h2>Import hotel data</h2>
      <p>Upload CSV files to bulk-add rooms, shop/menu categories, and in-room dining menu items.</p>
    </header>

    <div class="admin-card admin-card-body admin-import-picker">
      <label>
        Partner hotel
        <select v-model="hotelId" :disabled="hotelsLoading" @change="onHotelChange">
          <option value="">Select a hotel…</option>
          <option v-for="hotel in hotels" :key="hotel.id" :value="hotel.id">
            {{ hotel.name }}
          </option>
        </select>
      </label>
    </div>

    <p v-if="!hotelId" class="admin-empty admin-card admin-card-body">
      Choose a hotel to import rooms, categories, or menu items.
    </p>

    <div v-else class="admin-import-grid">
      <section v-for="section in sections" :key="section.kind" class="admin-card admin-import-card">
        <div class="admin-card-head">
          <h2>{{ section.title }}</h2>
        </div>
        <div class="admin-card-body">
          <p class="admin-import-desc">{{ section.description }}</p>
          <p class="admin-import-columns"><strong>Columns:</strong> {{ section.columns }}</p>
          <div class="admin-import-actions">
            <a :href="section.templateUrl" download class="admin-btn admin-btn--ghost">
              Download template
            </a>
            <label class="admin-btn admin-btn--primary admin-import-upload">
              {{ uploading === section.kind ? 'Uploading…' : 'Upload CSV' }}
              <input
                type="file"
                accept=".csv,text/csv"
                :disabled="uploading !== null"
                @change="onFile(section.kind, $event)"
              >
            </label>
          </div>
          <p v-if="results[section.kind]" class="admin-import-result">
            {{ formatResult(results[section.kind]!) }}
          </p>
          <ul v-if="results[section.kind]?.errors?.length" class="admin-import-errors">
            <li v-for="(rowError, index) in results[section.kind]!.errors" :key="index">
              {{ rowError }}
            </li>
          </ul>
        </div>
      </section>
    </div>

    <p v-if="error" class="admin-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchHotels, importHotelCSV } from '@/api/admin'
import { getApiError } from '@/api/client'
import type { AdminHotel, ImportResult } from '@/types/auth'

const route = useRoute()
const router = useRouter()

const hotels = ref<AdminHotel[]>([])
const hotelsLoading = ref(true)
const hotelId = ref('')
const uploading = ref<string | null>(null)
const error = ref('')
const results = reactive<Record<string, ImportResult | null>>({
  rooms: null,
  categories: null,
  menu: null,
})

const sections = [
  {
    kind: 'rooms',
    title: 'Rooms',
    description: 'Guest room numbers for checkout and delivery.',
    columns: 'room_number, room_type, floor, notes, is_active',
    templateUrl: '/templates/necha-import-rooms.template.csv',
  },
  {
    kind: 'categories',
    title: 'Categories',
    description: 'Shop categories (product) and food menu tabs (menu). Import categories before menu items.',
    columns: 'slug, label, kind, sort_order, is_active',
    templateUrl: '/templates/necha-import-categories.template.csv',
  },
  {
    kind: 'menu',
    title: 'Menu items',
    description: 'In-room dining / room service items linked to menu categories.',
    columns: 'category, slug, name, description, price, currency, tag, sort_order, is_active',
    templateUrl: '/templates/necha-import-menu.template.csv',
  },
] as const

onMounted(async () => {
  try {
    hotels.value = await fetchHotels()
    const fromRoute = route.params.hotelId as string | undefined
    if (fromRoute && hotels.value.some((h) => h.id === fromRoute)) {
      hotelId.value = fromRoute
    }
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    hotelsLoading.value = false
  }
})

watch(hotelId, (id) => {
  if (id) {
    router.replace({ name: 'admin-hotel-import', params: { hotelId: id } })
  } else if (route.params.hotelId) {
    router.replace({ name: 'admin-hotel-import' })
  }
})

function onHotelChange() {
  results.rooms = null
  results.categories = null
  results.menu = null
  error.value = ''
}

async function onFile(kind: 'rooms' | 'categories' | 'menu', event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !hotelId.value) return

  uploading.value = kind
  error.value = ''
  try {
    results[kind] = await importHotelCSV(hotelId.value, kind, file)
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    uploading.value = null
  }
}

function formatResult(result: ImportResult) {
  const parts = [
    `${result.created} created`,
    `${result.updated} updated`,
    `${result.skipped} skipped`,
  ]
  if (result.errors?.length) {
    parts.push(`${result.errors.length} row errors`)
  }
  return parts.join(' · ')
}
</script>

<style scoped>
.admin-import-picker label {
  display: grid;
  gap: 0.35rem;
  max-width: 420px;
  font-size: 13px;
  font-weight: 600;
}

.admin-import-picker select {
  font: inherit;
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.admin-import-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 900px) {
  .admin-import-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.admin-import-desc,
.admin-import-columns {
  margin: 0 0 0.75rem;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.45;
}

.admin-import-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.admin-import-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.admin-import-upload input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.admin-import-result {
  margin: 0.85rem 0 0;
  font-size: 12px;
  color: var(--color-necha-green-dark);
}

.admin-import-errors {
  margin: 0.5rem 0 0;
  padding-left: 1.1rem;
  font-size: 12px;
  color: #b42318;
}
</style>
