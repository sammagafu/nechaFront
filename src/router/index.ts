import { createRouter, createWebHistory } from 'vue-router'
import { safeRedirectPath } from '@/utils/redirect'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    if (from && to.path === from.path && to.name === from.name) return false
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HotelPartnersView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/explore',
      redirect: '/discovery',
    },
    {
      path: '/discovery',
      name: 'discovery',
      component: () => import('@/views/DiscoveryView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/discovery/:slug',
      name: 'discovery-detail',
      component: () => import('@/views/DiscoveryDetailView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/shop',
      redirect: '/',
    },
    {
      path: '/shop/category/:categoryId',
      redirect: '/',
    },
    {
      path: '/product/:slug',
      name: 'product',
      component: () => import('@/views/ProductDetailView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('@/views/WishlistView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/views/CompareView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/payment/return',
      name: 'payment-return',
      component: () => import('@/views/PaymentReturnView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/payment/cancel',
      name: 'payment-cancel',
      component: () => import('@/views/PaymentCancelView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/payment/mock',
      name: 'payment-mock',
      component: () => import('@/views/PaymentMockView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true, fullWidth: true },
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true, fullWidth: true },
    },
    {
      path: '/login',
      redirect: (to) => ({ path: '/sign-in', query: to.query }),
    },
    {
      path: '/register',
      redirect: (to) => ({ path: '/sign-up', query: to.query }),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/AccountView.vue'),
      meta: { requiresCustomer: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/brands',
      name: 'brands',
      component: () => import('@/views/BrandsView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: () => import('@/views/DeliveryView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/hotel-partners',
      redirect: '/',
    },
    {
      path: '/hotel-partners/:rest(.*)',
      redirect: '/',
    },
    {
      path: '/earn-with-necha',
      name: 'earn-with-necha',
      component: () => import('@/views/EarnWithNechaView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/rewards',
      name: 'rewards',
      component: () => import('@/views/RewardsView.vue'),
      meta: { requiresCustomer: true },
    },
    {
      path: '/food-order',
      redirect: '/',
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue'),
    },
    {
      path: '/hotel/:slug',
      component: () => import('@/layouts/HotelLayout.vue'),
      children: [
        { path: '', name: 'hotel-storefront', component: () => import('@/views/hotel/HotelStorefrontView.vue') },
        { path: 'home', redirect: (to) => `/hotel/${to.params.slug}` },
        { path: 'checkout', name: 'hotel-checkout', component: () => import('@/views/hotel/HotelCheckoutView.vue') },
        { path: 'payment/return', name: 'hotel-payment-return', component: () => import('@/views/hotel/HotelPaymentReturnView.vue') },
        { path: 'order-confirmed', name: 'hotel-order-confirmed', component: () => import('@/views/hotel/HotelOrderConfirmedView.vue') },
        { path: 'discover', name: 'hotel-discover', component: () => import('@/views/hotel/HotelDiscoverView.vue') },
        { path: 'discover/:section', name: 'hotel-discover-listing', component: () => import('@/views/hotel/HotelDiscoverListingView.vue') },
        { path: 'nearby', redirect: (to) => `/hotel/${to.params.slug}/discover` },
        { path: 'spa', name: 'hotel-spa', component: () => import('@/views/hotel/HotelWellnessOrderView.vue') },
        { path: 'restaurant', redirect: (to) => `/hotel/${to.params.slug}/food` },
        { path: 'bar', redirect: (to) => `/hotel/${to.params.slug}/food` },
        { path: 'gym', redirect: (to) => `/hotel/${to.params.slug}/spa` },
        { path: 'food', name: 'hotel-food', component: () => import('@/views/hotel/HotelFoodOrderView.vue') },
        { path: 'shop', name: 'hotel-shop', component: () => import('@/views/hotel/HotelShopView.vue') },
        { path: 'product/:productSlug', name: 'hotel-product', component: () => import('@/views/hotel/HotelProductView.vue') },
      ],
    },
    {
      path: '/h/:code',
      name: 'hotel-legacy',
      component: () => import('@/views/LegacyHotelRedirect.vue'),
    },
    {
      path: '/h/:code/:rest(.*)',
      redirect: (to) => `/h/${to.params.code}`,
    },
    {
      path: '/orders/:id/track',
      name: 'order-track',
      component: () => import('@/views/OrderTrackView.vue'),
    },
    {
      path: '/reservations/:id',
      name: 'reservation-detail',
      component: () => import('@/views/ReservationDetailView.vue'),
    },
    {
      path: '/partners/login',
      redirect: '/partner/login',
    },
    {
      path: '/partners',
      redirect: '/partner',
    },
    {
      path: '/partner/login',
      name: 'partner-login',
      component: () => import('@/views/partner/PartnerLoginView.vue'),
      meta: { partnerGuest: true },
    },
    {
      path: '/partner',
      component: () => import('@/layouts/PartnerLayout.vue'),
      meta: { requiresPartner: true },
      children: [
        { path: '', name: 'partner-dashboard', component: () => import('@/views/partner/PartnerDashboardView.vue') },
        { path: 'orders', name: 'partner-orders', component: () => import('@/views/partner/PartnerOrdersView.vue') },
        { path: 'products', name: 'partner-products', component: () => import('@/views/partner/PartnerProductsView.vue') },
        { path: 'menu', name: 'partner-menu', component: () => import('@/views/partner/PartnerMenuView.vue') },
        { path: 'guests', name: 'partner-guests', component: () => import('@/views/partner/PartnerGuestInsightsView.vue') },
        { path: 'referrals', name: 'partner-referrals', component: () => import('@/views/partner/PartnerReferralsView.vue') },
        { path: 'payouts', name: 'partner-payouts', component: () => import('@/views/partner/PartnerPayoutsView.vue') },
        { path: 'settings', name: 'partner-settings', component: () => import('@/views/partner/PartnerSettingsView.vue') },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue'),
      meta: { adminGuest: true },
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAdmin: true },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboardView.vue') },
        { path: 'analytics', name: 'admin-analytics', component: () => import('@/views/admin/AdminAnalyticsView.vue') },
        { path: 'store', name: 'admin-store', component: () => import('@/views/admin/AdminStoreDashboardView.vue') },
        { path: 'store/:hotelId', name: 'admin-store-hotel', component: () => import('@/views/admin/AdminStoreDashboardView.vue') },
        { path: 'hotels', name: 'admin-hotels', component: () => import('@/views/admin/AdminHotelsView.vue') },
        { path: 'hotels/new', name: 'admin-hotel-new', component: () => import('@/views/admin/AdminHotelFormView.vue') },
        { path: 'hotels/:id/edit', name: 'admin-hotel-edit', component: () => import('@/views/admin/AdminHotelFormView.vue') },
        { path: 'hotels/:hotelId/products', name: 'admin-products', component: () => import('@/views/admin/AdminProductsView.vue') },
        { path: 'hotels/:hotelId/products/new', name: 'admin-product-new', component: () => import('@/views/admin/AdminProductFormView.vue') },
        { path: 'hotels/:hotelId/products/:productId/edit', name: 'admin-product-edit', component: () => import('@/views/admin/AdminProductFormView.vue') },
        { path: 'hotels/:hotelId/menu', name: 'admin-menu', component: () => import('@/views/admin/AdminMenuItemsView.vue') },
        { path: 'hotels/:hotelId/menu/new', name: 'admin-menu-new', component: () => import('@/views/admin/AdminMenuItemFormView.vue') },
        { path: 'hotels/:hotelId/menu/:itemId/edit', name: 'admin-menu-edit', component: () => import('@/views/admin/AdminMenuItemFormView.vue') },
        { path: 'import/:hotelId?', name: 'admin-hotel-import', component: () => import('@/views/admin/AdminHotelImportView.vue') },
        { path: 'orders', name: 'admin-orders', component: () => import('@/views/admin/AdminOrdersView.vue') },
        { path: 'orders/:id', name: 'admin-order-detail', component: () => import('@/views/admin/AdminOrderDetailView.vue') },
        { path: 'guest-stays', name: 'admin-guest-stays', component: () => import('@/views/admin/AdminGuestStaysView.vue') },
        { path: 'reservations', name: 'admin-reservations', component: () => import('@/views/admin/AdminReservationsView.vue') },
        { path: 'reservations/:id', name: 'admin-reservation-detail', component: () => import('@/views/admin/AdminReservationDetailView.vue') },
        { path: 'discovery', name: 'admin-discovery', component: () => import('@/views/admin/AdminDiscoveryView.vue') },
        { path: 'discovery/new', name: 'admin-discovery-new', component: () => import('@/views/admin/AdminDiscoveryFormView.vue') },
        { path: 'discovery/:id/edit', name: 'admin-discovery-edit', component: () => import('@/views/admin/AdminDiscoveryFormView.vue') },
        { path: 'chat', name: 'admin-chat', component: () => import('@/views/admin/AdminChatView.vue') },
        { path: 'chat/:id', name: 'admin-chat-detail', component: () => import('@/views/admin/AdminChatView.vue') },
        { path: 'alerts', name: 'admin-alerts', component: () => import('@/views/admin/AdminAlertsView.vue') },
        { path: 'webhooks', name: 'admin-webhooks', component: () => import('@/views/admin/AdminWebhooksView.vue') },
        { path: 'inquiries', name: 'admin-inquiries', component: () => import('@/views/admin/AdminInquiriesView.vue') },
        { path: 'influencers', name: 'admin-influencers', component: () => import('@/views/admin/AdminInfluencersView.vue') },
        { path: 'catalogue', name: 'admin-catalogue', component: () => import('@/views/admin/AdminCatalogueView.vue') },
        { path: 'commission-rules', name: 'admin-commission-rules', component: () => import('@/views/admin/AdminCommissionRulesView.vue') },
        { path: 'payouts', name: 'admin-payouts', component: () => import('@/views/admin/AdminPayoutsView.vue') },
        { path: 'settings', name: 'admin-settings', component: () => import('@/views/admin/AdminPlatformSettingsView.vue') },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const { useAuthStore } = await import('@/stores/auth')
  const auth = useAuthStore()
  const { usePlatformSettings } = await import('@/composables/usePlatformSettings')
  const platform = usePlatformSettings()
  await platform.ensureLoaded()

  if (to.path.startsWith('/partner')) {
    if (!platform.isFeatureEnabled('partner_portal_enabled')) {
      return { path: '/' }
    }
    if (to.meta.partnerGuest) {
      if (auth.token) {
        if (!auth.user) await auth.loadMe()
        if (auth.isPartner) return { path: '/partner' }
      }
      return true
    }
    if (to.meta.requiresPartner) {
      if (!auth.token) return { name: 'partner-login', query: { redirect: to.fullPath } }
      if (!auth.user) await auth.loadMe()
      if (!auth.isPartner) {
        auth.logout()
        return { name: 'partner-login' }
      }
    }
    return true
  }

  if (!to.path.startsWith('/admin')) {
    const shopCartRoutes = new Set([
      'home',
      'shop',
      'shop-category',
      'product',
      'cart',
      'checkout',
      'compare',
      'wishlist',
    ])
    if (shopCartRoutes.has(String(to.name ?? ''))) {
      const { useCartStore } = await import('@/stores/cart')
      const { SHOP_CART_SCOPE } = await import('@/utils/cartScope')
      useCartStore().setScope(SHOP_CART_SCOPE)
    }

    if (to.meta.guestOnly || to.meta.requiresCustomer) {
      if (auth.token && !auth.user) await auth.loadMe()
    }

    if (to.meta.guestOnly && auth.isCustomer) {
      return safeRedirectPath(
        typeof to.query.redirect === 'string' ? to.query.redirect : undefined,
        '/account',
      )
    }

    if (typeof to.meta.title === 'string') {
      document.title = `${to.meta.title} · Necha Africa`
    } else {
      document.title = 'Necha Africa'
    }

    if (to.meta.requiresCustomer) {
      if (!auth.token) {
        return { name: 'sign-in', query: { redirect: to.fullPath } }
      }
      if (!auth.isCustomer) {
        return { name: 'sign-in', query: { redirect: to.fullPath } }
      }
    }

    if (to.name === 'rewards' && !platform.isFeatureEnabled('rewards_enabled')) {
      return { path: '/' }
    }

    return true
  }

  if (to.meta.adminGuest) {
    if (auth.token) {
      if (!auth.user) await auth.loadMe()
      if (auth.isAdmin) return { path: '/admin' }
    }
    return true
  }

  if (to.meta.requiresAdmin) {
    if (!auth.token) return { name: 'admin-login', query: { redirect: to.fullPath } }
    if (!auth.user) await auth.loadMe()
    if (!auth.isAdmin) {
      auth.logout()
      return { name: 'admin-login' }
    }
  }

  return true
})

export default router
