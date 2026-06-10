<template>
  <div class="admin-login-page">
    <form class="admin-login-card admin-form" @submit.prevent="submit">
      <h1>Necha Admin</h1>
      <p>Sign in to manage hotels, products, and orders.</p>
      <p v-if="auth.error" class="admin-error">{{ auth.error }}</p>
      <label>
        Email
        <input v-model="email" type="email" required autocomplete="username" />
      </label>
      <label>
        Password
        <input v-model="password" type="password" required autocomplete="current-password" />
      </label>
      <button type="submit" class="admin-btn admin-btn--primary" style="width: 100%; justify-content: center; padding: 0.75rem" :disabled="auth.loading">
        {{ auth.loading ? 'Signing in…' : 'Sign in' }}
      </button>
      <div class="admin-login-links">
        <router-link to="/">Back to site</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/terms">Terms</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')

async function submit() {
  try {
    await auth.login(email.value, password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
    router.push(redirect)
  } catch {
    // error shown via store
  }
}
</script>
