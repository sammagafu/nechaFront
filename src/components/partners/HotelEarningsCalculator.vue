<template>
  <div class="calc" :class="{ 'calc--classic': variant === 'classic' }">
    <template v-if="variant === 'classic'">
      <div class="calc-toggle-row" role="tablist" aria-label="Commission rate">
        <button
          type="button"
          role="tab"
          class="calc-tgl"
          :class="{ on: isFounding }"
          :aria-selected="isFounding"
          @click="isFounding = true"
        >
          Founding partner rate (50%)
        </button>
        <button
          type="button"
          role="tab"
          class="calc-tgl"
          :class="{ on: !isFounding }"
          :aria-selected="!isFounding"
          @click="isFounding = false"
        >
          Standard rate (30%)
        </button>
      </div>

      <div class="calc-row">
        <span class="calc-label">Rooms</span>
        <input
          v-model.number="rooms"
          type="range"
          class="calc-range-visible"
          :min="CALCULATOR_DEFAULTS.roomsMin"
          :max="CALCULATOR_DEFAULTS.roomsMax"
          :step="CALCULATOR_DEFAULTS.roomsStep"
          aria-label="Rooms"
        />
        <span class="calc-value">{{ rooms }} rooms</span>
      </div>
      <div class="calc-row">
        <span class="calc-label">Occupancy</span>
        <input
          v-model.number="occupancyPct"
          type="range"
          class="calc-range-visible"
          :min="CALCULATOR_DEFAULTS.occupancyMin"
          :max="CALCULATOR_DEFAULTS.occupancyMax"
          :step="CALCULATOR_DEFAULTS.occupancyStep"
          aria-label="Occupancy"
        />
        <span class="calc-value">{{ occupancyPct }}%</span>
      </div>
      <div class="calc-row">
        <span class="calc-label">Guest conversion</span>
        <input
          v-model.number="conversionPct"
          type="range"
          class="calc-range-visible"
          :min="CALCULATOR_DEFAULTS.conversionMin"
          :max="CALCULATOR_DEFAULTS.conversionMax"
          :step="CALCULATOR_DEFAULTS.conversionStep"
          aria-label="Guest conversion"
        />
        <span class="calc-value">{{ conversionPct }}%</span>
      </div>

      <hr class="calc-divider" />

      <div class="calc-rr" aria-live="polite">
        <span>Active guests / month</span>
        <span class="calc-grn">{{ result.activeGuests.toLocaleString() }}</span>
      </div>
      <div class="calc-rr">
        <span>Orders placed</span>
        <span class="calc-grn">{{ result.ordersPerMonth.toLocaleString() }}</span>
      </div>
      <div class="calc-rr">
        <span>Total guest spend (TZS 50k avg)</span>
        <span class="calc-grn">{{ formatTzs(result.gmvPerMonth) }}</span>
      </div>
      <div class="calc-rr calc-rr--emph">
        <span>Monthly commission</span>
        <span class="calc-grn">{{ formatTzs(result.hotelEarnings) }}</span>
      </div>
      <div class="calc-rr calc-rr--emph">
        <span>Annual earnings</span>
        <span class="calc-grn">{{ formatTzs(result.annualEarnings) }}</span>
      </div>

      <p class="calc-note">
        Estimates based on model assumptions. Actual results vary by property and guest mix.
        Founding rate applies for Year 1 then reverts to standard.
      </p>
    </template>

    <template v-else>
      <div class="calc-hero" aria-live="polite">
        <div class="calc-hero-sparkles" aria-hidden="true">
          <span v-for="n in 6" :key="n" class="calc-spark" :style="{ '--i': n }" />
        </div>
        <p class="calc-hero-kicker">
          <Icon name="sparkles" :size="16" />
          Your hotel could pocket
        </p>
        <p :key="result.annualEarnings" class="calc-hero-amount">
          {{ formatTzs(result.annualEarnings) }}
        </p>
        <p class="calc-hero-period">per year</p>
        <p class="calc-hero-hint">{{ playfulHint }}</p>
      </div>

      <div class="calc-rate" role="tablist" aria-label="Commission rate">
        <button
          type="button"
          role="tab"
          class="calc-rate-card"
          :class="{ on: isFounding }"
          :aria-selected="isFounding"
          @click="isFounding = true"
        >
          <span class="calc-rate-tag">Founding</span>
          <strong class="calc-rate-pct">50%</strong>
          <span class="calc-rate-label">Year 1 partner rate</span>
        </button>
        <button
          type="button"
          role="tab"
          class="calc-rate-card"
          :class="{ on: !isFounding }"
          :aria-selected="!isFounding"
          @click="isFounding = false"
        >
          <span class="calc-rate-tag calc-rate-tag--std">Standard</span>
          <strong class="calc-rate-pct">30%</strong>
          <span class="calc-rate-label">After founding year</span>
        </button>
      </div>

      <div class="calc-sliders">
        <div class="calc-slider">
          <div class="calc-slider-head">
            <span class="calc-slider-icon" aria-hidden="true">
              <Icon name="package" :size="18" />
            </span>
            <span class="calc-slider-label">Rooms</span>
            <span class="calc-slider-value">{{ rooms }} rooms</span>
          </div>
          <div class="calc-track">
            <div class="calc-track-fill" :style="{ width: roomsPct + '%' }" />
            <input
              v-model.number="rooms"
              type="range"
              class="calc-range"
              :min="CALCULATOR_DEFAULTS.roomsMin"
              :max="CALCULATOR_DEFAULTS.roomsMax"
              :step="CALCULATOR_DEFAULTS.roomsStep"
              aria-label="Rooms"
            />
          </div>
          <p class="calc-slider-tip">{{ roomsTip }}</p>
        </div>

        <div class="calc-slider">
          <div class="calc-slider-head">
            <span class="calc-slider-icon" aria-hidden="true">
              <Icon name="sun" :size="18" />
            </span>
            <span class="calc-slider-label">Occupancy</span>
            <span class="calc-slider-value">{{ occupancyPct }}%</span>
          </div>
          <div class="calc-track">
            <div class="calc-track-fill calc-track-fill--warm" :style="{ width: occupancyPct + '%' }" />
            <input
              v-model.number="occupancyPct"
              type="range"
              class="calc-range"
              :min="CALCULATOR_DEFAULTS.occupancyMin"
              :max="CALCULATOR_DEFAULTS.occupancyMax"
              :step="CALCULATOR_DEFAULTS.occupancyStep"
              aria-label="Occupancy"
            />
          </div>
          <p class="calc-slider-tip">{{ occupancyTip }}</p>
        </div>

        <div class="calc-slider">
          <div class="calc-slider-head">
            <span class="calc-slider-icon" aria-hidden="true">
              <Icon name="gift" :size="18" />
            </span>
            <span class="calc-slider-label">Guest conversion</span>
            <span class="calc-slider-value">{{ conversionPct }}%</span>
          </div>
          <div class="calc-track">
            <div
              class="calc-track-fill calc-track-fill--pop"
              :style="{ width: conversionPct + '%' }"
            />
            <input
              v-model.number="conversionPct"
              type="range"
              class="calc-range"
              :min="CALCULATOR_DEFAULTS.conversionMin"
              :max="CALCULATOR_DEFAULTS.conversionMax"
              :step="CALCULATOR_DEFAULTS.conversionStep"
              aria-label="Guest conversion"
            />
          </div>
          <p class="calc-slider-tip">{{ conversionTip }}</p>
        </div>
      </div>

      <div class="calc-breakdown">
        <article class="calc-stat">
          <span class="calc-stat-icon" aria-hidden="true"><Icon name="user" :size="16" /></span>
          <div>
            <span class="calc-stat-label">Active guests / month</span>
            <strong class="calc-stat-value">{{ result.activeGuests.toLocaleString() }}</strong>
          </div>
        </article>
        <article class="calc-stat">
          <span class="calc-stat-icon" aria-hidden="true"><Icon name="cart" :size="16" /></span>
          <div>
            <span class="calc-stat-label">Orders placed</span>
            <strong class="calc-stat-value">{{ result.ordersPerMonth.toLocaleString() }}</strong>
          </div>
        </article>
        <article class="calc-stat">
          <span class="calc-stat-icon" aria-hidden="true"><Icon name="credit-card" :size="16" /></span>
          <div>
            <span class="calc-stat-label">Guest spend (TZS 50k avg)</span>
            <strong class="calc-stat-value">{{ formatTzs(result.gmvPerMonth) }}</strong>
          </div>
        </article>
      </div>

      <div class="calc-monthly" :key="result.hotelEarnings">
        <span class="calc-monthly-label">Monthly commission</span>
        <strong class="calc-monthly-value">{{ formatTzs(result.hotelEarnings) }}</strong>
        <span v-if="isFounding" class="calc-monthly-badge">Founding rate active</span>
      </div>

      <p class="calc-note">
        Estimates based on model assumptions. Actual results vary by property and guest mix.
        Founding rate applies for Year 1 then reverts to standard.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import {
  CALCULATOR_DEFAULTS,
  calcHotelEarnings,
  formatTzs,
} from '@/utils/hotelEarnings'

