<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Checkout</p>
      <h1 class="page-title">Checkout</h1>
      <p class="page-subtitle">Complete your beauty order</p>
    </header>

    <div v-if="cart.items.length === 0 && !orderPlaced" class="card card-elevated empty-state">
      <p>Your cart is empty.</p>
      <router-link to="/shop" class="btn">Browse products</router-link>
    </div>

    <div v-else-if="orderPlaced" class="card card-elevated success-state">
      <h2 class="success">Order placed!</h2>
      <p>Reference: <strong>{{ orderRef }}</strong></p>
      <p class="muted">Thank you for shopping with Necha Africa.</p>
      <router-link v-if="orderId" :to="`/orders/${orderId}/track`" class="btn btn-outline">Track order</router-link>
      <router-link to="/" class="btn">Back to home</router-link>
    </div>

    <form v-else class="checkout-layout" @submit.prevent="placeOrder">
      <div class="card card-elevated checkout-form form-stack">
        <h3>Billing details</h3>
        <div class="grid grid-2">
          <div class="field">
            <label>First name</label>
            <input v-model="form.firstName" required />
          </div>
          <div class="field">
            <label>Last name</label>
            <input v-model="form.lastName" required />
          </div>
          <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" required />
          </div>
          <div class="field">
            <label>Phone</label>
            <input v-model="form.phone" required />
          </div>
        </div>
        <div class="field">
          <label>Address</label>
          <input v-model="form.address" required />
        </div>
        <div class="grid grid-2">
          <div class="field">
            <label>City</label>
            <input v-model="form.city" required />
          </div>
          <div class="field">
            <label>Country</label>
            <input v-model="form.country" required />
          </div>
        </div>
        <div class="field">
          <label>Order notes (optional)</label>
          <textarea v-model="form.notes" rows="3" />
        </div>
      </div>

      <aside class="card card-elevated order-summary">
        <h3>Your order</h3>
        <ul class="order-lines">
          <li v-for="item in cart.items" :key="item.id">
            <span>{{ item.name }} × {{ item.quantity }}</span>
            <span>{{ formatPrice(item.price * item.quantity, item.currency) }}</span>
          </li>
        </ul>
        <div class="summary-row total">
          <span>Total</span>
          <strong>{{ formatPrice(cart.subtotal, currency) }}</strong>
        </div>
        <p class="payment-note muted">Pay securely with Selcom — M-Pesa, Tigo Pesa, cards, and more.</p>
        <button class="btn btn-block" type="submit" :disabled="submitting">
          {{ submitting ? 'Redirecting to payment...' : 'Pay with Selcom' }}
        </button>
        <p v-if="submitError" class="error">{{ submitError }}</p>
        <router-link to="/cart" class="btn-link back-link">← Back to cart</router-link>
      </aside>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { createProductOrder } from '@/api/orders'
import { getApiError } from '@/api/client'
import { catalogConfig } from '@/config/app'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/commerce'
import { handleOrderPayment } from '@/utils/checkoutPayment'

const cart = useCartStore()
const submitting = ref(false)
const orderPlaced = ref(false)
const orderRef = ref('')
const orderId = ref('')
const submitError = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  notes: '',
})

const currency = computed(() => cart.items[0]?.currency || 'USD')

async function placeOrder() {
  submitting.value = true
  submitError.value = ''
  try {
    const order = await createProductOrder({
      hotel_code: catalogConfig.hotelCode,
      customer_name: `${form.firstName} ${form.lastName}`.trim(),
      customer_phone: form.phone,
      customer_email: form.email,
      address: form.address,
      city: form.city,
      country: form.country,
      currency: currency.value,
      return_url: `${window.location.origin}/payment/return`,
      cancel_url: `${window.location.origin}/payment/cancel`,
      items: cart.items.map((item) => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      notes: form.notes,
    })
    if (handleOrderPayment(order)) {
      cart.clear()
      return
    }
    orderId.value = order.id
    orderRef.value = order.id.slice(0, 8).toUpperCase()
    cart.clear()
    orderPlaced.value = true
  } catch (e) {
    submitError.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.empty-state,
.success-state {
  text-align: center;
  display: grid;
  gap: 1rem;
  justify-items: center;
  padding: 3rem;
}

.checkout-layout {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr 340px;
    align-items: start;
  }
}

.checkout-form h3,
.order-summary h3 {
  margin: 0;
  font-size: 1.25rem;
  line-height: var(--leading-display);
}

.checkout-form .grid {
  gap: var(--form-gap);
}

.order-lines {
  margin: 0 0 1rem;
  padding: 0;
  list-style: none;
}

.order-lines li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0;
  font-size: 14px;
  border-bottom: 1px solid var(--color-border);
}

.summary-row.total {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  font-size: 16px;
  border-top: 1px solid var(--color-border);
}

.payment-note {
  font-size: 12px;
  margin: 0 0 1rem;
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 0.75rem;
}

.error {
  color: var(--color-error);
  font-size: 14px;
  margin: 0.75rem 0 0;
}
</style>
