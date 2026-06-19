<template>
  <div v-if="session.hotel" class="checkout-page">
    <div class="checkout-header">
      <span style="font-size: 14px; font-weight: 500">Checkout</span>
      <span style="font-size: 11px; color: var(--sf-muted)">{{ cart.count }} items · {{ formatTZS(cart.subtotal) }}</span>
    </div>

    <form class="sf-form-stack" @submit.prevent="submit">
      <div class="checkout-section">
        <div class="checkout-label">Delivery to your room</div>
        <div class="sf-form-fields">
          <div>
            <span class="sf-field-label">Hotel</span>
            <div class="checkout-hotel-name">{{ session.hotel.name }}</div>
          </div>
          <div>
            <label class="sf-field-label" for="checkout-room">Your room number *</label>
            <input id="checkout-room" v-model="room" type="text" placeholder="e.g. 304" list="checkout-room-numbers" />
            <datalist id="checkout-room-numbers">
              <option v-for="num in roomOptions" :key="num" :value="num" />
            </datalist>
          </div>
        </div>
        <p v-if="roomError" class="checkout-field-error">Please enter your room number</p>
        <p class="checkout-field-hint">Enter your room number so we can deliver directly to your door.</p>
      </div>

      <div class="checkout-section">
        <div class="checkout-label">Your details</div>
        <div class="sf-form-fields">
          <input v-model="fullName" placeholder="Full name *" required />
          <input v-model="phone" type="tel" placeholder="Phone number *" required />
          <input v-model="email" type="email" placeholder="Email (for receipt)" />
        </div>
      </div>

      <div class="checkout-section">
        <div class="checkout-label">Referral code</div>
        <div v-if="session.referralApplied" class="referral-applied">
          <span>Hotel code applied — {{ session.hotel.name }} earns a reward</span>
          <span style="font-family: var(--sf-font-mono); font-weight: 500">{{ session.referralCode }}</span>
        </div>
        <button v-else type="button" style="font-size: 11px; color: var(--sf-purple)" @click="session.restoreReferral()">Re-apply hotel code</button>
        <button v-if="session.referralApplied" type="button" style="font-size: 11px; color: var(--sf-muted); margin-top: 8px" @click="confirmRemoveReferral">Remove code</button>
      </div>

      <div class="checkout-section">
        <div class="checkout-label">Payment</div>
        <p class="checkout-field-hint">You'll pay securely on Selcom — M-Pesa, Tigo Pesa, cards, and more.</p>
      </div>

      <div class="checkout-section">
        <div class="checkout-label">Order summary</div>
        <div v-for="item in cart.items" :key="item.id" style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px">
          <span style="color: var(--sf-text-muted)">{{ item.name }} × {{ item.quantity }}</span>
          <span>{{ formatTZS(item.price * item.quantity) }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 8px">
          <span>Subtotal</span><span>{{ formatTZS(cart.subtotal) }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px">
          <span>Delivery fee (Zone {{ session.hotel.zone }} — {{ session.hotel.location }})</span>
          <span :style="{ color: fee === 0 ? 'var(--sf-green-checkout)' : undefined }">{{ fee === 0 ? 'Free' : formatTZS(fee) }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 500; margin-top: 10px; padding-top: 10px; border-top: 0.5px solid var(--sf-warm-grey)">
          <span>Total</span><span>{{ formatTZS(total) }}</span>
        </div>
      </div>

      <div class="checkout-submit-wrap">
        <p v-if="submitError" class="checkout-field-error">{{ submitError }}</p>
        <button type="submit" class="sf-btn-primary sf-btn-primary--block" :disabled="submitting">
          {{ submitting ? 'Redirecting to Selcom…' : 'Pay with Selcom →' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createProductOrder } from '@/api/orders'
import { fetchHotelRooms } from '@/api/hotels'
import { getApiError } from '@/api/client'
import { useHotelSessionStore } from '@/stores/hotelSession'
import { useCartStore } from '@/stores/cart'
import { deliveryFee, formatTZS } from '@/composables/usePricing'
import { handleOrderPayment } from '@/utils/checkoutPayment'

const session = useHotelSessionStore()
const cart = useCartStore()
const router = useRouter()

const room = ref(session.roomNumber)
const fullName = ref('')
const phone = ref('')
const email = ref('')
const roomError = ref(false)
const submitError = ref('')
const submitting = ref(false)
const roomOptions = ref<string[]>([])

const fee = computed(() => deliveryFee(cart.subtotal))
const total = computed(() => cart.subtotal + fee.value)

onMounted(() => {
  void loadRooms()
})

watch(
  () => session.hotel?.slug,
  () => {
    void loadRooms()
  },
)

async function loadRooms() {
  const slug = session.hotel?.slug
  if (!slug) return
  try {
    const rooms = await fetchHotelRooms(slug)
    if (rooms.length) {
      roomOptions.value = rooms.map((entry) => entry.room_number)
    }
  } catch {
    // Room suggestions are optional
  }
}

function confirmRemoveReferral() {
  if (window.confirm(`Removing this code means ${session.hotel?.name} won't earn a reward on this purchase. Are you sure?`)) {
    session.removeReferral()
  }
}

async function submit() {
  roomError.value = !room.value.trim()
  if (roomError.value || !fullName.value.trim() || !phone.value.trim()) return
  if (!session.hotel) return

  submitting.value = true
  submitError.value = ''
  session.setRoomNumber(room.value.trim())

  try {
    const base = window.location.origin
    const slug = session.slug
    const order = await createProductOrder({
      hotel_code: session.hotel.code,
      customer_name: fullName.value.trim(),
      customer_phone: phone.value.trim(),
      customer_email: email.value.trim(),
      room_number: room.value.trim(),
      payment_method: 'selcom',
      currency: cart.items[0]?.currency || 'TZS',
      delivery_fee: fee.value,
      return_url: `${base}/hotel/${slug}/payment/return`,
      cancel_url: `${base}/hotel/${slug}/checkout`,
      items: cart.items.map((item) => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      notes: session.referralApplied ? `referral:${session.referralCode}` : '',
    })
    if (handleOrderPayment(order)) {
      cart.clear()
      return
    }
    cart.clear()
    router.push({
      path: `/hotel/${session.slug}/order-confirmed`,
      query: { order: order.id, total: String(order.total_amount) },
    })
  } catch (e) {
    submitError.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.checkout-hotel-name {
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  background: var(--sf-white);
  border: 0.5px solid var(--sf-warm-grey);
  font-size: 13px;
  font-weight: 500;
}

.checkout-field-hint {
  margin: 0.65rem 0 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--sf-muted);
}

.checkout-field-error {
  margin: 0.65rem 0 0;
  font-size: 11px;
  line-height: 1.5;
  color: #c00;
}

.checkout-submit-wrap {
  padding: 0 0 24px;
}
</style>