withDefaults(
  defineProps<{
    variant?: 'default' | 'classic'
  }>(),
  { variant: 'default' },
)

const isFounding = ref(true)
const rooms = ref<number>(CALCULATOR_DEFAULTS.rooms)
const occupancyPct = ref<number>(CALCULATOR_DEFAULTS.occupancyPct)
const conversionPct = ref<number>(CALCULATOR_DEFAULTS.conversionPct)

const result = computed(() =>
  calcHotelEarnings(rooms.value, occupancyPct.value, conversionPct.value, isFounding.value),
)

const roomsPct = computed(() => {
  const { roomsMin, roomsMax } = CALCULATOR_DEFAULTS
  return ((rooms.value - roomsMin) / (roomsMax - roomsMin)) * 100
})

const playfulHint = computed(() => {
  const annual = result.value.annualEarnings
  if (annual >= 6_000_000) return 'Founding partner energy — that’s serious upside'
  if (annual >= 3_000_000) return 'Enough to fund a new team member or renovation'
  if (annual >= 1_000_000) return 'Passive revenue while guests shop from their rooms'
  return 'Slide the knobs — small tweaks, big difference'
})

const roomsTip = computed(() => {
  if (rooms.value >= 120) return 'Big property — lots of guest footfall'
  if (rooms.value >= 60) return 'Mid-size hotel sweet spot'
  if (rooms.value <= 25) return 'Boutique charm — every order counts'
  return 'Cozy property with room to grow'
})

