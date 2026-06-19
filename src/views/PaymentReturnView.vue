<template>
  <div class="page-wrap">
    <div class="card card-elevated payment-state">
      <p v-if="loading" class="muted">Confirming your payment…</p>
      <template v-else-if="paid">
        <h1>Payment received</h1>
        <p>Thank you. Your order <strong>#{{ shortRef }}</strong> is confirmed.</p>
        <router-link v-if="orderId" :to="`/orders/${orderId}/track`" class="btn">Track order</router-link>
        <router-link to="/shop" class="btn btn-outline">Continue shopping</router-link>
      </template>
      <template v-else>
        <h1>Payment pending</h1>
        <p>We have not confirmed payment for order <strong>#{{ shortRef }}</strong> yet. This can take a minute.</p>
        <button type="button" class="btn" :disabled="loading" @click="checkStatus">Check again</button>
        <router-link to="/shop" class="btn btn-outline">Back to shop</router-link>
      </template>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPaymentStatus } from '@/api/payments'
import { getApiError } from '@/api/client'

const route = useRoute()
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

<style scoped>
.payment-state {
  max-width: 520px;
  margin: 2rem auto;
  padding: 2rem;
  display: grid;
  gap: 1rem;
  text-align: center;
}

.payment-state h1 {
  margin: 0;
  font-size: 1.5rem;
}

.error {
  color: var(--color-error);
  font-size: 14px;
}
</style>
