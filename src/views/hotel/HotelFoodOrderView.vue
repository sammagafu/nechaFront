<template>
  <div v-if="session.hotel" class="food-page">
    <StorefrontPageHero
      badge="Room service"
      title="Food & drinks"
      description="Tap to add items — room service and bar menu delivered to your room. Place order with no upfront payment."
    />

    <nav class="food-cats" aria-label="Menu categories">
      <button
        v-for="cat in menuCategories"
        :key="cat.id"
        type="button"
        class="food-cat"
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        {{ cat.label }}
      </button>
    </nav>

    <div class="food-menu">
      <article v-for="item in visibleItems" :key="item.id" class="food-card">
        <div class="food-card-main">
          <div class="food-card-head">
            <h2>{{ item.name }}</h2>
            <span v-if="item.tag" class="food-tag">{{ item.tag }}</span>
          </div>
          <p class="food-desc">{{ item.description }}</p>
          <p class="food-price"><DualPrice :amount-tzs="item.price" /></p>
        </div>
        <div class="food-card-actions">
          <button
            v-if="!qty(item.id)"
            type="button"
            class="food-add"
            aria-label="Add to order"
            @click="addItem(item)"
          >
            +
          </button>
          <div v-else class="food-qty">
            <button type="button" aria-label="Decrease" @click="changeQty(item.id, -1)">−</button>
            <span>{{ qty(item.id) }}</span>
            <button type="button" aria-label="Increase" @click="changeQty(item.id, 1)">+</button>
          </div>
        </div>
      </article>
    </div>

    <aside v-if="orderLines.length" class="food-order-bar">
      <div class="sf-container food-order-bar-inner">
        <div class="food-order-summary">
          <strong>{{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }}</strong>
          <DualPrice :amount-tzs="orderTotal" />
        </div>
        <button type="button" class="food-order-btn" @click="checkoutOpen = true">
          Review order
        </button>
      </div>
    </aside>

    <dialog ref="checkoutDialog" class="food-checkout" @close="checkoutOpen = false">
      <form class="food-checkout-form" @submit.prevent="submit">
        <header class="food-checkout-head">
          <h2>Your order</h2>
          <button type="button" class="food-checkout-close" aria-label="Close" @click="closeCheckout">×</button>
        </header>

        <ul class="food-checkout-lines">
          <li v-for="line in orderLines" :key="line.id">
            <span>{{ line.quantity }}× {{ line.name }}</span>
            <DualPrice :amount-tzs="line.unit_price * line.quantity" />
          </li>
        </ul>

        <div class="food-checkout-total">
          <span>Total</span>
          <DualPrice :amount-tzs="orderTotal" />
        </div>

        <div class="sf-form-fields food-checkout-fields">
          <input v-model="form.customer_name" placeholder="Full name *" required />
          <input v-model="form.customer_phone" type="tel" placeholder="Phone *" required />
          <input v-model="form.room_number" placeholder="Room number *" required list="food-room-numbers" />
          <datalist id="food-room-numbers">
            <option v-for="num in roomOptions" :key="num" :value="num" />
          </datalist>
          <textarea v-model="form.notes" rows="2" placeholder="Allergies or timing notes…" />
        </div>

        <p v-if="error" class="food-error">{{ error }}</p>
        <p v-if="success" class="food-success">Order placed — reference {{ success }}</p>

        <button type="submit" class="sf-btn-primary sf-btn-primary--block" :disabled="submitting">
          {{ submitting ? 'Sending…' : 'Place order →' }}
        </button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { createFoodOrder } from '@/api/orders'
import { fetchHotelMenu, fetchHotelRooms } from '@/api/hotels'
import { getApiError } from '@/api/client'
import DualPrice from '@/components/storefront/DualPrice.vue'
import StorefrontPageHero from '@/components/storefront/StorefrontPageHero.vue'
import { foodMenuCategories, foodMenuItems, type FoodMenuItem } from '@/config/foodMenu'
import { useHotelSessionStore } from '@/stores/hotelSession'

const session = useHotelSessionStore()
const activeCategory = ref('all')
const checkoutOpen = ref(false)
const checkoutDialog = ref<HTMLDialogElement | null>(null)
const submitting = ref(false)
const error = ref('')
const success = ref('')
const menuCategories = ref(foodMenuCategories)
const menuItems = ref<FoodMenuItem[]>(foodMenuItems)
const roomOptions = ref<string[]>([])

const cart = reactive<Record<string, { item: FoodMenuItem; quantity: number }>>({})

const form = reactive({
  customer_name: '',
  customer_phone: '',
  room_number: session.roomNumber,
  notes: '',
})

const visibleItems = computed(() =>
  activeCategory.value === 'all'
    ? menuItems.value
    : menuItems.value.filter((i) => i.category === activeCategory.value),
)

const orderLines = computed(() =>
  Object.values(cart).map(({ item, quantity }) => ({
    id: item.id,
    name: item.name,
    quantity,
    unit_price: item.price,
  })),
)

const totalItems = computed(() => orderLines.value.reduce((n, l) => n + l.quantity, 0))
const orderTotal = computed(() =>
  orderLines.value.reduce((sum, l) => sum + l.unit_price * l.quantity, 0),
)