const occupancyTip = computed(() => {
  if (occupancyPct.value >= 80) return 'Packed house — commission adds up fast'
  if (occupancyPct.value >= 55) return 'Healthy occupancy — keep it rolling'
  return 'Room to grow occupancy and earnings'
})

const conversionTip = computed(() => {
  if (conversionPct.value >= 25) return 'Guests love in-room shopping'
  if (conversionPct.value >= 15) return 'Solid conversion — typical for wellness'
  return 'Even a small bump here moves the needle'
})
</script>

<style scoped>
.calc {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: calc(var(--radius-2xl) + 4px);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-premium);
}

.calc--classic {
  max-width: 540px;
  padding: 1.5rem;
  border-radius: 12px;
  border: 0.5px solid var(--pl-border, var(--color-border));
  box-shadow: none;
}

.calc-toggle-row {
  display: flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 1.25rem;
  border-radius: 8px;
  background: var(--pl-warm, var(--color-bg-soft));
}

.calc-tgl {
  flex: 1;
  padding: 7px;
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  background: transparent;
  color: var(--pl-muted, var(--color-body));
}

.calc-tgl.on {
  background: var(--pl-forest, #1a4731);
  color: #fff;
}

.calc-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.calc-label {
  min-width: 130px;
  font-size: 13px;
  color: var(--pl-muted, var(--color-body));
}

.calc-value {
  min-width: 65px;
  font-size: 13px;
  font-weight: 500;
  text-align: right;
}

.calc-range-visible {
  flex: 1;
  accent-color: var(--pl-teal, #0f6e56);
}

.calc-divider {
  border: none;
  border-top: 0.5px solid var(--pl-border, var(--color-border));
  margin: 1rem 0;
}

.calc-rr {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 7px 0;
  border-bottom: 0.5px solid var(--pl-border, var(--color-border));
  font-size: 13px;
}

.calc-rr--emph {
  border-bottom: none;
  font-weight: 500;
  font-size: 15px;
}

.calc-grn {
  color: var(--pl-teal, #0f6e56);
  font-weight: 500;
}

/* default variant styles below */
.calc-hero {
  position: relative;
  margin-bottom: 1.35rem;
  padding: 1.35rem 1rem 1.15rem;
  border-radius: var(--radius-xl);
  text-align: center;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--color-necha-green) 22%, var(--color-black)) 0%,
    var(--color-black) 55%,
    color-mix(in srgb, var(--color-necha-green-dark) 35%, var(--color-black)) 100%
  );
  color: var(--color-white);
  overflow: hidden;
}

.calc-hero-sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.calc-spark {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-necha-green);
  opacity: 0.45;
  animation: calc-sparkle 3.5s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.45s);
}

