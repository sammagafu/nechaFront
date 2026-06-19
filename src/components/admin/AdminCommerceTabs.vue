<template>
  <div class="admin-commerce-shell">
    <nav class="admin-commerce-tabs" aria-label="Commerce sections">
      <router-link
        to="/admin/orders"
        class="admin-commerce-tab"
        active-class=""
        exact-active-class=""
        :class="{ 'admin-commerce-tab--active': isOrders }"
      >
        <span class="admin-commerce-tab-label">Orders</span>
        <span class="admin-commerce-tab-hint">Shop &amp; room service</span>
      </router-link>
      <router-link
        to="/admin/reservations"
        class="admin-commerce-tab"
        active-class=""
        exact-active-class=""
        :class="{ 'admin-commerce-tab--active': isReservations }"
      >
        <span class="admin-commerce-tab-label">Reservations</span>
        <span class="admin-commerce-tab-hint">Room &amp; table bookings</span>
      </router-link>
    </nav>

    <div class="admin-commerce-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isOrders = computed(() => route.path.startsWith('/admin/orders'))
const isReservations = computed(() => route.path.startsWith('/admin/reservations'))
</script>
