<template>
  <div class="page-wrap">
    <div class="card card-elevated payment-state">
      <h1>Payment cancelled</h1>
      <p>Your order <strong v-if="orderId">#{{ shortRef }}</strong> was not paid. You can return to checkout and try again.</p>
      <router-link to="/checkout" class="btn">Back to checkout</router-link>
      <router-link to="/cart" class="btn btn-outline">View cart</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = computed(() => String(route.query.order_id || ''))
const shortRef = computed(() => orderId.value.slice(0, 8).toUpperCase())
</script>

<style scoped>
.payment-state {
  max-width: 520px;
  margin: 2rem auto;
  padding: 2rem;
  display: grid;
  gap: 1rem;
  text-align: center;
}

.payment-state h1 {
  margin: 0;
  font-size: 1.5rem;
}
</style>
