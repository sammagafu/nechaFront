<template>
  <AuthShell
    eyebrow="Welcome back"
    title="Sign in to Necha"
    lead="Your orders, favourites, and conversations — all in one calm place."
    quote="Beauty should feel effortless — from checkout to your hotel room."
    :perks="perks"
  >
    <p class="auth-form-label">Continue with</p>
    <SocialAuthButtons @success="onAuthSuccess" />

    <div class="auth-divider" role="separator">
      <span>or email</span>
    </div>

    <form class="form-stack" @submit.prevent="login">
      <div class="field">
        <label for="login-email">Email</label>
        <input id="login-email" v-model="loginForm.email" type="email" autocomplete="email" required />
      </div>
      <div class="field">
        <label for="login-password">Password</label>
        <input id="login-password" v-model="loginForm.password" type="password" autocomplete="current-password" required />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn btn-block" type="submit" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>

    <template #footer>
      New here?
      <router-link to="/sign-up">Create your free account</router-link>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthShell from '@/components/auth/AuthShell.vue'
import type { AuthPerk } from '@/components/auth/AuthShell.vue'
import SocialAuthButtons from '@/components/SocialAuthButtons.vue'
import { getApiError } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { safeRedirectPath } from '@/utils/redirect'

const perks: AuthPerk[] = [
  { icon: 'package', label: 'Live order tracking', detail: 'Follow every delivery across Dar.' },
  { icon: 'heart', label: 'Saved favourites', detail: 'Your ritual list, synced everywhere.' },
  { icon: 'message', label: 'Beauty concierge chat', detail: 'Message our team anytime.' },
]

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const loginForm = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function onAuthSuccess() {
  await auth.loadMe()
  await router.replace(safeRedirectPath(
    typeof route.query.redirect === 'string' ? route.query.redirect : undefined,
    '/account',
  ))
}

async function login() {
  loading.value = true
  error.value = ''
  try {
    await auth.loginCustomer(loginForm.email, loginForm.password)
    await onAuthSuccess()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (auth.isAuthenticated) {
    if (!auth.user) await auth.loadMe()
    if (auth.isCustomer) {
      await router.replace(safeRedirectPath(
        typeof route.query.redirect === 'string' ? route.query.redirect : undefined,
        '/account',
      ))
    }
  }
})
</script>

<style scoped>
.auth-form-label {
  margin: 0 0 0.75rem;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.15rem 0;
  font-size: 12px;
  color: var(--color-muted);
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
</style>
