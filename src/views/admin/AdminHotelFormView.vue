<template>
  <form class="admin-form admin-card" @submit.prevent="submit">
    <p v-if="error" class="admin-error">{{ error }}</p>
    <div class="admin-form-row">
      <label>Name *<input v-model="form.name" required /></label>
      <label>Code *<input v-model="form.code" required /></label>
    </div>
    <div class="admin-form-row">
      <label>Slug *<input v-model="form.slug" required placeholder="sea-cliff" /></label>
      <label>Referral code<input v-model="form.referral_code" /></label>
    </div>
    <div class="admin-form-row">
      <label>City<input v-model="form.city" /></label>
      <label>Location<input v-model="form.location" placeholder="Masaki" /></label>
    </div>
    <div class="admin-form-row">
      <label>Zone<input v-model="form.zone" placeholder="E" /></label>
      <label>Phone<input v-model="form.phone" /></label>
    </div>
    <label>Address<input v-model="form.address" /></label>
    <label>Description<textarea v-model="form.description" rows="3" /></label>
    <div class="admin-form-row">
      <label>Initials<input v-model="form.initials" maxlength="3" /></label>
      <label>Logo URL<input v-model="form.logo_url" /></label>
    </div>
    <label>Services (comma-separated)
      <input v-model="servicesText" placeholder="spa, restaurant, bar, gym, discover" />
    </label>
    <label>Kkooapp ID<input v-model="form.kkooapp_id" /></label>
    <label style="flex-direction: row; align-items: center; gap: 0.5rem">
      <input v-model="form.is_verified" type="checkbox" /> Verified partner
    </label>
    <label v-if="isEdit" style="flex-direction: row; align-items: center; gap: 0.5rem">
      <input v-model="form.is_active" type="checkbox" /> Active
    </label>
    <div class="admin-actions">
      <button type="submit" class="admin-btn admin-btn--primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save hotel' }}</button>
      <router-link to="/admin/hotels" class="admin-btn admin-btn--ghost">Cancel</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createHotel, fetchHotel, updateHotel } from '@/api/admin'
import { getApiError } from '@/api/client'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const error = ref('')

const form = reactive({
  name: '', code: '', slug: '', referral_code: '', city: 'Dar es Salaam', location: '',
  country: 'Tanzania', zone: '', phone: '', address: '', description: '', initials: '',
  logo_url: '', kkooapp_id: '', is_verified: true, is_active: true,
})

const servicesText = ref('spa, restaurant, bar, gym, discover')

onMounted(async () => {
  if (!isEdit.value) return
  const hotel = await fetchHotel(route.params.id as string)
  Object.assign(form, hotel)
  servicesText.value = hotel.services?.join(', ') || ''
})

async function submit() {
  saving.value = true
  error.value = ''
  const payload = {
    ...form,
    services: servicesText.value.split(',').map((s) => s.trim()).filter(Boolean),
  }
  try {
    if (isEdit.value) {
      await updateHotel(route.params.id as string, payload)
    } else {
      await createHotel(payload)
    }
    router.push('/admin/hotels')
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    saving.value = false
  }
}
</script>
