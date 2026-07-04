<template>
  <div v-if="session.hotel" class="food-page">
    <StorefrontPageHero
      badge="Wellness"
      title="Spa & wellness"
      description="In-house treatments are placed as requests. External services may require payment at checkout."
    />

    <nav class="food-cats" aria-label="Wellness categories">
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
            <span v-if="item.requiresPayment" class="food-tag food-tag--paid">Paid service</span>
          </div>
          <p class="food-desc">{{ item.description }}</p>
          <DualPrice :amount-tzs="item.price" />
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
          Review request
        </button>
      </div>
    </aside>

    <dialog ref="checkoutDialog" class="food-checkout" @close="checkoutOpen = false">
      <form class="food-checkout-form" @submit.prevent="submit">
        <header class="food-checkout-head">
          <h2>{{ hasPaidItems ? 'Your wellness order' : 'Your wellness request' }}</h2>
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
          <input v-model="form.room_number" placeholder="Room number *" required list="wellness-room-numbers" />
          <datalist id="wellness-room-numbers">
            <option v-for="num in roomOptions" :key="num" :value="num" />
          </datalist>
          <textarea v-model="form.notes" rows="2" placeholder="Preferred time or notes…" />
        </div>

        <p v-if="error" class="food-error">{{ error }}</p>
        <p v-if="success" class="food-success">Request placed — reference {{ success }}</p>

        <button type="submit" class="sf-btn-primary sf-btn-primary--block" :disabled="submitting">
          {{ submitting ? 'Sending…' : hasPaidItems ? 'Continue to payment →' : 'Place order →' }}
        </button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createFoodOrder } from '@/api/orders'
import { fetchHotelMenu, fetchHotelRooms } from '@/api/hotels'
import { getApiError } from '@/api/client'
import DualPrice from '@/components/storefront/DualPrice.vue'
import StorefrontPageHero from '@/components/storefront/StorefrontPageHero.vue'
import { useHotelSessionStore } from '@/stores/hotelSession'

interface WellnessMenuItem {
  id: string
  category: string
  name: string
  description: string
  price: number
  tag?: string
  requiresPayment: boolean
}

const session = useHotelSessionStore()
const router = useRouter()
const activeCategory = ref('all')
const checkoutOpen = ref(false)
const checkoutDialog = ref<HTMLDialogElement | null>(null)
const submitting = ref(false)
const error = ref('')
const success = ref('')
const menuCategories = ref([{ id: 'all', label: 'All' }])
const menuItems = ref<WellnessMenuItem[]>([])
const roomOptions = ref<string[]>([])

const cart = reactive<Record<string, { item: WellnessMenuItem; quantity: number }>>({})

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
    requiresPayment: item.requiresPayment,
  })),
)

const totalItems = computed(() => orderLines.value.reduce((n, l) => n + l.quantity, 0))
const orderTotal = computed(() => orderLines.value.reduce((sum, l) => sum + l.unit_price * l.quantity, 0))
const hasPaidItems = computed(() => orderLines.value.some((l) => l.requiresPayment && l.unit_price > 0))

watch(checkoutOpen, (open) => {
  const el = checkoutDialog.value
  if (!el) return
  if (open && !el.open) el.showModal()
  if (!open && el.open) el.close()
})

onMounted(() => void loadCatalog())

watch(() => session.hotel?.slug, () => void loadCatalog())

async function loadCatalog() {
  const slug = session.hotel?.slug
  if (!slug) return
  try {
    const [menu, rooms] = await Promise.all([
      fetchHotelMenu(slug, 'wellness'),
      fetchHotelRooms(slug),
    ])
    if (menu.items.length) {
      menuCategories.value = menu.categories
      menuItems.value = menu.items.map((item) => ({
        id: item.id,
        category: item.category,
        name: item.name,
        description: item.description,
        price: item.price,
        tag: item.tag,
        requiresPayment: item.tag?.toLowerCase().includes('external') || item.menu_kind === 'wellness_paid',
      }))
    }
    roomOptions.value = rooms.map((r) => r.room_number)
  } catch {
    menuItems.value = []
  }
  if (session.roomNumber) form.room_number = session.roomNumber
}