watch(checkoutOpen, (open) => {
  const el = checkoutDialog.value
  if (!el) return
  if (open && !el.open) el.showModal()
  if (!open && el.open) el.close()
})

onMounted(() => {
  void loadCatalog()
})

watch(
  () => session.hotel?.slug,
  () => {
    void loadCatalog()
  },
)

async function loadCatalog() {
  const slug = session.hotel?.slug
  if (!slug) return

  try {
    const [menu, rooms] = await Promise.all([fetchHotelMenu(slug), fetchHotelRooms(slug)])
    if (menu.items.length) {
      menuCategories.value = menu.categories
      menuItems.value = menu.items.map((item) => ({
        id: item.id,
        category: item.category,
        name: item.name,
        description: item.description,
        price: item.price,
        tag: item.tag,
      }))
    }
    if (rooms.length) {
      roomOptions.value = rooms.map((room) => room.room_number)
    }
  } catch {
    // Keep bundled demo menu when hotel catalog is empty or unavailable
  }
}

function qty(id: string) {
  return cart[id]?.quantity ?? 0
}

function addItem(item: FoodMenuItem) {
  cart[item.id] = { item, quantity: 1 }
}

function changeQty(id: string, delta: number) {
  const row = cart[id]
  if (!row) return
  const next = row.quantity + delta
  if (next <= 0) delete cart[id]
  else row.quantity = next
}

function closeCheckout() {
  checkoutOpen.value = false
}

async function submit() {
  if (!session.hotel || !orderLines.value.length) return
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
      items: orderLines.value.map((l) => ({
        name: l.name,
        quantity: l.quantity,
        unit_price: l.unit_price,
      })),
      notes: form.notes.trim() || undefined,
    })
    success.value = order.id
    Object.keys(cart).forEach((k) => delete cart[k])
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.food-page {
  padding: 0 0 120px;
}

.food-cats {
  display: flex;
  gap: 0.45rem;
  padding: 12px 0 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.food-cats::-webkit-scrollbar {
  display: none;
}

.food-cat {
  flex-shrink: 0;
  padding: 0.45rem 0.9rem;
  border: 0.5px solid var(--sf-warm-grey);
  border-radius: var(--radius-pill);
  background: var(--sf-white);
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--sf-text-muted);
  cursor: pointer;
}

.food-cat.active {
  background: #000;
  border-color: transparent;
  color: var(--sf-cream);
}

.food-menu {
  display: grid;
  gap: 0.65rem;
  padding: 8px 0 0;
}

.food-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1rem 1rem 1.1rem;
  border-radius: var(--radius-lg);
  background: var(--sf-white);
  border: 0.5px solid var(--sf-warm-grey);
  box-shadow: var(--shadow-xs);
}

.food-card-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.food-card h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: inherit;
}

.food-tag {
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-necha-green) 16%, var(--sf-white));
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--sf-green-dark);
}

.food-desc {
  margin: 0.25rem 0 0.35rem;
  font-size: 12px;
  line-height: 1.45;
  color: var(--sf-muted);
}

.food-price {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: inherit;
}

.food-add {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #000;
  color: var(--sf-cream);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.food-qty {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 4px;
  border-radius: var(--radius-pill);
  background: var(--sf-cream);
  border: 0.5px solid var(--sf-warm-grey);
}

.food-qty button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--sf-white);
  font-size: 18px;
  cursor: pointer;
}

.food-qty span {
  min-width: 1.25rem;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
}

.food-order-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 72px;
  z-index: 300;
  padding-block: 0 8px;
  pointer-events: none;
}

.food-order-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 12px 14px;
  border-radius: var(--radius-xl);
  background: rgba(0, 0, 0, 0.92);
  color: var(--sf-cream);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(12px);
  pointer-events: auto;
}

.food-order-summary {
  display: grid;
  gap: 0.15rem;
  font-size: 12px;
}

.food-order-summary strong {
  font-size: 14px;
}

.food-order-btn {
  border: none;
  border-radius: var(--radius-pill);
  padding: 0.65rem 1.1rem;
  background: var(--color-necha-green);
  color: #fff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.food-checkout {
  width: min(100%, 420px);
  margin: auto;
  padding: 0;
  border: none;
  border-radius: var(--radius-xl);
  background: var(--sf-white);
  box-shadow: var(--shadow-lg);
}

.food-checkout::backdrop {
  background: rgba(0, 0, 0, 0.45);
}

.food-checkout-form {
  padding: 1.25rem;
}

.food-checkout-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.food-checkout-head h2 {
  margin: 0;
  font-size: 1.15rem;
}

.food-checkout-close {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--sf-cream);
  font-size: 20px;
  cursor: pointer;
}

.food-checkout-lines {
  list-style: none;
  margin: 0 0 0.75rem;
  padding: 0;
  display: grid;
  gap: 0.45rem;
  font-size: 13px;
}

.food-checkout-lines li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.food-checkout-total {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  margin-bottom: 0.75rem;
  border-top: 0.5px solid var(--sf-warm-grey);
  border-bottom: 0.5px solid var(--sf-warm-grey);
  font-size: 14px;
}

.food-checkout-fields {
  margin-bottom: 0.75rem;
}

.food-error {
  color: #c00;
  font-size: 12px;
}

.food-success {
  color: var(--sf-green-checkout);
  font-size: 12px;
}
</style>
