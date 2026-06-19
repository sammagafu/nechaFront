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
        I manage a hotel
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
      <button type="submit" class="sub-btn">Request a partnership call ↗</button>
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
      <button type="submit" class="sub-btn">Apply to list your brand ↗</button>
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
import { appConfig } from '@/config/app'

const props = defineProps<{
  initialTab?: 'hotel' | 'brand'
  wide?: boolean
}>()

const activeTab = ref<'hotel' | 'brand'>(props.initialTab ?? 'hotel')

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
  'Skincare & beauty',
  'Wellness & supplements',
  'Personal care',
  'Natural & organic',
  'Other',
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

function openMailto(subject: string, body: string) {
  window.location.href = `mailto:${appConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function submitHotel() {
  const f = hotelForm.value
  openMailto(
    'Hotel partnership request — Necha Africa',
    [
      'Hotel partnership request',
      '',
      `Hotel: ${f.name}`,
      `Location: ${f.location}`,
      `Rooms: ${f.rooms}`,
      `Role: ${f.role}`,
      `Email: ${f.email}`,
      f.phone ? `Phone: ${f.phone}` : '',
      '',
      'I manage a hotel in Dar es Salaam and want to become a founding partner.',
    ]
      .filter(Boolean)
      .join('\n'),
  )
}

function submitBrand() {
  const f = brandForm.value
  openMailto(
    'Brand listing application — Necha Africa',
    [
      'Brand listing application',
      '',
      `Brand: ${f.name}`,
      `Category: ${f.category}`,
      `Email: ${f.email}`,
      `Monthly units: ${f.units}`,
      `Avg retail price (TZS): ${f.price}`,
      '',
      'Please share the brand onboarding process and timeline.',
    ].join('\n'),
  )
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
</style>
