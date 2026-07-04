<template>
  <div class="admin-login-page">
    <aside class="admin-login-brand" aria-hidden="false">
      <div>
        <NechaLogo alt="Necha Africa" class="admin-login-brand-logo" :width="160" :height="40" on-dark />
        <p class="admin-login-brand-kicker">Partner portal</p>
        <h1>Manage your property on Necha</h1>
        <p class="admin-login-brand-lead">
          Track your storefront orders, revenue and product performance in real time — everything
          for your property, in one place.
        </p>
      </div>
      <p class="admin-login-brand-foot">Necha Africa · Partner access</p>
    </aside>

    <div class="admin-login-panel">
      <form class="admin-login-card admin-form" @submit.prevent="submit">
        <NechaLogo alt="Necha Africa" class="admin-login-card-logo" :width="120" :height="32" />
        <h2>Partner sign in</h2>
        <p>Sign in with the credentials provided by the Necha team.</p>
        <p v-if="auth.error" class="admin-error">{{ auth.error }}</p>
        <label>
          Email
          <input v-model="email" type="email" required autocomplete="username" />
        </label>
        <label>
          Password
          <input v-model="password" type="password" required autocomplete="current-password" />
        </label>
        <button
          type="submit"
          class="admin-btn admin-btn--primary"
          style="width: 100%; justify-content: center; padding: 0.75rem"
          :disabled="auth.loading"
        >
          {{ auth.loading ? 'Signing in…' : 'Sign in to portal' }}
        </button>
        <div class="admin-login-links">
          <router-link to="/">← Back to site</router-link>
          <router-link to="/#form-sec">Become a partner</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NechaLogo from '@/components/NechaLogo.vue'
import { useAuthStore } from '@/stores/auth'
import { safeRedirectPath } from '@/utils/redirect'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')

async function submit() {
  try {
    await auth.loginPartner(email.value, password.value)
    router.push(safeRedirectPath(
      typeof route.query.redirect === 'string' ? route.query.redirect : undefined,
      '/partner',
    ))
  } catch {
    // error shown via store
  }
}
</script>
