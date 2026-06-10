import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/ShopView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/shop/category/:categoryId',
      name: 'shop-category',
      component: () => import('@/views/ShopView.vue'),
      meta: { fullWidth: true },
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
      path: '/account',
      name: 'account',
      component: () => import('@/views/AccountView.vue'),
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
      name: 'hotel-partners',
      component: () => import('@/views/HotelPartnersView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/earn-with-necha',
      name: 'earn-with-necha',
      component: () => import('@/views/EarnWithNechaView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/food-order',
      name: 'food-order',
      component: () => import('@/views/FoodOrderView.vue'),
      meta: { fullWidth: true },
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
        { path: 'checkout', name: 'hotel-checkout', component: () => import('@/views/hotel/HotelCheckoutView.vue') },
        { path: 'order-confirmed', name: 'hotel-order-confirmed', component: () => import('@/views/hotel/HotelOrderConfirmedView.vue') },
        { path: 'nearby', name: 'hotel-nearby', component: () => import('@/views/hotel/HotelNearbyView.vue') },
        { path: 'spa', name: 'hotel-spa', component: () => import('@/views/hotel/HotelServicePage.vue'), props: { title: 'Spa & wellness', subtitle: 'Book a massage, facial or treatment at the hotel spa', showDate: true, showTime: true } },
        { path: 'restaurant', name: 'hotel-restaurant', component: () => import('@/views/hotel/HotelServicePage.vue'), props: { title: 'Restaurant', subtitle: 'Reserve a table for lunch or dinner', showDate: true, showTime: true, showGuests: true } },
        { path: 'bar', name: 'hotel-bar', component: () => import('@/views/hotel/HotelServicePage.vue'), props: { title: 'Bar & lounge', subtitle: 'View the cocktail menu or reserve a spot at the bar', showDate: true, showTime: true, showGuests: true } },
        { path: 'gym', name: 'hotel-gym', component: () => import('@/views/hotel/HotelServicePage.vue'), props: { title: 'Gym & fitness', subtitle: 'Book a fitness session or access the hotel gym', showDate: true, showTime: true } },
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
        { path: 'hotels', name: 'admin-hotels', component: () => import('@/views/admin/AdminHotelsView.vue') },
        { path: 'hotels/new', name: 'admin-hotel-new', component: () => import('@/views/admin/AdminHotelFormView.vue') },
        { path: 'hotels/:id/edit', name: 'admin-hotel-edit', component: () => import('@/views/admin/AdminHotelFormView.vue') },
        { path: 'hotels/:hotelId/products', name: 'admin-products', component: () => import('@/views/admin/AdminProductsView.vue') },
        { path: 'hotels/:hotelId/products/new', name: 'admin-product-new', component: () => import('@/views/admin/AdminProductFormView.vue') },
        { path: 'hotels/:hotelId/products/:productId/edit', name: 'admin-product-edit', component: () => import('@/views/admin/AdminProductFormView.vue') },
        { path: 'orders', name: 'admin-orders', component: () => import('@/views/admin/AdminOrdersView.vue') },
        { path: 'reservations', name: 'admin-reservations', component: () => import('@/views/admin/AdminReservationsView.vue') },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.path.startsWith('/admin')) return true

  const { useAuthStore } = await import('@/stores/auth')
  const auth = useAuthStore()

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
