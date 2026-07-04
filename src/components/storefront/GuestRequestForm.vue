<template>
  <section class="guest-request">
    <button type="button" class="guest-request-toggle" @click="open = !open">
      Tell us what you need
      <span aria-hidden="true">{{ open ? '−' : '+' }}</span>
    </button>
    <form v-if="open" class="guest-request-form" @submit.prevent="submit">
      <p class="guest-request-lead">Need something not listed? Let us know and Necha will follow up.</p>
      <input v-model="form.guest_name" placeholder="Full name *" required />
      <input v-model="form.guest_phone" type="tel" placeholder="Phone *" required />
      <input v-model="form.room_number" placeholder="Room number" />
      <textarea v-model="form.body" rows="3" placeholder="What do you need? *" required />
      <p v-if="error" class="guest-request-error">{{ error }}</p>
      <p v-if="success" class="guest-request-success">Request sent — we'll be in touch shortly.</p>
      <button type="submit" class="sf-btn-primary" :disabled="submitting">
        {{ submitting ? 'Sending…' : 'Send request' }}
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { submitGuestRequest } from '@/api/inquiries'
import { getApiError } from '@/api/client'
import { useHotelSessionStore } from '@/stores/hotelSession'

const session = useHotelSessionStore()
const open = ref(false)
const submitting = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
  guest_name: '',
  guest_phone: '',
  room_number: session.roomNumber || '',
  body: '',
})

async function submit() {
  if (!session.slug) return
  submitting.value = true
  error.value = ''
  success.value = false
  try {
    await submitGuestRequest(session.slug, {
      guest_name: form.guest_name,
      guest_phone: form.guest_phone,
      room_number: form.room_number || session.roomNumber,
      category: 'general',
      body: form.body,
    })
    success.value = true
    form.body = ''
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.guest-request {
  margin: 1.5rem 0;
  border: 1px solid var(--color-border, var(--sf-border));
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
}

.guest-request-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  border: none;
  background: var(--color-bg-soft, var(--sf-bg-soft));
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.guest-request-form {
  padding: 1rem;
  display: grid;
  gap: 0.65rem;
}

.guest-request-form input,
.guest-request-form textarea {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--color-border, var(--sf-border));
  border-radius: 8px;
  font: inherit;
}

.guest-request-lead {
  margin: 0;
  font-size: 13px;
  color: var(--color-muted, var(--sf-muted));
}

.guest-request-error {
  color: #b42318;
  font-size: 13px;
  margin: 0;
}

.guest-request-success {
  color: #027a48;
  font-size: 13px;
  margin: 0;
}
</style>
