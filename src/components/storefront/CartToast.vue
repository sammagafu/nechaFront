<template>
  <Transition name="toast">
    <div v-if="visible" class="cart-toast" role="status">
      <span class="cart-toast-icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8.5 6.5 12 13 4"/></svg>
      </span>
      <div>
        <strong>{{ message }}</strong>
        <span>Added to your room cart</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const visible = ref(false)
const message = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

watch(
  () => cart.lastAdded,
  (add) => {
    if (!add) return
    message.value = add.name
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
    }, 2600)
  },
)
</script>

<style scoped>
.cart-toast {
  position: fixed;
  top: 96px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: rgba(44, 44, 42, 0.92);
  backdrop-filter: blur(12px);
  color: #f1efe8;
  border-radius: 12px;
  border: 0.5px solid rgba(211, 209, 199, 0.25);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  font-size: 12px;
  max-width: calc(100vw - 32px);
}

.cart-toast-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cart-toast-icon svg {
  display: block;
}

.cart-toast strong {
  display: block;
  font-weight: 500;
  color: #fff;
}

.cart-toast span {
  color: #888780;
  font-size: 11px;
}

.toast-enter-active {
  animation: sf-toast-in 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.toast-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>
