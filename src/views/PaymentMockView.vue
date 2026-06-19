<template>
  <div class="page-wrap">
    <div class="card card-elevated payment-state">
      <p class="eyebrow">Selcom mock</p>
      <h1>Complete test payment</h1>
      <p class="muted">Mock mode is enabled. Confirm below to simulate a successful Selcom payment.</p>
      <p v-if="orderId">Order <strong>#{{ shortRef }}</strong></p>
      <button type="button" class="btn" :disabled="submitting" @click="complete">
        {{ submitting ? 'Processing…' : 'Simulate payment' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { completeMockPayment } from '@/api/payments'
import { getApiError } from '@/api/client'

const route = useRoute()
const router = useRouter()
const orderId = computed(() => String(route.query.order_id || ''))
const shortRef = computed(() => orderId.value.slice(0, 8).toUpperCase())
const submitting = ref(false)
const error = ref('')

async function complete() {
  if (!orderId.value) {
    error.value = 'Missing order reference.'
    return
  }
  submitting.value = true
  error.value = ''
  try {
    await completeMockPayment(orderId.value)
    await router.replace({ path: '/payment/return', query: { order_id: orderId.value } })
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}
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
