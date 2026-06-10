<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Dining</p>
      <h1 class="page-title">Reserve a table</h1>
      <p class="page-subtitle">Book dining at {{ hotel?.name || 'this hotel' }}.</p>
    </header>

    <form class="card card-elevated form-card" @submit.prevent="submit">
      <div class="grid grid-2">
        <div class="field">
          <label>Full name</label>
          <input v-model="form.guest_name" required />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="form.guest_email" type="email" required />
        </div>
        <div class="field">
          <label>Phone</label>
          <input v-model="form.guest_phone" required />
        </div>
        <div class="field">
          <label>Date & time</label>
          <input v-model="form.reservation_date" type="datetime-local" required />
        </div>
        <div class="field">
          <label>Party size</label>
          <input v-model.number="form.party_size" type="number" min="1" required />
        </div>
        <div class="field">
          <label>Preferred table (optional)</label>
          <input v-model="form.table_number" />
        </div>
      </div>
      <div class="field">
        <label>Special requests</label>
        <textarea v-model="form.special_requests" rows="3" />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn" type="submit" :disabled="submitting">
        {{ submitting ? 'Reserving...' : 'Reserve table' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createTableReservation } from '@/api/reservations'
import { getApiError } from '@/api/client'
import { useHotelStore } from '@/stores/hotel'

const route = useRoute()
const router = useRouter()
const hotelStore = useHotelStore()

const code = computed(() => String(route.params.code))
const hotel = computed(() => hotelStore.currentHotel)
const submitting = ref(false)
const error = ref('')

const form = reactive({
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  reservation_date: '',
  party_size: 2,
  table_number: '',
  special_requests: '',
})

onMounted(async () => {
  if (!hotelStore.currentHotel || hotelStore.hotelCode !== code.value) {
    await hotelStore.loadHotel(code.value)
  }
})

function toRFC3339(local: string) {
  return new Date(local).toISOString()
}

async function submit() {
  submitting.value = true
  error.value = ''
  try {
    const reservation = await createTableReservation({
      hotel_code: code.value,
      guest_name: form.guest_name,
      guest_email: form.guest_email,
      guest_phone: form.guest_phone,
      reservation_date: toRFC3339(form.reservation_date),
      party_size: form.party_size,
      table_number: form.table_number || undefined,
      special_requests: form.special_requests || undefined,
    })
    router.push(`/reservations/${reservation.id}`)
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-card {
  display: grid;
  gap: 1rem;
}
</style>
