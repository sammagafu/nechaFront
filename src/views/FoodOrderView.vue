<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Room service</p>
      <h1 class="page-title">Order food</h1>
      <p class="page-subtitle">Place a room service or table order.</p>
    </header>

    <form class="card card-elevated form-card form-stack" @submit.prevent="submit">
      <div class="grid grid-2">
        <div class="field">
          <label>Name</label>
          <input v-model="form.customer_name" required />
        </div>
        <div class="field">
          <label>Phone</label>
          <input v-model="form.customer_phone" required />
        </div>
        <div class="field">
          <label>Table number</label>
          <input v-model="form.table_number" />
        </div>
        <div class="field">
          <label>Room number</label>
          <input v-model="form.room_number" />
        </div>
      </div>

      <div class="items-section">
        <h3>Items</h3>
        <div v-for="(item, index) in form.items" :key="index" class="item-row card">
          <div class="grid grid-2">
            <div class="field">
              <label>Item</label>
              <input v-model="item.name" required />
            </div>
            <div class="field">
              <label>Quantity</label>
              <input v-model.number="item.quantity" type="number" min="1" required />
            </div>
            <div class="field">
              <label>Unit price (cents)</label>
              <input v-model.number="item.unit_price" type="number" min="0" required />
            </div>
            <div class="field">
              <label>Notes</label>
              <input v-model="item.notes" />
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-outline btn-sm" @click="addItem">Add item</button>
      </div>

      <div class="field">
        <label>Order notes</label>
        <textarea v-model="form.notes" rows="3" />
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn" type="submit" :disabled="submitting">
        {{ submitting ? 'Placing order...' : 'Place order' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createFoodOrder } from '@/api/orders'
import { getApiError } from '@/api/client'
import { useHotelStore } from '@/stores/hotel'

const route = useRoute()
const router = useRouter()
const hotelStore = useHotelStore()

const code = computed(() => String(route.params.code))
const submitting = ref(false)
const error = ref('')

const form = reactive({
  customer_name: '',
  customer_phone: '',
  table_number: '',
  room_number: '',
  notes: '',
  items: [{ name: 'Jollof Rice', quantity: 1, unit_price: 1500, notes: '' }],
})

onMounted(async () => {
  if (!hotelStore.currentHotel || hotelStore.hotelCode !== code.value) {
    await hotelStore.loadHotel(code.value)
  }
})

function addItem() {
  form.items.push({ name: '', quantity: 1, unit_price: 0, notes: '' })
}

async function submit() {
  submitting.value = true
  error.value = ''
  try {
    const order = await createFoodOrder({
      hotel_code: code.value,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      table_number: form.table_number || undefined,
      room_number: form.room_number || undefined,
      notes: form.notes || undefined,
      items: form.items,
    })
    router.push(`/orders/${order.id}/track`)
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-card {
  display: grid;
  gap: 1rem;
}

.items-section h3 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
}

.item-row {
  margin-bottom: 0.75rem;
  background: var(--color-bg-soft);
}
</style>
