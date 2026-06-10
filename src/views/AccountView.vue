<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Account</p>
      <h1 class="page-title">My account</h1>
      <p class="page-subtitle">Sign in or create an account to track orders and reservations.</p>
    </header>

    <div class="grid grid-2">
      <form class="card card-elevated" @submit.prevent="login">
        <h3>Sign in</h3>
        <div class="field">
          <label>Email</label>
          <input v-model="loginForm.email" type="email" required />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="loginForm.password" type="password" required />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button class="btn" type="submit" :disabled="loading">{{ loading ? 'Signing in...' : 'Sign in' }}</button>
      </form>

      <div class="card card-elevated">
        <h3>Quick links</h3>
        <nav class="account-links">
          <router-link to="/cart">Cart</router-link>
          <router-link to="/wishlist">Favourites</router-link>
          <router-link to="/compare">Compare</router-link>
          <router-link to="/checkout">Checkout</router-link>
          <router-link to="/#enter-hotel">Hotel portal</router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import client, { getApiError } from '@/api/client'

const loginForm = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function login() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await client.post('/auth/login', loginForm)
    localStorage.setItem('access_token', data.data.access_token)
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
h3 {
  margin: 0 0 1.25rem;
  font-size: 1.25rem;
}

.account-links {
  display: grid;
  gap: 0.6rem;
}

.account-links a {
  font-size: 14px;
  padding: 0.35rem 0;
  border-bottom: 1px solid var(--color-border);
}

.account-links a:hover {
  color: var(--color-accent-hover);
}
</style>
