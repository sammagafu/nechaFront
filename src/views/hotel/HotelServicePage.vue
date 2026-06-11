<template>
  <div>
    <div class="sf-page-hero">
      <p class="breadcrumb">{{ session.hotel?.name }} / {{ title }}</p>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
    <form class="checkout-section service-form" @submit.prevent="submitted = true">
      <div class="checkout-label">Book with {{ session.hotel?.name }}</div>
      <div class="sf-form-fields">
        <input v-model="name" placeholder="Full name *" required />
        <input v-model="phone" type="tel" placeholder="Phone number *" required />
        <input v-if="showDate" v-model="date" type="date" required />
        <input v-if="showTime" v-model="time" type="time" required />
        <input v-if="showGuests" v-model.number="guests" type="number" min="1" placeholder="Number of guests" />
        <textarea v-model="notes" placeholder="Special requests (optional)" rows="3" />
      </div>
      <button type="submit" class="sf-btn-primary sf-btn-primary--block service-form-submit">Submit request</button>
      <p v-if="submitted" class="service-form-success">Request received — {{ session.hotel?.name }} will confirm shortly.</p>
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

<style scoped>
.service-form {
  margin-top: 0;
}

.service-form-submit {
  margin-top: 1rem;
}

.service-form-success {
  margin: 0.85rem 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--sf-green-checkout);
}
</style>
