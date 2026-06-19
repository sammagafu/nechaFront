<template>
  <AdminCommerceTabs>
    <header class="admin-page-intro">
      <h2>Reservations</h2>
      <p>Select a booking to view full details and update its status.</p>
    </header>

    <AdminPillTabs
      v-model="activeTab"
      aria-label="Reservation type"
      :tabs="reservationTabs"
    />

    <div v-if="loading" class="admin-loading">Loading reservations…</div>
    <p v-else-if="error" class="admin-error">{{ error }}</p>
    <div v-else class="admin-card">
      <div v-if="filteredReservations.length" class="admin-table-wrap">
        <table class="admin-table admin-table--clickable">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Guest</th>
              <th>Hotel</th>
              <th>Type</th>
              <th>Details</th>
              <th>Status</th>
              <th>Requested</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in filteredReservations"
              :key="r.id"
              tabindex="0"
              @click="openDetail(r.id)"
              @keydown.enter="openDetail(r.id)"
            >
              <td><strong>#{{ shortRef(r.id) }}</strong></td>
              <td>
                <strong>{{ r.guest_name }}</strong>
                <br><small>{{ r.guest_phone }}</small>
              </td>
              <td>{{ r.hotel_name }}</td>
              <td>
                <span class="admin-order-type" :class="`admin-order-type--${r.type}`">
                  {{ reservationTypeLabel(r.type) }}
                </span>
              </td>
              <td>{{ reservationSummary(r) }}</td>
              <td>
                <span class="admin-badge" :class="statusBadgeClass(r.status)">{{ r.status }}</span>
              </td>
              <td>
                {{ formatAdminDateTime(r.created_at) }}
                <br><small>{{ r.kkooapp_ref || '—' }}</small>
              </td>
              <td>
                <span class="admin-table-action">View →</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="admin-empty admin-card-body">
        No {{ activeTab === 'all' ? '' : `${reservationTabs.find((t) => t.id === activeTab)?.label.toLowerCase()} ` }}reservations yet.
      </p>
    </div>
  </AdminCommerceTabs>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminCommerceTabs from '@/components/admin/AdminCommerceTabs.vue'
import AdminPillTabs from '@/components/admin/AdminPillTabs.vue'
import { fetchReservations } from '@/api/admin'
import { getApiError } from '@/api/client'
import type { AdminReservation } from '@/types/auth'
import {
  formatAdminDateTime,
  reservationSummary,
  reservationTypeLabel,
  shortRef,
} from '@/utils/adminReservations'

const route = useRoute()
const router = useRouter()

const reservations = ref<AdminReservation[]>([])
const loading = ref(true)
const error = ref('')
const activeTab = ref('all')

const hotelReservations = computed(() => reservations.value.filter((r) => r.type === 'hotel'))
const tableReservations = computed(() => reservations.value.filter((r) => r.type === 'table'))

const reservationTabs = computed(() => [
  { id: 'all', label: 'All bookings', count: reservations.value.length },
  { id: 'hotel', label: 'Room stays', count: hotelReservations.value.length },
  { id: 'table', label: 'Table dining', count: tableReservations.value.length },
])

const filteredReservations = computed(() => {
  if (activeTab.value === 'hotel') return hotelReservations.value
  if (activeTab.value === 'table') return tableReservations.value
  return reservations.value
})

watch(activeTab, (tab) => {
  router.replace({ query: { tab } })
})

onMounted(async () => {
  const tab = route.query.tab
  if (tab === 'all' || tab === 'hotel' || tab === 'table') {
    activeTab.value = tab
  }

  try {
    reservations.value = await fetchReservations()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
})

function statusBadgeClass(status: string) {
  if (status === 'confirmed') return 'admin-badge--active'
  if (status === 'pending') return 'admin-badge--pending'
  return 'admin-badge--inactive'
}

function openDetail(id: string) {
  router.push({
    name: 'admin-reservation-detail',
    params: { id },
    query: { tab: activeTab.value },
  })
}
</script>

<style scoped>
.admin-table--clickable tbody tr {
  cursor: pointer;
}

.admin-table--clickable tbody tr:hover {
  background: color-mix(in srgb, var(--color-necha-green) 6%, var(--color-surface));
}

.admin-table-action {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-necha-green-dark);
  white-space: nowrap;
}
</style>
