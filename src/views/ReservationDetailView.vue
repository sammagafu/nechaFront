<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Confirmation</p>
      <h1 class="page-title">Reservation confirmed</h1>
    </header>

    <div class="card card-elevated">
      <p v-if="loading" class="muted">Loading reservation...</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <div v-else-if="reservation" class="reservation-details">
        <p class="status-line">
          <span class="eyebrow">Status</span>
          <strong class="success">{{ reservation.status }}</strong>
        </p>
        <p><span class="label">Reference</span> {{ reservation.order_ref }}</p>
        <p><span class="label">Guest</span> {{ reservation.guest_name }}</p>
        <p v-if="reservation.room_type"><span class="label">Room</span> {{ reservation.room_type }}</p>
        <p v-if="reservation.check_in"><span class="label">Check-in</span> {{ reservation.check_in }}</p>
        <p v-if="reservation.check_out"><span class="label">Check-out</span> {{ reservation.check_out }}</p>
        <p v-if="reservation.reservation_date"><span class="label">Date</span> {{ reservation.reservation_date }}</p>
        <p v-if="reservation.party_size"><span class="label">Party size</span> {{ reservation.party_size }}</p>
        <p class="muted">Created: {{ reservation.created_at }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchReservation } from '@/api/reservations'
import { getApiError } from '@/api/client'
import type { Reservation } from '@/types/api'

const route = useRoute()
const reservation = ref<Reservation | null>(null)
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  loading.value = true
  try {
    reservation.value = await fetchReservation(String(route.params.id))
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.reservation-details {
  display: grid;
  gap: 0.6rem;
}

.status-line strong {
  display: block;
  font-family: var(--font-display);
  font-size: 2rem;
  text-transform: capitalize;
}

.label {
  font-weight: 600;
  color: var(--color-text);
}
</style>
