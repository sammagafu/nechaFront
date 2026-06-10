<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Reservations</p>
      <h1 class="page-title">Reserve a room</h1>
      <p class="page-subtitle">Book your stay at {{ hotel?.name || 'this hotel' }}.</p>
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
          <label>Room type</label>
          <select v-model="form.room_type" required>
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
          </select>
        </div>
        <div class="field">
          <label>Check-in</label>
          <input v-model="form.check_in" type="date" required />
        </div>
        <div class="field">
          <label>Check-out</label>
          <input v-model="form.check_out" type="date" required />
        </div>
        <div class="field">
          <label>Guests</label>
          <input v-model.number="form.guest_count" type="number" min="1" required />
        </div>
      </div>
      <div class="field">
        <label>Special requests</label>
        <textarea v-model="form.special_requests" rows="3" />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn" type="submit" :disabled="submitting">
        {{ submitting ? 'Reserving...' : 'Reserve room' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createHotelReservation } from '@/api/reservations'
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
  check_in: '',
  check_out: '',
  room_type: 'standard',
  guest_count: 1,
  special_requests: '',
})

onMounted(async () => {
  if (!hotelStore.currentHotel || hotelStore.hotelCode !== code.value) {
    await hotelStore.loadHotel(code.value)
  }
})

async function submit() {
  submitting.value = true
  error.value = ''
  try {
    const reservation = await createHotelReservation({
      hotel_code: code.value,
      ...form,
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
