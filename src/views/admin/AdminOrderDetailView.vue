<template>
  <AdminCommerceTabs>
    <div class="admin-detail-back">
      <router-link :to="backLink" class="admin-btn admin-btn--ghost">← Back to orders</router-link>
    </div>

    <div v-if="loading" class="admin-loading">Loading order…</div>
    <p v-else-if="error" class="admin-error">{{ error }}</p>
    <div v-else-if="order" class="admin-order-detail">
      <header class="admin-order-head">
        <div>
          <p class="admin-order-kicker">Order #{{ shortRef(order.id) }}</p>
          <h2>{{ orderTypeLabel(order.type) }}</h2>
          <p class="admin-order-sub">{{ order.hotel_name }}</p>
        </div>
        <span class="admin-order-type" :class="`admin-order-type--${order.type}`">
          {{ orderTypeLabel(order.type) }}
        </span>
      </header>

      <div class="admin-detail-grid">
        <section class="admin-card admin-card-body">
          <h3>Guest</h3>
          <dl class="admin-detail-list">
            <div><dt>Name</dt><dd>{{ order.customer_name }}</dd></div>
            <div><dt>Phone</dt><dd>{{ order.customer_phone || '—' }}</dd></div>
            <div><dt>Room</dt><dd>{{ order.room_number || '—' }}</dd></div>
            <div v-if="order.table_number"><dt>Table</dt><dd>{{ order.table_number }}</dd></div>
          </dl>
        </section>

        <section class="admin-card admin-card-body">
          <h3>Payment</h3>
          <dl class="admin-detail-list">
            <div><dt>Total</dt><dd>{{ formatPrice(order.total_amount, order.currency) }}</dd></div>
            <div><dt>Provider</dt><dd>{{ order.payment_provider || '—' }}</dd></div>
            <div><dt>Payment status</dt><dd>{{ order.payment_status || '—' }}</dd></div>
            <div><dt>Payment ref</dt><dd>{{ order.payment_ref || '—' }}</dd></div>
          </dl>
        </section>

        <section class="admin-card admin-card-body admin-order-items">
          <h3>Items ({{ order.items.length }})</h3>
          <div v-if="order.items.length" class="admin-table-wrap admin-order-items-table">
            <table class="admin-table admin-order-items-table-grid">
              <thead>
                <tr>
                  <th>Product</th>
                  <th class="admin-order-col-num">Qty</th>
                  <th class="admin-order-col-num">Unit price</th>
                  <th class="admin-order-col-num">Line total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.items" :key="item.id">
                  <td>
                    <strong>{{ item.name }}</strong>
                    <p v-if="item.notes" class="admin-order-line-note">{{ item.notes }}</p>
                  </td>
                  <td class="admin-order-col-num">{{ item.quantity }}</td>
                  <td class="admin-order-col-num">{{ formatPrice(item.unit_price, order.currency) }}</td>
                  <td class="admin-order-col-num">{{ formatPrice(item.total_price, order.currency) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="admin-order-items-total">
                  <td colspan="3">Order total</td>
                  <td class="admin-order-col-num">{{ formatPrice(order.total_amount, order.currency) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p v-else class="admin-empty">No line items recorded.</p>
        </section>

        <section class="admin-card admin-card-body">
          <h3>Reference</h3>
          <dl class="admin-detail-list">
            <div><dt>Kkooapp ref</dt><dd>{{ order.kkooapp_ref || '—' }}</dd></div>
            <div><dt>Placed</dt><dd>{{ formatAdminDateTime(order.created_at) }}</dd></div>
            <div><dt>Last updated</dt><dd>{{ formatAdminDateTime(order.updated_at) }}</dd></div>
            <div v-if="order.notes"><dt>Order notes</dt><dd>{{ order.notes }}</dd></div>
          </dl>
        </section>
      </div>

      <section class="admin-card admin-order-status">
        <div class="admin-card-body">
          <h3>Update status</h3>
          <p class="admin-order-status-hint">
            Current status:
            <span class="admin-badge" :class="orderStatusBadgeClass(order.status)">{{ order.status }}</span>
          </p>
          <form class="admin-order-status-form" @submit.prevent="saveStatus">
            <label>
              New status
              <select v-model="statusDraft" class="admin-order-status-select">
                <option v-for="s in orderStatuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </label>
            <button
              type="submit"
              class="admin-btn admin-btn--primary"
              :disabled="saving || statusDraft === order.status"
            >
              {{ saving ? 'Saving…' : 'Save status' }}
            </button>
          </form>
          <p v-if="statusMessage" class="admin-order-status-msg">{{ statusMessage }}</p>
        </div>
      </section>
    </div>
  </AdminCommerceTabs>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminCommerceTabs from '@/components/admin/AdminCommerceTabs.vue'
import { fetchOrder, updateOrderStatus } from '@/api/admin'
import { getApiError } from '@/api/client'
import type { AdminOrderDetail } from '@/types/auth'
import { formatPrice } from '@/utils/commerce'
import {
  formatAdminDateTime,
  orderStatusBadgeClass,
  orderStatuses,
  orderTypeLabel,
  shortRef,
} from '@/utils/adminOrders'

const route = useRoute()
const order = ref<AdminOrderDetail | null>(null)
const loading = ref(true)
const error = ref('')
const statusDraft = ref('pending')
const saving = ref(false)
const statusMessage = ref('')

const backLink = computed(() => {
  const tab = route.query.tab
  if (tab === 'product' || tab === 'food' || tab === 'all') {
    return { path: '/admin/orders', query: { tab } }
  }
  return '/admin/orders'
})

watch(
  () => route.params.id,
  () => {
    void loadOrder()
  },
)

onMounted(() => {
  void loadOrder()
})

async function loadOrder() {
  const id = String(route.params.id || '')
  if (!id) return

  loading.value = true
  error.value = ''
  statusMessage.value = ''
  try {
    order.value = await fetchOrder(id)
    statusDraft.value = order.value.status
  } catch (e) {
    order.value = null
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function saveStatus() {
  if (!order.value || statusDraft.value === order.value.status) return

  saving.value = true
  statusMessage.value = ''
  error.value = ''
  try {
    await updateOrderStatus(order.value.id, statusDraft.value)
    order.value = await fetchOrder(order.value.id)
    statusDraft.value = order.value.status
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

.admin-order-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.admin-order-kicker {
  margin: 0 0 0.2rem;
  font-size: 12px;
  color: var(--color-muted);
}

.admin-order-head h2 {
  margin: 0;
  font-family: var(--font-display, Georgia, serif);
  font-size: 1.5rem;
  font-weight: 500;
}

.admin-order-sub {
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

  .admin-order-items {
    grid-column: 1 / -1;
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

.admin-detail-grid h3,
.admin-order-status h3 {
  margin: 0;
  font-size: 14px;
}

.admin-order-items-table {
  margin: 0.75rem calc(-1 * var(--admin-pad-card-lg, 1.5rem)) 0;
}

.admin-order-items-table-grid {
  min-width: 32rem;
}

.admin-order-col-num {
  text-align: right;
  white-space: nowrap;
}

.admin-order-line-note {
  margin: 0.2rem 0 0;
  font-size: 12px;
  color: var(--color-muted);
}

.admin-order-items-total td {
  border-top: 1px solid var(--color-border);
  font-weight: 600;
  font-size: 14px;
}

.admin-order-status-hint {
  margin: 0.65rem 0 0.85rem;
  font-size: 13px;
  color: var(--color-muted);
}

.admin-order-status-form {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 0.75rem;
}

.admin-order-status-form label {
  display: grid;
  gap: 0.35rem;
  font-size: 13px;
  font-weight: 600;
}

.admin-order-status-select {
  font: inherit;
  font-size: 12px;
  padding: 0.35rem 0.45rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.admin-order-status-msg {
  margin: 0.75rem 0 0;
  font-size: 13px;
  color: var(--color-necha-green-dark);
}
</style>
