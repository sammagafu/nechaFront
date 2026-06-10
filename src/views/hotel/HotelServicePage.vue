<template>
  <div>
    <div class="sf-page-hero">
      <p class="breadcrumb">{{ session.hotel?.name }} / {{ title }}</p>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
    <form class="checkout-section" style="margin-top: 0" @submit.prevent="submitted = true">
      <div class="checkout-label">Book with {{ session.hotel?.name }}</div>
      <input v-model="name" placeholder="Full name *" required style="width: 100%; margin-bottom: 8px; padding: 10px; border-radius: 6px; border: 0.5px solid var(--sf-warm-grey)" />
      <input v-model="phone" type="tel" placeholder="Phone number *" required style="width: 100%; margin-bottom: 8px; padding: 10px; border-radius: 6px; border: 0.5px solid var(--sf-warm-grey)" />
      <input v-if="showDate" v-model="date" type="date" required style="width: 100%; margin-bottom: 8px; padding: 10px; border-radius: 6px; border: 0.5px solid var(--sf-warm-grey)" />
      <input v-if="showTime" v-model="time" type="time" required style="width: 100%; margin-bottom: 8px; padding: 10px; border-radius: 6px; border: 0.5px solid var(--sf-warm-grey)" />
      <input v-if="showGuests" v-model.number="guests" type="number" min="1" placeholder="Number of guests" style="width: 100%; margin-bottom: 8px; padding: 10px; border-radius: 6px; border: 0.5px solid var(--sf-warm-grey)" />
      <textarea v-model="notes" placeholder="Special requests (optional)" rows="3" style="width: 100%; margin-bottom: 12px; padding: 10px; border-radius: 6px; border: 0.5px solid var(--sf-warm-grey)" />
      <button type="submit" class="sf-btn-primary sf-btn-primary--block">Submit request</button>
      <p v-if="submitted" style="margin-top: 12px; font-size: 12px; color: var(--sf-green-checkout)">Request received — {{ session.hotel?.name }} will confirm shortly.</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHotelSessionStore } from '@/stores/hotelSession'

defineProps<{
  title: string
  subtitle: string
  showDate?: boolean
  showTime?: boolean
  showGuests?: boolean
}>()

const session = useHotelSessionStore()
const name = ref('')
const phone = ref('')
const date = ref('')
const time = ref('')
const guests = ref(2)
const notes = ref('')
const submitted = ref(false)
</script>
