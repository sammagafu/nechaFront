<template>
  <AuthShell
    eyebrow="Sign up"
    title="Create your Necha account"
    lead="Create a free account to shop curated African beauty and wellness — delivered with care."
    quote="Skincare, haircare, and hotel essentials — one account for all of it."
    :perks="perks"
  >
    <p class="auth-form-label">Fastest way in</p>
    <SocialAuthButtons @success="onAuthSuccess" />

    <div class="auth-divider" role="separator">
      <span>or register with email</span>
    </div>

    <form class="form-stack" @submit.prevent="register">
      <div class="field">
        <label for="register-name">Full name</label>
        <input id="register-name" v-model="registerForm.full_name" type="text" autocomplete="name" required />
      </div>
      <div class="field">
        <label for="register-email">Email</label>
        <input id="register-email" v-model="registerForm.email" type="email" autocomplete="email" required />
      </div>
      <div class="field">
        <label for="register-password">Password</label>
        <input
          id="register-password"
          v-model="registerForm.password"
          type="password"
          autocomplete="new-password"
          minlength="8"
          required
          @input="onPasswordInput"
        />
        <div v-if="registerForm.password" class="password-meter" aria-hidden="true">
          <span
            v-for="n in 4"
            :key="n"
            class="password-meter-bar"
            :class="{ active: passwordScore >= n }"
            :data-tier="passwordTier"
          />
        </div>
        <p class="field-hint">
          {{ passwordHint }}
        </p>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn btn-block" type="submit" :disabled="loading || passwordScore < 2">
        {{ loading ? 'Creating account…' : 'Create my account' }}
      </button>
    </form>

    <template #footer>
      Already with us?
      <router-link to="/sign-in">Sign in instead</router-link>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthShell from '@/components/auth/AuthShell.vue'
import type { AuthPerk } from '@/components/auth/AuthShell.vue'
import SocialAuthButtons from '@/components/SocialAuthButtons.vue'
import { getApiError } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { safeRedirectPath } from '@/utils/redirect'

const perks: AuthPerk[] = [
  { icon: 'truck', label: 'Delivery perks', detail: 'Unlock free delivery thresholds.' },
  { icon: 'gift', label: 'Member-only drops', detail: 'Early access to new arrivals.' },
  { icon: 'sparkles', label: 'Shop & hotel, unified', detail: 'One login for room orders too.' },
]

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const registerForm = reactive({ full_name: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')
const passwordScore = ref(0)

const passwordTier = computed(() => {
  if (passwordScore.value >= 4) return 'strong'
  if (passwordScore.value >= 3) return 'good'
  if (passwordScore.value >= 2) return 'fair'
  return 'weak'
})

const passwordHint = computed(() => {
  if (!registerForm.password) return 'At least 8 characters'
  if (passwordScore.value >= 4) return 'Excellent — you’re set'
  if (passwordScore.value >= 3) return 'Good — add a symbol or number for extra strength'
  if (passwordScore.value >= 2) return 'Fair — mix letters and numbers'
  return 'Keep going — aim for 8+ characters'
})

function scorePassword(value: string) {
  let score = 0
  if (value.length >= 8) score++
  if (value.length >= 12) score++
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score++
  return Math.min(score, 4)
}

function onPasswordInput() {
  passwordScore.value = scorePassword(registerForm.password)
}

async function onAuthSuccess() {
  await auth.loadMe()
  await router.replace(safeRedirectPath(
    typeof route.query.redirect === 'string' ? route.query.redirect : undefined,
    '/account',
  ))
}

async function register() {
  loading.value = true
  error.value = ''
  try {
    await auth.registerCustomer(registerForm)
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

.field-hint {
  margin: 0.35rem 0 0;
  font-size: 12px;
  color: var(--color-muted);
}

.password-meter {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.35rem;
  margin-top: 0.5rem;
}

.password-meter-bar {
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--color-border);
  transition: background 0.25s var(--ease-out);
}

.password-meter-bar.active[data-tier='weak'] {
  background: #d4a574;
}

.password-meter-bar.active[data-tier='fair'] {
  background: #c9b84a;
}

.password-meter-bar.active[data-tier='good'] {
  background: var(--color-necha-green);
}

.password-meter-bar.active[data-tier='strong'] {
  background: linear-gradient(90deg, var(--color-necha-green), var(--color-necha-green-dark));
}
</style>
