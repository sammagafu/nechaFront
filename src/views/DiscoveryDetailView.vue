<template>
  <div class="discovery-page discovery-detail-page">
    <p v-if="loading" class="discovery-page-status section-inner">Loading…</p>
    <p v-else-if="error" class="discovery-page-status section-inner">{{ error }}</p>

    <template v-else-if="item">
      <nav class="discovery-detail-breadcrumb section-inner">
        <router-link to="/discovery" class="text-link">Discovery</router-link>
        <span aria-hidden="true">/</span>
        <span>{{ item.name }}</span>
      </nav>

      <header class="discovery-detail-hero">
        <div v-if="item.image_url" class="discovery-detail-hero-media">
          <img :src="item.image_url" :alt="item.name" />
        </div>
        <div v-else class="discovery-detail-hero-placeholder">{{ item.name.charAt(0) }}</div>
        <div class="discovery-detail-hero-overlay section-inner">
          <div class="discovery-detail-badges">
            <span class="discovery-detail-badge">{{ sectionTitle }}</span>
            <span v-if="subcategoryTitle" class="discovery-detail-badge discovery-detail-badge--soft">{{ subcategoryTitle }}</span>
            <span v-if="item.is_featured" class="discovery-detail-badge discovery-detail-badge--featured">Featured</span>
          </div>
          <h1 class="discovery-detail-title">{{ item.name }}</h1>
          <p v-if="heroMeta" class="discovery-detail-lead">{{ heroMeta }}</p>
        </div>
      </header>

      <div class="section-inner discovery-detail-body">
        <div class="discovery-detail-layout">
          <section class="discovery-detail-main">
            <h2 class="discovery-detail-section-title">About</h2>
            <p class="discovery-detail-description">{{ item.description }}</p>
          </section>

          <aside class="discovery-detail-aside">
            <div class="discovery-detail-card">
              <h2 class="discovery-detail-section-title">Details</h2>
              <dl class="discovery-detail-facts">
                <div v-if="item.venue">
                  <dt>Venue</dt>
                  <dd>{{ item.venue }}</dd>
                </div>
                <div v-if="item.location">
                  <dt>Location</dt>
                  <dd>{{ item.location }}</dd>
                </div>
                <div v-if="item.distance">
                  <dt>Distance</dt>
                  <dd>{{ item.distance }} from hotel</dd>
                </div>
                <div v-if="eventWhen">
                  <dt>When</dt>
                  <dd>{{ eventWhen }}</dd>
                </div>
                <div v-if="item.price_tzs">
                  <dt>Ticket price</dt>
                  <dd>TZS {{ item.price_tzs.toLocaleString() }}</dd>
                </div>
                <div v-else-if="item.price_hint">
                  <dt>Price</dt>
                  <dd>{{ item.price_hint }}</dd>
                </div>
                <div v-if="item.organizer_name">
                  <dt>Organizer</dt>
                  <dd>{{ item.organizer_name }}</dd>
                </div>
                <div v-if="item.phone">
                  <dt>Phone</dt>
                  <dd>
                    <a :href="`tel:${item.phone.replace(/\s/g, '')}`" class="text-link">{{ item.phone }}</a>
                  </dd>
                </div>
              </dl>

              <div class="discovery-detail-actions">
                <a
                  v-if="item.ticket_url"
                  :href="item.ticket_url"
                  class="btn btn-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ ticketCta }}
                </a>
                <button
                  v-if="showPaidBooking"
                  type="button"
                  class="btn btn-lg"
                  @click="bookingOpen = true"
                >
                  Get tickets
                </button>
                <button
                  v-else-if="showNechaBooking"
                  type="button"
                  class="btn btn-lg"
                  @click="bookingOpen = true"
                >
                  Book via Necha
                </button>
                <a
                  v-else-if="!item.ticket_url && item.phone"
                  :href="`tel:${item.phone.replace(/\s/g, '')}`"
                  class="btn btn-lg"
                >
                  Call to book
                </a>
                <a
                  v-if="item.website"
                  :href="item.website"
                  class="btn btn-outline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit website
                </a>
              </div>

              <form
                v-if="bookingOpen && showNechaBooking"
                class="discovery-booking-form"
                @submit.prevent="submitBooking"
              >
                <h3>{{ showPaidBooking ? 'Book tickets' : 'Request booking' }}</h3>
                <p class="discovery-booking-lead">
                  <template v-if="showPaidBooking">
                    Pay securely on Selcom — M-Pesa, cards and more.
                    <span v-if="item.tickets_left"> {{ item.tickets_left }} tickets left.</span>
                  </template>
                  <template v-else>We'll confirm availability and send payment details by email.</template>
                </p>
                <p v-if="bookingError" class="discovery-booking-error">{{ bookingError }}</p>
                <p v-if="bookingSuccess" class="discovery-booking-success">{{ bookingSuccess }}</p>
                <label>
                  Full name
                  <input v-model="booking.name" type="text" required />
                </label>
                <label>
                  Email
                  <input v-model="booking.email" type="email" required />
                </label>
                <label>
                  Phone
                  <input v-model="booking.phone" type="tel" />
                </label>
                <label>
                  Guests
                  <input v-model.number="booking.units" type="number" min="1" />
                </label>
                <label>
                  Notes
                  <textarea v-model="booking.message" rows="3" placeholder="Preferred date, special requests…" />
                </label>
                <div class="discovery-booking-actions">
                  <button type="button" class="btn btn-outline" @click="bookingOpen = false">Cancel</button>
                  <button type="submit" class="btn btn-lg" :disabled="bookingSubmitting">
                    {{ bookingSubmitting ? 'Processing…' : showPaidBooking ? 'Pay now' : 'Submit request' }}
                  </button>
                </div>
              </form>
            </div>

            <router-link :to="backLink" class="discovery-detail-back">← Back to Discovery</router-link>
          </aside>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchDiscoveryItem } from '@/api/discovery'
