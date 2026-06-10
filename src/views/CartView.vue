<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Shopping</p>
      <h1 class="page-title">Your cart</h1>
      <p class="page-subtitle">{{ cart.count }} item(s) in your bag</p>
    </header>

    <div v-if="cart.items.length === 0" class="card card-elevated empty-state">
      <p>Your cart is empty.</p>
      <router-link to="/shop" class="btn">Browse products</router-link>
    </div>

    <template v-else>
      <div class="cart-layout">
        <div class="cart-items">
          <article v-for="item in cart.items" :key="item.id" class="card cart-item">
            <div class="cart-item-info">
              <h3>{{ item.name }}</h3>
              <p class="muted">{{ item.description }}</p>
              <p class="item-price">{{ formatPrice(item.price, item.currency) }}</p>
            </div>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button type="button" class="qty-btn" @click="cart.updateQuantity(item.id, item.quantity - 1)">−</button>
                <span>{{ item.quantity }}</span>
                <button type="button" class="qty-btn" @click="cart.updateQuantity(item.id, item.quantity + 1)">+</button>
              </div>
              <p class="line-total">{{ formatPrice(item.price * item.quantity, item.currency) }}</p>
              <button type="button" class="btn-link remove-btn" @click="cart.remove(item.id)">Remove</button>
            </div>
          </article>
        </div>

        <aside class="card card-elevated cart-summary">
          <h3>Order summary</h3>
          <div class="summary-row">
            <span>Subtotal</span>
            <strong>{{ formatPrice(cart.subtotal, currency) }}</strong>
          </div>
          <div class="summary-row muted">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <strong>{{ formatPrice(cart.subtotal, currency) }}</strong>
          </div>
          <router-link to="/checkout" class="btn btn-block">Proceed to checkout</router-link>
          <button type="button" class="btn-link clear-btn" @click="cart.clear()">Clear cart</button>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/commerce'

const cart = useCartStore()
const currency = computed(() => cart.items[0]?.currency || 'USD')
</script>

<style scoped>
.empty-state {
  text-align: center;
  display: grid;
  gap: 1rem;
  justify-items: center;
  padding: 3rem;
}

.cart-layout {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr 320px;
    align-items: start;
  }
}

.cart-items {
  display: grid;
  gap: 1rem;
}

.cart-item {
  display: grid;
  gap: 1rem;
}

@media (min-width: 600px) {
  .cart-item {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
}

.cart-item h3 {
  margin: 0 0 0.35rem;
  font-size: 1.1rem;
}

.item-price,
.line-total {
  font-family: var(--font-display);
  font-weight: 700;
  margin: 0.5rem 0 0;
}

.cart-item-controls {
  text-align: right;
}

.qty-control {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.qty-btn {
  width: var(--touch-min);
  height: var(--touch-min);
  border: none;
  background: var(--color-bg-soft);
  cursor: pointer;
  font-size: 18px;
}

.qty-btn:hover {
  background: var(--color-border);
}

.remove-btn,
.clear-btn {
  margin-top: 0.5rem;
}

.cart-summary h3 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 14px;
}

.summary-row.total {
  border-top: 1px solid var(--color-border);
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 16px;
}

.cart-summary .btn {
  margin-top: 1.25rem;
}

.clear-btn {
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 0.75rem;
}
</style>
