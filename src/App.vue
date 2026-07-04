<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <RouteLoadingBar :active="navigating && !booting" />

  <AppLoadingScreen v-if="booting" />

  <SystemAlertBanner v-if="!route.path.startsWith('/admin') && !route.path.startsWith('/partner')" />

  <div class="app-shell">
    <template v-if="!isStandaloneRoute">
      <SiteHeader />
      <main id="main-content" class="app-main" :class="{ 'app-main--full': isFullWidth }">
        <router-view />
      </main>
      <AppFooter />
    </template>
    <router-view v-else />
    <CartToast v-if="showShopCartToast" />
    <ChatWidget v-if="showChat" :hotel-slug="hotelSlug" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from '@/components/AppFooter.vue'
import AppLoadingScreen from '@/components/AppLoadingScreen.vue'
import ChatWidget from '@/components/ChatWidget.vue'
import CartToast from '@/components/storefront/CartToast.vue'
import RouteLoadingBar from '@/components/RouteLoadingBar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SystemAlertBanner from '@/components/SystemAlertBanner.vue'
import { useAppBoot } from '@/composables/useAppBoot'
import { useRouteLoading } from '@/composables/useRouteLoading'
import { useNotificationsStore } from '@/stores/notifications'

const route = useRoute()
const { booting } = useAppBoot()
const { navigating } = useRouteLoading()
const notifications = useNotificationsStore()

const isFullWidth = computed(() => route.meta.fullWidth === true)
const isStandaloneRoute = computed(
  () =>
    route.path.startsWith('/hotel/') ||
    route.path.startsWith('/admin') ||
    route.path.startsWith('/partner') ||
    route.meta.standalone === true,
)
const showChat = computed(() => !route.path.startsWith('/admin') && !route.path.startsWith('/partner'))
const showShopCartToast = computed(
  () =>
    !route.path.startsWith('/admin') &&
    !route.path.startsWith('/partner') &&
    !route.path.startsWith('/hotel/') &&
    route.meta.standalone !== true,
)
const hotelSlug = computed(() => (route.params.slug as string) || '')

onMounted(() => {
  notifications.startPolling()
})
onUnmounted(() => {
  notifications.stopPolling()
})

watch(
  () => localStorage.getItem('access_token'),
  () => notifications.loadNotifications(),
)
</script>
