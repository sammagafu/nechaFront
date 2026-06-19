<template>
  <div>
    <StorefrontPageHero
      :badge="title"
      :title="title"
      :description="subtitle"
    />
    <form class="checkout-section service-form" @submit.prevent="submit">
      <div class="checkout-label">Book with {{ session.hotel?.name }}</div>
      <div class="sf-form-fields">
        <input v-model="name" placeholder="Full name *" required />
        <input v-model="email" type="email" placeholder="Email *" required />
        <input v-model="phone" type="tel" placeholder="Phone number *" required />
        <input v-if="showDate" v-model="date" type="date" required />
        <input v-if="showTime" v-model="time" type="time" required />
        <input v-if="showGuests" v-model.number="guests" type="number" min="1" placeholder="Number of guests" />
        <textarea v-model="notes" placeholder="Special requests (optional)" rows="3" />
      </div>
      <p v-if="error" class="service-form-error">{{ error }}</p>
      <button type="submit" class="sf-btn-primary sf-btn-primary--block service-form-submit" :disabled="submitting">
        {{ submitting ? 'Submitting…' : 'Submit request' }}
      </button>
      <p v-if="submitted" class="service-form-success">
        Request received — {{ session.hotel?.name }} will confirm shortly.
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createTableReservation } from '@/api/reservations'
import { getApiError } from '@/api/client'
import StorefrontPageHero from '@/components/storefront/StorefrontPageHero.vue'
import { useHotelSessionStore } from '@/stores/hotelSession'

const props = defineProps<{
  title: string
  subtitle: string
  serviceType?: string
  showDate?: boolean
  showTime?: boolean
  showGuests?: boolean
}>()

const session = useHotelSessionStore()
const name = ref('')
const email = ref('')
const phone = ref('')
const date = ref('')
const time = ref('')
const guests = ref(2)
const notes = ref('')
const submitted = ref(false)
const submitting = ref(false)
const error = ref('')

function buildReservationDate() {
  if (!date.value) return new Date().toISOString()
  const timePart = time.value || '12:00'
  return new Date(`${date.value}T${timePart}:00`).toISOString()
}

async function submit() {
  if (!session.hotel?.code) {
    error.value = 'Hotel session is not ready.'
    return
  }
  submitting.value = true
  error.value = ''
  try {
    const serviceLabel = props.serviceType || props.title
    const requestNotes = [
      `Service: ${serviceLabel}`,
      session.roomNumber ? `Room: ${session.roomNumber}` : '',
      notes.value,
    ].filter(Boolean).join(' · ')

    await createTableReservation({
      hotel_code: session.hotel.code,
      guest_name: name.value,
      guest_email: email.value,
      guest_phone: phone.value,
      reservation_date: buildReservationDate(),
      party_size: props.showGuests ? guests.value : 1,
      table_number: serviceLabel,
      special_requests: requestNotes,
    })
    submitted.value = true
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.service-form {
  margin-top: 0;
}

.service-form-submit {
  margin-top: 1rem;
}

.service-form-error {
  margin: 0.75rem 0 0;
  font-size: 13px;
  color: var(--color-error, #c0392b);
}

.service-form-success {
  margin: 0.85rem 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--sf-green-checkout);
}
</style>
