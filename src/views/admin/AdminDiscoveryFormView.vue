<template>
  <form class="admin-form admin-card" @submit.prevent="submit">
    <p v-if="error" class="admin-error">{{ error }}</p>
    <div class="admin-form-row">
      <label>
        Section *
        <select v-model="form.section" required>
          <option value="events">Events</option>
          <option value="restaurants">Restaurants</option>
          <option value="tours">Tours & experiences</option>
        </select>
      </label>
      <label>
        Subcategory
        <select v-model="form.subcategory">
          <option value="">—</option>
          <option v-for="cat in subcategories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
        </select>
      </label>
    </div>
    <div class="admin-form-row">
      <label>Name *<input v-model="form.name" required /></label>
      <label>Slug<input v-model="form.slug" placeholder="auto-generated if empty" /></label>
    </div>
    <label>Description<textarea v-model="form.description" rows="3" /></label>
    <div class="admin-form-row">
      <label>Venue<input v-model="form.venue" /></label>
      <label>Location<input v-model="form.location" placeholder="Masaki, City Centre…" /></label>
    </div>
    <div class="admin-form-row">
      <label>Distance<input v-model="form.distance" placeholder="1.2km" /></label>
      <label>Price hint<input v-model="form.price_hint" placeholder="From TZS 50,000" /></label>
    </div>
    <div class="admin-form-row">
      <label>Phone<input v-model="form.phone" /></label>
      <label>Website<input v-model="form.website" type="url" /></label>
    </div>
    <template v-if="form.section === 'events'">
      <div class="admin-form-row">
        <label>Event starts<input v-model="form.event_starts_at" type="datetime-local" /></label>
        <label>Event ends<input v-model="form.event_ends_at" type="datetime-local" /></label>
      </div>
      <div class="admin-form-row">
        <label>Ticket URL<input v-model="form.ticket_url" type="url" /></label>
        <label>
          Ticket mode
          <select v-model="form.ticket_mode">
            <option value="none">None</option>
            <option value="referral">Referral link</option>
            <option value="platform">Platform ticketing</option>
          </select>
        </label>
      </div>
      <div class="admin-form-row">
        <label>Organiser name<input v-model="form.organizer_name" /></label>
        <label>Organiser email<input v-model="form.organizer_email" type="email" /></label>
      </div>
    </template>
    <label>Image URL<input v-model="form.image_url" /></label>
    <div class="admin-form-row">
      <label>
        Status
        <select v-model="form.status">
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="removed">Removed</option>
        </select>
      </label>
      <label>Sort order<input v-model.number="form.sort_order" type="number" min="0" /></label>
    </div>
    <label style="flex-direction: row; align-items: center; gap: 0.5rem">
      <input v-model="form.is_featured" type="checkbox" /> Featured listing
    </label>
    <div class="admin-actions">
      <button type="submit" class="admin-btn admin-btn--primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save listing' }}</button>
      <router-link to="/admin/discovery" class="admin-btn admin-btn--ghost">Cancel</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createDiscoveryItem, fetchAdminDiscoveryItem, updateDiscoveryItem } from '@/api/discovery'
import { eventSubcategories, restaurantSubcategories, tourSubcategories } from '@/config/discovery'
import { getApiError } from '@/api/client'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const error = ref('')

const form = reactive({
  section: 'events',
  subcategory: '',
  slug: '',
  name: '',
  description: '',
  venue: '',
  location: '',
  distance: '',
  phone: '',
  website: '',
  price_hint: '',
  image_url: '',
  event_starts_at: '',
  event_ends_at: '',
  ticket_url: '',
  ticket_mode: 'none',
  organizer_name: '',
  organizer_email: '',
  is_featured: false,
  status: 'active' as 'active' | 'pending' | 'removed',
  sort_order: 0,
})

const subcategories = computed(() => {
  if (form.section === 'restaurants') return restaurantSubcategories
  if (form.section === 'tours') return tourSubcategories
  return eventSubcategories
})

function toLocalInput(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toIso(local: string) {
  return local ? new Date(local).toISOString() : ''
}

onMounted(async () => {
  if (!isEdit.value) return
  const item = await fetchAdminDiscoveryItem(route.params.id as string)
  Object.assign(form, {
    ...item,
    event_starts_at: toLocalInput(item.event_starts_at),
    event_ends_at: toLocalInput(item.event_ends_at),
  })
})

async function submit() {
  saving.value = true
  error.value = ''
  const payload = {
    ...form,
    event_starts_at: form.section === 'events' ? toIso(form.event_starts_at) : undefined,
    event_ends_at: form.section === 'events' && form.event_ends_at ? toIso(form.event_ends_at) : undefined,
  }
  try {
    if (isEdit.value) {
      await updateDiscoveryItem(route.params.id as string, payload)
    } else {
      await createDiscoveryItem(payload)
    }
    router.push('/admin/discovery')
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    saving.value = false
  }
}
</script>
