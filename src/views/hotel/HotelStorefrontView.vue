<template>
  <div v-if="session.hotel">
    <StorefrontPageHero
      class="sf-reveal"
      badge="Your hotel"
      :title="session.hotel.name"
      description="Personal care, beauty & wellness — delivered to your room."
      :show-crumb="false"
    >
      <p class="discover-hero-extra">{{ deliveryNote }}</p>
      <span v-if="session.hotel.is_verified" class="verified-badge">Necha verified hotel partner</span>
    </StorefrontPageHero>

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
    <div v-if="filteredProducts.length" class="sf-product-grid sf-product-grid--cols-4 sf-stagger">
      <StorefrontProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :hotel-slug="session.slug"
        @add="addProduct"
      />
    </div>
    <p v-else class="category-empty">No products in this category yet.</p>

    <div v-if="visibleServices.length" class="sf-section-head sf-reveal" style="margin-top: 28px">
      <h2>Hotel services</h2>
    </div>
    <div v-if="visibleServices.length" class="services-grid sf-stagger" style="margin-bottom: 16px">
      <article v-for="svc in visibleServices" :key="svc.key" class="service-card">
        <div class="service-icon" :style="{ background: svc.colors.bg, color: svc.colors.fg }">{{ svc.iconLabel }}</div>
        <h3>{{ svc.heading }}</h3>
        <p>{{ svc.bodyText }}</p>
        <router-link :to="hotelServicePath(svc.route)">{{ svc.action }} →</router-link>
      </article>
    </div>

    <GuestRequestForm class="sf-reveal" />

    <div v-if="rewardsEnabled" class="rewards-banner sf-reveal">
      <div>
        <h3>Earn Necha rewards on every purchase</h3>
        <p>Every order earns you points — redeem for a discount or withdraw as cash to your mobile money account.</p>
      </div>
      <router-link to="/sign-up" class="rewards-btn">Create account</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useHotelSessionStore } from '@/stores/hotelSession'
import { useCartStore } from '@/stores/cart'
import { useDeliveryNote } from '@/composables/useDeliveryNote'
import { useProductCategoryFilter } from '@/composables/useProductCategories'
import { storefrontConfig, hotelServices } from '@/config/storefront'
import StorefrontPageHero from '@/components/storefront/StorefrontPageHero.vue'
import VerticalFeatures, { type VerticalFeature } from '@/components/home/VerticalFeatures.vue'
import type { IconName } from '@/components/ui/icons'
import StorefrontProductCard from '@/components/storefront/StorefrontProductCard.vue'
import CategoryPills from '@/components/storefront/CategoryPills.vue'
import GuestRequestForm from '@/components/storefront/GuestRequestForm.vue'
import { usePlatformSettings } from '@/composables/usePlatformSettings'
import { toCommerceProduct } from '@/utils/storefront'
import type { StorefrontProduct } from '@/types/storefront'

const session = useHotelSessionStore()
const cart = useCartStore()
const { note: deliveryNote } = useDeliveryNote()
const { ensureLoaded, features } = usePlatformSettings()
const rewardsEnabled = computed(() => features.value.rewards_enabled)

onMounted(() => {
  void ensureLoaded()
})

const productsRef = computed(() => session.products)
const { activeCategory, visibleCategories, filteredProducts } = useProductCategoryFilter(productsRef)

const serviceMeta: Record<string, string> = {
  spa: 'Spa',
  restaurant: 'Dine',
  bar: 'Bar',
  gym: 'Gym',
}

const hotelVerticalFeatures = computed(() => {
  const slug = session.slug
  const base = `/hotel/${slug}`
  const features: Array<VerticalFeature & { service: string }> = [
    { tag: 'Shop', label: 'Personal care', description: 'Wellness products delivered to your room.', action: 'Browse shop', tint: '#5a8f28', icon: 'sparkles' satisfies IconName, to: `${base}/shop`, service: 'shop' },
    { tag: 'Discover', label: 'Discover Tanzania', description: 'Restaurants, tours, events and hotel services.', action: 'Explore', tint: '#534AB7', icon: 'star' satisfies IconName, to: `${base}/discover`, service: 'discover' },
    { tag: 'Food', label: 'Food & bar', description: 'Room service — meals, drinks and bar menu to your door.', action: 'Order now', tint: '#854f0b', icon: 'gift' satisfies IconName, to: `${base}/food`, service: 'food' },
    { tag: 'Spa', label: 'Spa & wellness', description: 'Book a massage, facial or treatment.', action: 'Book session', tint: '#0f6e56', icon: 'spa' satisfies IconName, to: `${base}/spa`, service: 'spa' },
  ]
  const active = new Set(session.hotel?.services || [])
  return features.filter((f) => {
    if (f.service === 'shop') return true
    if (f.service === 'discover') return active.has('discover') || active.has('nearby')
    if (f.service === 'food') return active.has('restaurant') || active.has('bar')
    return active.has(f.service)
  })
})

const visibleServices = computed(() => {
  const hotel = session.hotel
  if (!hotel) return []
  return (hotel.services || [])
    .filter((s) => s in hotelServices && s !== 'discover' && s !== 'nearby')
    .map((s) => {
      const cfg = hotelServices[s as keyof typeof hotelServices]
      return { key: s, ...cfg, iconLabel: serviceMeta[s], bodyText: cfg.body(hotel.name) }
    })
})

function hotelServicePath(route: string) {
  const base = `/hotel/${session.slug}`
  return route ? `${base}/${route}` : base
}

function addProduct(product: StorefrontProduct) {
  if (!session.hotel) return
  cart.add(toCommerceProduct(product, session.slug, session.hotel.code))
}
</script>

<style scoped>
.category-empty {
  padding: 2rem 0;
  text-align: center;
  font-size: 13px;
  color: var(--sf-muted);
}
</style>
