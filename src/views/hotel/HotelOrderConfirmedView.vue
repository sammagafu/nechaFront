<template>
  <div class="confirm-wrap">
    <div class="confirm-card">
      <div class="confirm-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h1 class="confirm-title">Thank you, your order is on its way.</h1>
      <div class="confirm-body">
        <p><strong>We'll deliver to:</strong><br>{{ session.hotel?.name }}, Room {{ session.roomNumber }}</p>
        <p><strong>Estimated delivery:</strong><br>{{ deliveryEstimate }}</p>
        <p><strong>Order reference:</strong><br>#{{ orderId }}</p>
        <p v-if="orderTotal">
          <strong>Total paid:</strong><br>
          <DualPrice :amount-tzs="orderTotal" stack />
        </p>
        <p v-if="pointsEarned">
          Your order earns you {{ pointsEarned }} Necha points. Create an account to track your points and earn on future orders.
        </p>
        <p>
          Questions?
          <a :href="whatsappLink" class="confirm-link">WhatsApp us: {{ storefrontConfig.whatsapp }}</a>
        </p>
      </div>
      <div class="confirm-actions">
        <router-link :to="`/hotel/${session.slug}`" class="sf-btn-primary sf-btn-primary--block confirm-cta">
          Browse more products →
        </router-link>
        <router-link to="/sign-up" class="sf-btn-ghost confirm-account">Create account</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDeliveryEstimate } from '@/composables/useDeliveryEstimate'
import DualPrice from '@/components/storefront/DualPrice.vue'
import { useHotelSessionStore } from '@/stores/hotelSession'
import { storefrontConfig } from '@/config/storefront'

const route = useRoute()
const session = useHotelSessionStore()
const deliveryEstimate = useDeliveryEstimate()
const orderId = computed(() => (route.query.order as string) || 'PENDING')
const orderTotal = computed(() => {
  const raw = route.query.total
  const n = typeof raw === 'string' ? Number(raw) : NaN
  return Number.isFinite(n) && n > 0 ? n : null
})
const whatsappLink = computed(() => `https://wa.me/${storefrontConfig.whatsapp.replace(/\D/g, '')}`)
const pointsEarned = computed(() => (orderTotal.value ? Math.floor(orderTotal.value / 1000) : null))
</script>

<style scoped>
.confirm-wrap {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

.confirm-card {
  max-width: 420px;
  width: 100%;
  background: var(--sf-white);
  border-radius: 16px;
  padding: 24px;
  border: 0.5px solid var(--sf-warm-grey);
  text-align: center;
}

.confirm-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: var(--sf-green-strip-bg, #eaf3de);
  color: var(--sf-green-checkout, #0f6e56);
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-title {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 16px;
  color: var(--sf-charcoal);
}

.confirm-body {
  text-align: left;
  font-size: 13px;
  color: var(--sf-text-muted);
  line-height: 1.65;
}

.confirm-body p {
  margin: 0 0 12px;
}

.confirm-usd {
  display: block;
  font-size: 10px;
  color: var(--sf-muted);
  margin-top: 2px;
}

.confirm-link {
  color: var(--sf-purple);
  font-weight: 500;
}

.confirm-actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 1.25rem;
}

.confirm-account {
  width: 100%;
}

[data-theme='dark'] .confirm-card {
  background: var(--sf-white);
  border-color: var(--sf-warm-grey);
}

[data-theme='dark'] .confirm-title {
  color: var(--sf-cream);
}

[data-theme='dark'] .confirm-icon {
  background: var(--sf-purple-bg);
  color: var(--sf-purple);
}

[data-theme='dark'] .confirm-link {
  color: var(--sf-purple);
}
</style>
