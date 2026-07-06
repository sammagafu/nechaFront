<template>
  <AdminCommerceTabs>
    <div class="admin-detail-back">
      <router-link :to="backLink" class="admin-btn admin-btn--ghost">← Back to bookings</router-link>
    </div>

    <div v-if="loading" class="admin-loading">Loading booking…</div>
    <p v-else-if="error" class="admin-error">{{ error }}</p>
    <div v-else-if="reservation" class="admin-reservation-detail">
      <header class="admin-reservation-head">
        <div>
          <p class="admin-reservation-kicker">Booking #{{ shortRef(reservation.id) }}</p>
          <h2>{{ reservationTypeLabel(reservation.type) }}</h2>
          <p class="admin-reservation-sub">{{ reservation.hotel_name }}</p>
        </div>
        <span class="admin-order-type" :class="`admin-order-type--${reservation.type}`">
          {{ reservationTypeLabel(reservation.type) }}
        </span>
      </header>

      <div class="admin-detail-grid">
        <section class="admin-card admin-card-body">
          <h3>Guest</h3>
          <dl class="admin-detail-list">
            <div><dt>Name</dt><dd>{{ reservation.guest_name }}</dd></div>
            <div><dt>Phone</dt><dd>{{ reservation.guest_phone || '—' }}</dd></div>
            <div><dt>Email</dt><dd>{{ reservation.guest_email || '—' }}</dd></div>
          </dl>
        </section>

        <section class="admin-card admin-card-body">
          <h3>{{ reservation.type === 'hotel' ? 'Stay details' : 'Dining details' }}</h3>
          <dl class="admin-detail-list">
            <template v-if="reservation.type === 'hotel'">
              <div><dt>Check-in</dt><dd>{{ formatAdminDateTime(reservation.check_in || '') }}</dd></div>
              <div><dt>Check-out</dt><dd>{{ formatAdminDateTime(reservation.check_out || '') }}</dd></div>
              <div><dt>Room type</dt><dd>{{ reservation.room_type || '—' }}</dd></div>
              <div><dt>Guests</dt><dd>{{ reservation.guest_count || '—' }}</dd></div>
            </template>
            <template v-else>
              <div><dt>Date &amp; time</dt><dd>{{ formatAdminDateTime(reservation.reservation_date || '') }}</dd></div>
              <div><dt>Party size</dt><dd>{{ reservation.party_size ?? '—' }}</dd></div>
              <div><dt>Table</dt><dd>{{ reservation.table_number || '—' }}</dd></div>
            </template>
          </dl>
        </section>

        <section v-if="reservation.special_requests || reservation.notes" class="admin-card admin-card-body">
          <h3>Notes</h3>
          <dl class="admin-detail-list">
            <div v-if="reservation.special_requests">
              <dt>Guest requests</dt>
              <dd>{{ reservation.special_requests }}</dd>
            </div>
            <div v-if="reservation.notes">
              <dt>Internal notes</dt>
              <dd>{{ reservation.notes }}</dd>
            </div>
          </dl>
        </section>

        <section class="admin-card admin-card-body">
          <h3>Reference</h3>
          <dl class="admin-detail-list">
            <div><dt>Booking reference</dt><dd>{{ reservation.order_ref || reservation.id || '—' }}</dd></div>
            <div><dt>Requested</dt><dd>{{ formatAdminDateTime(reservation.created_at) }}</dd></div>
            <div v-if="reservation.updated_at">
              <dt>Last updated</dt>
              <dd>{{ formatAdminDateTime(reservation.updated_at) }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section class="admin-card admin-reservation-status">
        <div class="admin-card-body">
          <h3>Update status</h3>
          <p class="admin-reservation-status-hint">
            Current status:
            <span class="admin-badge" :class="statusBadgeClass(reservation.status)">{{ reservation.status }}</span>
          </p>
          <form class="admin-reservation-status-form" @submit.prevent="saveStatus">
            <label>
              New status
              <select v-model="statusDraft" class="admin-order-status">
                <option v-for="s in reservationStatuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </label>
            <button
              type="submit"
              class="admin-btn admin-btn--primary"
              :disabled="saving || statusDraft === reservation.status"
            >
              {{ saving ? 'Saving…' : 'Save status' }}
            </button>
          </form>
          <p v-if="statusMessage" class="admin-reservation-status-msg">{{ statusMessage }}</p>
        </div>
      </section>
    </div>
  </AdminCommerceTabs>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminCommerceTabs from '@/components/admin/AdminCommerceTabs.vue'
import { fetchReservation, updateReservationStatus } from '@/api/admin'
import { getApiError } from '@/api/client'
import type { AdminReservation } from '@/types/auth'
import {
  formatAdminDateTime,
  reservationStatuses,
  reservationTypeLabel,
  shortRef,
} from '@/utils/adminReservations'

const route = useRoute()
const reservation = ref<AdminReservation | null>(null)
const loading = ref(true)
const error = ref('')
const statusDraft = ref('pending')
const saving = ref(false)
const statusMessage = ref('')

const backLink = computed(() => {
  const tab = route.query.tab
  if (tab === 'hotel' || tab === 'table' || tab === 'all') {
    return { path: '/admin/reservations', query: { tab } }
  }
  return '/admin/reservations'
})

watch(
  () => route.params.id,
  () => {
    void loadReservation()
  },
)

onMounted(() => {
  void loadReservation()
})

async function loadReservation() {
  const id = String(route.params.id || '')
  if (!id) return

  loading.value = true
  error.value = ''
  statusMessage.value = ''
  try {
    reservation.value = await fetchReservation(id)
    statusDraft.value = reservation.value.status
  } catch (e) {
    reservation.value = null
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

function statusBadgeClass(status: string) {
  if (status === 'confirmed') return 'admin-badge--active'
  if (status === 'pending') return 'admin-badge--pending'
  return 'admin-badge--inactive'
}

async function saveStatus() {
  if (!reservation.value || statusDraft.value === reservation.value.status) return

  saving.value = true
  statusMessage.value = ''
  error.value = ''
  try {
    reservation.value = await updateReservationStatus(reservation.value.id, statusDraft.value)
    statusDraft.value = reservation.value.status
    statusMessage.value = 'Status updated.'
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-detail-back {
  margin-bottom: 0.25rem;
}

.admin-reservation-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.admin-reservation-kicker {
  margin: 0 0 0.2rem;
  font-size: 12px;
  color: var(--color-muted);
}

.admin-reservation-head h2 {
  margin: 0;
  font-family: var(--font-display, Georgia, serif);
  font-size: 1.5rem;
  font-weight: 500;
}

.admin-reservation-sub {
  margin: 0.25rem 0 0;
  color: var(--color-muted);
  font-size: 14px;
}

.admin-detail-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 900px) {
  .admin-detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.admin-detail-list {
  display: grid;
  gap: 0.65rem;
  margin: 0.75rem 0 0;
}

.admin-detail-list div {
  display: grid;
  gap: 0.15rem;
}

.admin-detail-list dt {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.admin-detail-list dd {
  margin: 0;
  font-size: 14px;
}

.admin-reservation-status h3,
.admin-detail-grid h3 {
  margin: 0;
  font-size: 14px;
}

.admin-reservation-status-hint {
  margin: 0.65rem 0 0.85rem;
  font-size: 13px;
  color: var(--color-muted);
}

.admin-reservation-status-form {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 0.75rem;
}

.admin-reservation-status-form label {
  display: grid;
  gap: 0.35rem;
  font-size: 13px;
  font-weight: 600;
}

.admin-reservation-status-msg {
  margin: 0.75rem 0 0;
  font-size: 13px;
  color: var(--color-necha-green-dark);
}
</style>