import { getApiError } from '@/api/client'
import { submitInquiry } from '@/api/inquiries'
import { createDiscoveryOrder } from '@/api/orders'
import { usePlatformSettings } from '@/composables/usePlatformSettings'
import { sectionLabel, subcategoryLabel, type DiscoverySectionId } from '@/config/discovery'
import type { DiscoveryItem } from '@/types/discovery'
import '@/assets/discovery-page.css'

const route = useRoute()
const { ensureLoaded, features } = usePlatformSettings()
const loading = ref(true)
const error = ref('')
const item = ref<DiscoveryItem | null>(null)
const bookingOpen = ref(false)
const bookingSubmitting = ref(false)
const bookingError = ref('')
const bookingSuccess = ref('')
const booking = reactive({
  name: '',
  email: '',
  phone: '',
  units: 1,
  message: '',
})

const showPaidBooking = computed(() => {
  if (!features.value.discovery_ticketing_enabled || !item.value) return false
  return item.value.ticket_mode === 'platform' && (item.value.price_tzs ?? 0) > 0
})

const showNechaBooking = computed(() => {
  if (!features.value.discovery_ticketing_enabled || !item.value) return false
  if (showPaidBooking.value) return false
  return item.value.ticket_mode === 'platform' || !item.value.ticket_url
})

const sectionTitle = computed(() =>
  item.value ? sectionLabel(item.value.section as DiscoverySectionId) : '',
)

const subcategoryTitle = computed(() =>
  item.value?.subcategory
    ? subcategoryLabel(item.value.section as DiscoverySectionId, item.value.subcategory)
    : '',
)

const heroMeta = computed(() => {
  if (!item.value) return ''
  return [item.value.venue, item.value.location, item.value.distance ? `${item.value.distance} from hotel` : '']
    .filter(Boolean)
    .join(' · ')
})

const eventWhen = computed(() => {
  if (!item.value?.event_starts_at) return ''
  const start = new Date(item.value.event_starts_at)
  const fmt: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }
  let text = start.toLocaleString('en-GB', fmt)
  if (item.value.event_ends_at) {
    const end = new Date(item.value.event_ends_at)
    text += ` – ${end.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
  }
  return text
})

const ticketCta = computed(() => {
  if (!item.value?.ticket_url) return 'Book now'
  if (item.value.ticket_mode === 'platform') return 'Get tickets'
  if (item.value.ticket_mode === 'referral') return 'View tickets'
  return 'Book now'
})

const backLink = computed(() => {
  const section = item.value?.section
  return section ? { path: '/discovery', hash: `#${section}` } : '/discovery'
})

async function submitBooking() {
  if (!item.value) return
  bookingSubmitting.value = true
  bookingError.value = ''
  bookingSuccess.value = ''
  try {
    if (showPaidBooking.value) {
      const order = await createDiscoveryOrder({
        discovery_slug: item.value.slug,
        customer_name: booking.name.trim(),
        customer_email: booking.email.trim(),
        customer_phone: booking.phone.trim(),
        quantity: booking.units > 0 ? booking.units : 1,
        return_url: `${window.location.origin}/payment/return`,
        cancel_url: `${window.location.origin}/discovery/${item.value.slug}`,
      })
      if (order.payment_url) {
        window.location.href = order.payment_url
        return
      }
      bookingSuccess.value = 'Booking confirmed — check your email for details.'
    } else {
      await submitInquiry({
        type: 'discovery_booking',
        name: booking.name.trim(),
        email: booking.email.trim(),
        phone: booking.phone.trim(),
        category: item.value.name,
        location: item.value.location || item.value.venue || '',
        message: booking.message.trim() || `Booking request for ${item.value.name}`,
        units: booking.units > 0 ? booking.units : 1,
      })
      bookingSuccess.value = 'Request sent — our team will contact you shortly.'
    }
    bookingOpen.value = false
  } catch (err) {
    bookingError.value = getApiError(err)
  } finally {
    bookingSubmitting.value = false
  }
}

async function load(slug: string) {
  loading.value = true
  error.value = ''
  item.value = null
  try {
    item.value = await fetchDiscoveryItem(slug)
  } catch (err) {
    error.value = getApiError(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void ensureLoaded()
  void load(String(route.params.slug))
})

watch(
  () => route.params.slug,
  (slug) => {
    if (route.name === 'discovery-detail' && slug) void load(String(slug))
  },
)
</script>

<style scoped>
.discovery-booking-form {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border, #e5e7eb);
  display: grid;
  gap: 0.75rem;
}

.discovery-booking-form h3 {
  margin: 0;
  font-size: 1rem;
}

.discovery-booking-lead {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-muted, #6b7280);
}

.discovery-booking-form label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 500;
}

.discovery-booking-form input,
.discovery-booking-form textarea {
  font: inherit;
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius, 8px);
}

.discovery-booking-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.discovery-booking-error {
  color: #b91c1c;
  margin: 0;
  font-size: 0.875rem;
}

.discovery-booking-success {
  color: #047857;
  margin: 0;
  font-size: 0.875rem;
}
</style>