.calc-spark:nth-child(1) { top: 12%; left: 8%; }
.calc-spark:nth-child(2) { top: 22%; right: 12%; }
.calc-spark:nth-child(3) { bottom: 28%; left: 14%; }
.calc-spark:nth-child(4) { bottom: 18%; right: 10%; }
.calc-spark:nth-child(5) { top: 45%; left: 4%; }
.calc-spark:nth-child(6) { top: 38%; right: 6%; }

@keyframes calc-sparkle {
  0%, 100% { transform: scale(0.6); opacity: 0.2; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

.calc-hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.35rem;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.calc-hero-amount {
  margin: 0;
  font-family: var(--font-numeric);
  font-size: clamp(2rem, 7vw, 2.75rem);
  font-weight: 600;
  line-height: 1.05;
  color: var(--color-necha-green);
  font-variant-numeric: tabular-nums;
  animation: calc-pop 0.45s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.calc-hero-period {
  margin: 0.15rem 0 0.5rem;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
}

.calc-hero-hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.82);
}

@keyframes calc-pop {
  0% { transform: scale(0.92); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
}

.calc-rate {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1.35rem;
}

.calc-rate-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  padding: 0.85rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-soft);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.calc-rate-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--color-necha-green) 40%, var(--color-border));
}

.calc-rate-card.on {
  border-color: var(--color-necha-green);
  background: color-mix(in srgb, var(--color-necha-green) 10%, var(--color-surface));
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-necha-green) 18%, transparent);
}

.calc-rate-tag {
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-pill);
  background: var(--color-necha-green);
  color: var(--color-black);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.calc-rate-tag--std {
  background: var(--color-border);
  color: var(--color-body);
}

.calc-rate-pct {
  font-family: var(--font-numeric);
  font-size: 1.65rem;
  font-weight: 600;
  line-height: 1.1;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.calc-rate-label {
  font-size: 11px;
  color: var(--color-muted);
  line-height: 1.35;
}

.calc-sliders {
  display: grid;
  gap: 1.15rem;
  margin-bottom: 1.25rem;
}

.calc-slider-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.calc-slider-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-necha-green) 14%, var(--color-bg-soft));
  color: var(--color-necha-green-dark);
}

.calc-slider-label {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
}

.calc-slider-value {
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-pill);
  background: var(--color-black);
  color: var(--color-white);
  font-family: var(--font-numeric);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.calc-track {
  position: relative;
  height: 10px;
  border-radius: var(--radius-pill);
  background: var(--color-bg-soft);
  overflow: hidden;
}

.calc-track-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-necha-green-dark), var(--color-necha-green));
  transition: width 0.15s ease-out;
  pointer-events: none;
}

.calc-track-fill--warm {
  background: linear-gradient(90deg, #b8860b, #f0c674);
}

.calc-track-fill--pop {
  background: linear-gradient(90deg, #6b4fa0, #c4a8f0);
}

.calc-range {
  position: absolute;
  inset: -6px 0;
  width: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.calc-slider-tip {
  margin: 0.4rem 0 0;
  font-size: 11px;
  color: var(--color-muted);
  font-style: italic;
}

.calc-breakdown {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.calc-stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-lg);
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
}

.calc-stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-necha-green-dark);
  border: 1px solid var(--color-border);
}

.calc-stat-label {
  display: block;
  font-size: 11px;
  color: var(--color-muted);
  line-height: 1.3;
}

.calc-stat-value {
  display: block;
  font-family: var(--font-numeric);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-necha-green-dark);
  line-height: 1.25;
  font-variant-numeric: tabular-nums;
}

.calc-monthly {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-necha-green) 18%, var(--color-surface)),
    var(--color-surface)
  );
  border: 1.5px solid color-mix(in srgb, var(--color-necha-green) 35%, var(--color-border));
}

.calc-monthly-label {
  flex: 1;
  min-width: 120px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
}

.calc-monthly-value {
  font-family: var(--font-numeric);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-necha-green-dark);
  font-variant-numeric: tabular-nums;
}

.calc-monthly-badge {
  width: 100%;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-necha-green-dark);
}

.calc-note {
  margin: 0.85rem 0 0;
  font-size: 11px;
  line-height: 1.55;
  color: var(--color-muted);
}

@media (max-width: 480px) {
  .calc:not(.calc--classic) {
    padding: 1.1rem;
    border-radius: var(--radius-xl);
  }

  .calc-rate {
    grid-template-columns: 1fr;
  }

  .calc-hero-amount {
    font-size: 1.85rem;
  }

  .calc-label {
    min-width: 96px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .calc-hero-amount,
  .calc-spark {
    animation: none;
  }

  .calc-rate-card:hover {
    transform: none;
  }
}
</style>