function qty(id: string) {
  return cart[id]?.quantity ?? 0
}

function addItem(item: WellnessMenuItem) {
  cart[item.id] = { item, quantity: 1 }
}

function changeQty(id: string, delta: number) {
  const row = cart[id]
  if (!row) return
  row.quantity += delta
  if (row.quantity <= 0) delete cart[id]
}

function closeCheckout() {
  checkoutOpen.value = false
}

async function submit() {
  if (!session.hotel) return
  submitting.value = true
  error.value = ''
  try {
    session.setRoomNumber(form.room_number)
    const payload = {
      hotel_code: session.hotel.code,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      room_number: form.room_number,
      notes: form.notes ? `Wellness: ${form.notes}` : 'Wellness request',
      items: orderLines.value.map((l) => ({
        name: l.name,
        quantity: l.quantity,
        unit_price: l.unit_price,
      })),
    }
    const order = await createFoodOrder(payload)
    success.value = order.id?.slice(0, 8) ?? 'sent'
    if (hasPaidItems.value) {
      router.push(`/hotel/${session.slug}/checkout`)
      return
    }
    Object.keys(cart).forEach((k) => delete cart[k])
    closeCheckout()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.food-tag--paid {
  background: color-mix(in srgb, var(--sf-purple) 16%, var(--sf-white));
  color: var(--sf-purple);
}

.food-page { padding: 0 0 120px; }
.food-cats { display: flex; gap: 0.45rem; padding: 12px 0 8px; overflow-x: auto; }
.food-cat { flex-shrink: 0; padding: 0.45rem 0.9rem; border: 0.5px solid var(--sf-warm-grey); border-radius: var(--radius-pill); background: var(--sf-white); font-size: 11px; font-weight: 600; cursor: pointer; }
.food-cat.active { background: #000; color: var(--sf-cream); }
.food-menu { display: grid; gap: 0.65rem; padding: 8px 0 0; }
.food-card { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; border-radius: var(--radius-lg); background: var(--sf-white); border: 0.5px solid var(--sf-warm-grey); }
.food-card-head { display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem; }
.food-card h2 { margin: 0; font-size: 15px; font-weight: 600; }
.food-tag { padding: 0.15rem 0.45rem; border-radius: var(--radius-pill); background: color-mix(in srgb, var(--color-necha-green) 16%, var(--sf-white)); font-size: 9px; font-weight: 700; text-transform: uppercase; }
.food-desc { margin: 0.25rem 0 0.35rem; font-size: 12px; color: var(--sf-muted); }
.food-add { width: 40px; height: 40px; border: none; border-radius: 50%; background: #000; color: var(--sf-cream); font-size: 22px; cursor: pointer; }
.food-qty { display: inline-flex; align-items: center; gap: 0.5rem; padding: 4px; border-radius: var(--radius-pill); background: var(--sf-cream); }
.food-order-bar { position: fixed; left: 0; right: 0; bottom: 72px; z-index: 300; pointer-events: none; }
.food-order-bar-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 12px 14px; border-radius: var(--radius-xl); background: rgba(0,0,0,0.92); color: var(--sf-cream); pointer-events: auto; }
.food-order-btn { border: none; border-radius: var(--radius-pill); padding: 0.65rem 1.1rem; background: var(--color-necha-green); color: #fff; font-weight: 600; cursor: pointer; }
.food-checkout { width: min(100%, 420px); margin: auto; padding: 0; border: none; border-radius: var(--radius-xl); }
.food-checkout-form { padding: 1.25rem; }
.food-checkout-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.food-checkout-lines { list-style: none; margin: 0 0 0.75rem; padding: 0; display: grid; gap: 0.45rem; font-size: 13px; }
.food-checkout-lines li { display: flex; justify-content: space-between; gap: 1rem; }
.food-checkout-total { display: flex; justify-content: space-between; padding: 0.75rem 0; margin-bottom: 0.75rem; border-top: 0.5px solid var(--sf-warm-grey); border-bottom: 0.5px solid var(--sf-warm-grey); }
.food-error { color: #c00; font-size: 12px; }
.food-success { color: var(--sf-green-checkout); font-size: 12px; }
</style>
