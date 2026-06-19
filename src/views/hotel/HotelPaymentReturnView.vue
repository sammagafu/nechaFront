<template>
  <div class="confirm-wrap">
    <div class="confirm-card">
      <p v-if="loading" class="confirm-body">Confirming your payment…</p>
      <template v-else-if="paid">
        <div class="confirm-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h1 class="confirm-title">Payment received — thank you.</h1>
        <div class="confirm-body">
          <p><strong>Order reference:</strong><br>#{{ shortRef }}</p>
          <p>We'll deliver to {{ session.hotel?.name }}, Room {{ session.roomNumber }}.</p>
        </div>
        <router-link :to="`/hotel/${session.slug}`" class="sf-btn-primary sf-btn-primary--block confirm-cta">
          Browse more products →
        </router-link>
      </template>
      <template v-else>
        <h1 class="confirm-title">Payment pending</h1>
        <div class="confirm-body">
          <p>We're still waiting for Selcom to confirm order <strong>#{{ shortRef }}</strong>.</p>
          <button type="button" class="sf-btn-primary sf-btn-primary--block" :disabled="loading" @click="checkStatus">Check again</button>
        </div>
      </template>
      <p v-if="error" class="checkout-field-error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPaymentStatus } from '@/api/payments'
import { getApiError } from '@/api/client'
import { useHotelSessionStore } from '@/stores/hotelSession'

const route = useRoute()
const session = useHotelSessionStore()
const orderId = computed(() => String(route.query.order_id || ''))
const shortRef = computed(() => orderId.value.slice(0, 8).toUpperCase())
const loading = ref(true)
const paid = ref(false)
const error = ref('')

async function checkStatus() {
  if (!orderId.value) {
    error.value = 'Missing order reference.'
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    const status = await fetchPaymentStatus(orderId.value)
    paid.value = status.payment_status === 'completed' || status.order_status === 'confirmed'
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

onMounted(checkStatus)
</script>
