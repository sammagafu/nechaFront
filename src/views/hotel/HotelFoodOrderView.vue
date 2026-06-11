<template>
  <div v-if="session.hotel" class="hotel-food">
    <header class="hotel-food-hero">
      <p class="hotel-food-crumb">{{ session.hotel.name }} / Room service</p>
      <h1>Order food &amp; drinks</h1>
      <p>Delivered to your room at {{ session.hotel.name }} — pay via M-Pesa or card at checkout.</p>
    </header>

    <form class="hotel-food-form sf-form-stack" @submit.prevent="submit">
      <section class="checkout-section">
        <div class="checkout-label">Your details</div>
        <div class="sf-form-fields">
          <input v-model="form.customer_name" placeholder="Full name *" required />
          <input v-model="form.customer_phone" type="tel" placeholder="Phone number *" required />
          <input v-model="form.room_number" placeholder="Room number *" required />
        </div>
      </section>

      <section class="checkout-section">
        <div class="checkout-label">Menu items</div>
        <div class="sf-form-fields">
          <div v-for="(item, index) in form.items" :key="index" class="food-item-row">
            <input v-model="item.name" placeholder="Item name" required />
            <input v-model.number="item.quantity" type="number" min="1" placeholder="Qty" required />
            <input v-model.number="item.unit_price" type="number" min="0" placeholder="Price (TZS)" required />
            <button v-if="form.items.length > 1" type="button" class="food-remove" @click="removeItem(index)">×</button>
          </div>
          <button type="button" class="food-add" @click="addItem">+ Add another item</button>
        </div>
      </section>

      <section class="checkout-section">
        <div class="checkout-label">Notes</div>
        <textarea v-model="form.notes" rows="3" placeholder="Allergies, timing, special requests…" />
      </section>

      <p v-if="error" class="food-error">{{ error }}</p>
      <p v-if="success" class="food-success">{{ success }}</p>

      <button type="submit" class="sf-btn-primary sf-btn-primary--block hotel-food-submit" :disabled="submitting">
        {{ submitting ? 'Sending…' : 'Place food order →' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { createFoodOrder } from '@/api/orders'
import { getApiError } from '@/api/client'
import { useHotelSessionStore } from '@/stores/hotelSession'

const session = useHotelSessionStore()
const submitting = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  customer_name: '',
  customer_phone: '',
  room_number: session.roomNumber,
  notes: '',
  items: [{ name: '', quantity: 1, unit_price: 0, notes: '' }],
})

function addItem() {
  form.items.push({ name: '', quantity: 1, unit_price: 0, notes: '' })
}

function removeItem(index: number) {
  form.items.splice(index, 1)
}

async function submit() {
  if (!session.hotel) return
  submitting.value = true
  error.value = ''
  success.value = ''
  session.setRoomNumber(form.room_number)

  try {
    const order = await createFoodOrder({
      hotel_code: session.hotel.code,
      customer_name: form.customer_name.trim(),
      customer_phone: form.customer_phone.trim(),
      room_number: form.room_number.trim(),
      items: form.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unit_price: i.unit_price,
        notes: i.notes,
      })),
      notes: form.notes,
    })
    success.value = order.id
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.hotel-food {
  padding: 0 20px 100px;
}

.hotel-food-hero {
  padding: 1.5rem 0 1.25rem;
  border-bottom: 0.5px solid var(--sf-warm-grey);
  margin-bottom: 1.25rem;
}

.hotel-food-crumb {
  margin: 0 0 0.35rem;
  font-size: 11px;
  color: var(--sf-muted);
}

.hotel-food-hero h1 {
  margin: 0 0 0.35rem;
  font-size: 20px;
  font-weight: 500;
}

.hotel-food-hero p {
  margin: 0;
  font-size: 13px;
  color: var(--sf-muted);
}

.hotel-food-form {
  padding: 0 0 1rem;
}

.hotel-food-form .checkout-section {
  margin-inline: 0;
}

.food-item-row {
  display: grid;
  grid-template-columns: 1fr 72px 100px auto;
  gap: 0.65rem;
  align-items: center;
}

.food-remove {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--sf-cream);
  cursor: pointer;
}

.food-add {
  justify-self: start;
  border: none;
  background: none;
  font-size: 12px;
  color: var(--sf-purple);
  cursor: pointer;
  padding: 0.25rem 0;
  margin: 0;
}

.food-error {
  color: #c00;
  font-size: 12px;
  margin: 0;
  padding: 0 2px;
}

.food-success {
  color: var(--sf-green-checkout);
  font-size: 12px;
  margin: 0;
  padding: 0 2px;
}

.hotel-food-submit {
  margin-top: 0.25rem;
}
</style>
