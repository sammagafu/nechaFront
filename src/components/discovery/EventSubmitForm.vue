<template>
  <form class="event-submit" @submit.prevent="submit">
    <p v-if="success" class="event-submit-success">
      Thank you — your event has been submitted for review. We will contact you within 48 hours.
    </p>
    <template v-else>
      <p v-if="error" class="event-submit-error">{{ error }}</p>
      <div class="event-submit-grid">
        <label>
          Event name *
          <input v-model="form.name" required placeholder="Jazz by the Bay" />
        </label>
        <label>
          Category *
          <select v-model="form.subcategory" required>
            <option v-for="cat in eventSubcategories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
          </select>
        </label>
      </div>
      <label>
        Description *
        <textarea v-model="form.description" rows="3" required placeholder="Tell guests what to expect…" />
      </label>
      <div class="event-submit-grid">
        <label>
          Venue *
          <input v-model="form.venue" required placeholder="Oysterbay Beach Club" />
        </label>
        <label>
          Area
          <input v-model="form.location" placeholder="Masaki, City Centre…" />
        </label>
      </div>
      <div class="event-submit-grid">
        <label>
          Start date & time *
          <input v-model="form.event_starts_at" type="datetime-local" required />
        </label>
        <label>
          End date & time
          <input v-model="form.event_ends_at" type="datetime-local" />
        </label>
      </div>
      <div class="event-submit-grid">
        <label>
          Organiser name *
          <input v-model="form.organizer_name" required />
        </label>
        <label>
          Organiser email *
          <input v-model="form.organizer_email" type="email" required />
        </label>
      </div>
      <div class="event-submit-grid">
        <label>
          Phone
          <input v-model="form.organizer_phone" type="tel" placeholder="+255 7xx xxx xxx" />
        </label>
        <label>
          Ticket link
          <input v-model="form.ticket_url" type="url" placeholder="https://" />
        </label>
      </div>
      <label>
        Website
        <input v-model="form.website" type="url" placeholder="https://" />
      </label>
      <button type="submit" class="discovery-btn discovery-btn--primary event-submit-btn" :disabled="saving">
        {{ saving ? 'Submitting…' : 'Submit event for review' }}
      </button>
    </template>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { submitDiscoveryEvent } from '@/api/discovery'
import { submitInquiry } from '@/api/inquiries'
import { eventSubcategories } from '@/config/discovery'
import { getApiError } from '@/api/client'

const props = defineProps<{
  hotelSlug?: string
}>()

const saving = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
  name: '',
  description: '',
  subcategory: 'music',
  venue: '',
  location: '',
  event_starts_at: '',
  event_ends_at: '',
  organizer_name: '',
  organizer_email: '',
  organizer_phone: '',
  website: '',
  ticket_url: '',
})

function toApiDateTime(local: string) {
  if (!local) return ''
  return new Date(local).toISOString()
}

async function submit() {
  saving.value = true
  error.value = ''
  try {
    await submitDiscoveryEvent({
      ...form,
      event_starts_at: toApiDateTime(form.event_starts_at),
      event_ends_at: form.event_ends_at ? toApiDateTime(form.event_ends_at) : undefined,
      hotel_slug: props.hotelSlug,
      ticket_mode: form.ticket_url ? 'referral' : 'none',
    })
    await submitInquiry({
      type: 'event_listing',
      name: form.organizer_name,
      email: form.organizer_email,
      phone: form.organizer_phone,
      category: form.subcategory,
      location: form.location || form.venue,
      message: `${form.name}: ${form.description}`,
    })
    success.value = true
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.event-submit {
  display: grid;
  gap: 0.85rem;
  padding: 1.1rem;
  border: 1px solid var(--sf-warm-grey, #e8e6e0);
  border-radius: 16px;
  background: var(--sf-cream, #f5f3ee);
}

.event-submit-grid {
  display: grid;
  gap: 0.85rem;
}

@media (min-width: 560px) {
  .event-submit-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.event-submit label {
  display: grid;
  gap: 0.35rem;
  font-size: 11px;
  font-weight: 600;
  color: var(--sf-charcoal, #1a1a1a);
}

.event-submit input,
.event-submit select,
.event-submit textarea {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--sf-warm-grey, #e8e6e0);
  border-radius: 10px;
  font-family: inherit;
  font-size: 13px;
  background: #fff;
}

.event-submit-btn {
  width: 100%;
  margin-top: 0.25rem;
}

.event-submit-error {
  margin: 0;
  font-size: 12px;
  color: #c0392b;
}

.event-submit-success {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--sf-green-dark, #5a8f2a);
}
</style>
