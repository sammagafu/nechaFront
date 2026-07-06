<template>
  <div class="fwrap" :class="{ 'fwrap--wide': wide }">
    <div class="tabr" role="tablist" aria-label="Partner type">
      <button
        type="button"
        role="tab"
        class="tabb"
        :class="{ on: activeTab === 'hotel' }"
        :aria-selected="activeTab === 'hotel'"
        @click="activeTab = 'hotel'"
      >
        I represent a hotel
      </button>
      <button
        type="button"
        role="tab"
        class="tabb"
        :class="{ on: activeTab === 'brand' }"
        :aria-selected="activeTab === 'brand'"
        @click="activeTab = 'brand'"
      >
        I represent a brand
      </button>
    </div>

    <form v-if="activeTab === 'hotel'" @submit.prevent="submitHotel">
      <div class="fgr">
        <label class="fg">
          <span>Hotel name</span>
          <input v-model="hotelForm.name" type="text" placeholder="Serena Hotel DSM" required />
        </label>
        <label class="fg">
          <span>Location in DSM</span>
          <input v-model="hotelForm.location" type="text" placeholder="Masaki, Oyster Bay…" required />
        </label>
      </div>
      <div class="fgr">
        <label class="fg">
          <span>Number of rooms</span>
          <input v-model="hotelForm.rooms" type="number" min="1" placeholder="40" required />
        </label>
        <label class="fg">
          <span>Your role</span>
          <select v-model="hotelForm.role" required>
            <option v-for="role in hotelRoles" :key="role" :value="role">{{ role }}</option>
          </select>
        </label>
      </div>
      <label class="fg">
        <span>Your name &amp; email</span>
        <input v-model="hotelForm.email" type="email" placeholder="name@hotel.co.tz" required />
      </label>
      <label class="fg">
        <span>Phone (optional — for faster response)</span>
        <input v-model="hotelForm.phone" type="tel" placeholder="+255 7xx xxx xxx" />
      </label>
      <button type="submit" class="sub-btn" :disabled="submitting">{{ submitting ? 'Sending…' : 'Join now ↗' }}</button>
      <p v-if="error" class="form-msg form-msg--error">{{ error }}</p>
      <p v-if="success" class="form-msg form-msg--success">Thank you — we'll be in touch within 24 hours.</p>
    </form>

    <form v-else @submit.prevent="submitBrand">
      <div class="fgr">
        <label class="fg">
          <span>Brand name</span>
          <input v-model="brandForm.name" type="text" placeholder="Your brand name" required />
        </label>
        <label class="fg">
          <span>Category</span>
          <select v-model="brandForm.category" required>
            <option v-for="cat in brandCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </label>
      </div>
      <label class="fg">
        <span>Contact email</span>
        <input v-model="brandForm.email" type="email" placeholder="name@yourbrand.com" required />
      </label>
      <div class="fgr">
        <label class="fg">
          <span>Monthly units available</span>
          <input v-model="brandForm.units" type="number" min="1" placeholder="500" required />
        </label>
        <label class="fg">
          <span>Avg retail price (TZS)</span>
          <input v-model="brandForm.price" type="number" min="1" placeholder="25000" required />
        </label>
      </div>
      <button type="submit" class="sub-btn" :disabled="submitting">{{ submitting ? 'Sending…' : 'Apply to list your brand ↗' }}</button>
      <p v-if="error" class="form-msg form-msg--error">{{ error }}</p>
      <p v-if="success" class="form-msg form-msg--success">Application received — our team will follow up shortly.</p>
    </form>

    <p class="trust">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
      Responses within 24 hours · Your information is never shared
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { submitInquiry, type InquiryType, type SubmitInquiryPayload } from '@/api/inquiries'
import { getApiError } from '@/api/client'

const props = defineProps<{
  initialTab?: 'hotel' | 'brand'
  wide?: boolean
}>()

const activeTab = ref<'hotel' | 'brand'>(props.initialTab ?? 'hotel')
const submitting = ref(false)
const error = ref('')
const success = ref(false)

watch(
  () => props.initialTab,
  (tab) => {
    if (tab) activeTab.value = tab
  },
)

const hotelRoles = [
  'General Manager',
  'Owner / Director',
  'Revenue Manager',
  'Front Office Manager',
  'Other',
]

const brandCategories = [
  'Personal Care',
  'Skin Care',
  'Wellness',
  'Travel Essentials',
  'Gifts',
  'Souvenirs',
  'Local Artisan Products',
  'Tour Services',
]

const hotelForm = ref({
  name: '',
  location: '',
  rooms: '',
  role: hotelRoles[0],
  email: '',
  phone: '',
})

const brandForm = ref({
  name: '',
  category: brandCategories[0],
  email: '',
  units: '',
  price: '',
})

function submitHotel() {
  void postInquiry('hotel_partner', {
    name: hotelForm.value.email.split('@')[0],
    email: hotelForm.value.email,
    phone: hotelForm.value.phone || undefined,
    company: hotelForm.value.name,
    location: hotelForm.value.location,
    role: hotelForm.value.role,
    rooms: Number(hotelForm.value.rooms) || undefined,
    message: 'Hotel partnership request from website.',
  })
}

function submitBrand() {
  void postInquiry('brand_partner', {
    name: brandForm.value.name,
    email: brandForm.value.email,
    company: brandForm.value.name,
    category: brandForm.value.category,
    units: Number(brandForm.value.units) || undefined,
    price: Number(brandForm.value.price) || undefined,
    message: 'Brand listing application from website.',
  })
}

async function postInquiry(type: InquiryType, payload: Omit<SubmitInquiryPayload, 'type'>) {
  submitting.value = true
  error.value = ''
  success.value = false
  try {
    await submitInquiry({ ...payload, type, email: payload.email })
    success.value = true
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    submitting.value = false
  }
}

defineExpose({ setTab: (tab: 'hotel' | 'brand') => { activeTab.value = tab } })
</script>

<style scoped>
.fwrap {
  max-width: 520px;
  margin: 0 auto;
}

.fwrap--wide {
  max-width: none;
  margin: 0;
}

.fwrap--wide .tabr {
  border-radius: var(--radius-lg);
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
}

.fwrap--wide .tabb.on {
  background: var(--color-necha-green);
  color: var(--color-black);
}

.fwrap--wide .sub-btn {
  border-radius: var(--radius-pill);
  background: var(--color-necha-green);
  color: var(--color-black);
  font-weight: 600;
}

.fwrap--wide .sub-btn:hover {
  background: var(--color-necha-green-dark);
  color: var(--color-white);
}

.tabr {
  display: flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  background: var(--color-bg-soft);
}

.tabb {
  flex: 1;
  padding: 9px;
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  background: transparent;
  color: var(--color-body);
}

.tabb.on {
  background: var(--color-black);
  color: #fff;
}

.fgr {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

@media (max-width: 520px) {
  .fgr {
    grid-template-columns: 1fr;
  }
}

.fg {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.fg span {
  font-size: 12px;
  color: var(--color-body);
}

.fg input,
.fg select {
  width: 100%;
  padding: 9px 12px;
  border: 0.5px solid var(--color-border);
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  background: var(--color-surface);
  color: var(--color-text);
}

.sub-btn {
  width: 100%;
  margin-top: 8px;
  padding: 13px;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: var(--color-black);
  color: #fff;
}

.sub-btn:hover {
  background: var(--color-necha-green-dark);
}

.trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--color-muted);
}

.form-msg {
  margin: 0.65rem 0 0;
  font-size: 13px;
}

.form-msg--error {
  color: #b42318;
}

.form-msg--success {
  color: #027a48;
}
</style>
