<template>
  <div v-if="session.hotel">
    <section class="hotel-hero sf-reveal">
      <div class="hotel-avatar">
        <img v-if="session.hotel.logo_url" :src="session.hotel.logo_url" :alt="session.hotel.name" />
        <span v-else>{{ session.hotel.initials }}</span>
      </div>
      <div>
        <h1>{{ session.hotel.name }}</h1>
        <p>Personal care, beauty &amp; wellness — delivered to your room.</p>
        <p class="delivery-note-live">{{ deliveryNote }}</p>
        <span v-if="session.hotel.is_verified" class="verified-badge">Necha verified hotel partner</span>
      </div>
    </section>

    <div class="delivery-strip sf-reveal sf-reveal-1">
      <div class="delivery-strip-track">
        <span>Free delivery on orders over TZS 180,000</span>
        <span>{{ storefrontConfig.deliveryMinutes }} delivery</span>
        <span>Electric vehicle delivery</span>
        <span>African beauty brands</span>
        <span>Free delivery on orders over TZS 180,000</span>
        <span>{{ storefrontConfig.deliveryMinutes }} delivery</span>
        <span>Electric vehicle delivery</span>
        <span>African beauty brands</span>
      </div>
    </div>

    <div v-if="session.referralApplied && session.referralCode" class="referral-box sf-reveal sf-reveal-2">
      <div style="display: flex; gap: 12px; align-items: center">
        <div class="referral-gift">Ref</div>
        <div>
          <div style="font-size: 12px; font-weight: 500">Hotel referral code applied</div>
          <div style="font-size: 11px; color: var(--sf-muted)">Your hotel earns a reward on every purchase — automatically.</div>
        </div>
      </div>
      <span class="referral-code">{{ session.referralCode }}</span>
    </div>

    <VerticalFeatures
      v-if="hotelVerticalFeatures.length"
      eyebrow="Guest services"
      title="Everything for your stay"
      :items="hotelVerticalFeatures"
      variant="hotel"
    />

    <CategoryPills
      v-model="activeCategory"
      :categories="visibleCategories"
      :products="session.products"
      class="sf-reveal sf-reveal-3"
    />

    <div class="sf-section-head sf-reveal sf-reveal-4">
      <h2>Guest favourites</h2>
      <router-link :to="`/hotel/${session.slug}/shop`">View all →</router-link>
    </div>
    <div v-if="filteredProducts.length" class="sf-product-grid sf-stagger">
      <StorefrontProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :hotel-slug="session.slug"
        @add="addProduct"
      />
    </div>
    <p v-else class="category-empty">No products in this category yet.</p>

    <div v-if="session.hotel.services?.length" class="sf-section-head sf-reveal" style="margin-top: 28px">
      <h2>Hotel services</h2>
      <router-link :to="`/hotel/${session.slug}/nearby`">See all →</router-link>
    </div>
    <div v-if="session.hotel.services?.length" class="services-grid sf-stagger" style="margin-bottom: 16px">
      <article v-for="svc in visibleServices" :key="svc.key" class="service-card">
        <div class="service-icon" :style="{ background: svc.colors.bg, color: svc.colors.fg }">{{ svc.iconLabel }}</div>
        <h3>{{ svc.heading }}</h3>
        <p>{{ svc.bodyText }}</p>
        <router-link :to="`/hotel/${session.slug}/${svc.route}`">{{ svc.action }} →</router-link>
      </article>
    </div>

    <div class="rewards-banner sf-reveal">
      <div>
        <h3>Earn Necha rewards on every purchase</h3>
        <p>Every order earns you points — redeem for a discount or withdraw as cash to your mobile money account.</p>
      </div>
      <router-link to="/account" class="rewards-btn">Create account</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHotelSessionStore } from '@/stores/hotelSession'
import { useCartStore } from '@/stores/cart'
import { useDeliveryNote } from '@/composables/useDeliveryNote'
import { useProductCategoryFilter } from '@/composables/useProductCategories'
import { storefrontConfig, hotelServices } from '@/config/storefront'
import VerticalFeatures from '@/components/home/VerticalFeatures.vue'
import StorefrontProductCard from '@/components/storefront/StorefrontProductCard.vue'
import CategoryPills from '@/components/storefront/CategoryPills.vue'
import { toCommerceProduct } from '@/utils/storefront'
import type { StorefrontProduct } from '@/types/storefront'

const session = useHotelSessionStore()
const cart = useCartStore()
const { note: deliveryNote } = useDeliveryNote()

const productsRef = computed(() => session.products)
const { activeCategory, visibleCategories, filteredProducts } = useProductCategoryFilter(productsRef)

const serviceMeta: Record<string, string> = {
  spa: 'Spa',
  restaurant: 'Dine',
  bar: 'Bar',
  nearby: 'Near',
  gym: 'Gym',
}

const hotelVerticalFeatures = computed(() => {
  const slug = session.slug
  const base = `/hotel/${slug}`
  const features = [
    { tag: 'Shop', label: 'Personal care', description: 'Wellness products delivered to your room.', action: 'Browse shop', tint: '#5a8f28', to: `${base}/shop`, service: 'shop' },
    { tag: 'Food', label: 'Order food', description: 'Room service — meals and drinks to your door.', action: 'Order now', tint: '#854f0b', to: `${base}/food`, service: 'food' },
    { tag: 'Spa', label: 'Spa & wellness', description: 'Book a massage, facial or treatment.', action: 'Book session', tint: '#0f6e56', to: `${base}/spa`, service: 'spa' },
    { tag: 'Dine', label: 'Restaurant', description: 'Reserve lunch or dinner at the hotel.', action: 'Reserve', tint: '#534AB7', to: `${base}/restaurant`, service: 'restaurant' },
    { tag: 'Bar', label: 'Bar & lounge', description: 'Cocktails and lounge reservations.', action: 'View menu', tint: '#2c2c2a', to: `${base}/bar`, service: 'bar' },
    { tag: 'Near', label: 'Nearby', description: 'Restaurants and experiences around the hotel.', action: 'Explore', tint: '#444441', to: `${base}/nearby`, service: 'nearby' },
  ]
  const active = new Set(session.hotel?.services || [])
  return features.filter((f) => f.service === 'shop' || f.service === 'food' || active.has(f.service))
})

const visibleServices = computed(() => {
  const hotel = session.hotel
  if (!hotel) return []
  return (hotel.services || [])
    .filter((s) => s in hotelServices)
    .map((s) => {
      const cfg = hotelServices[s as keyof typeof hotelServices]
      const bodyText = s === 'nearby' ? cfg.body(hotel.location) : cfg.body(hotel.name)
      return { key: s, ...cfg, iconLabel: serviceMeta[s], bodyText }
    })
})

function addProduct(product: StorefrontProduct) {
  if (!session.hotel) return
  cart.add(toCommerceProduct(product, session.slug, session.hotel.code))
}
</script>

<style scoped>
.delivery-note-live {
  font-style: italic;
  opacity: 0.9;
}

.category-empty {
  padding: 2rem 20px;
  text-align: center;
  font-size: 13px;
  color: var(--sf-muted);
}
</style>
