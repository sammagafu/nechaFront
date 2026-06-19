<template>
  <div class="social-auth">
    <div v-if="isGoogleSignInEnabled" class="social-auth-google-wrap">
      <div class="social-auth-google-visual" aria-hidden="true">
        <svg class="social-auth-google-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>{{ loading ? 'Signing in…' : 'Continue with Google' }}</span>
      </div>
      <div ref="googleButtonEl" class="social-auth-google-overlay" :aria-busy="loading" />
    </div>
    <button
      v-else
      type="button"
      class="social-auth-google-fallback"
      disabled
      title="Set VITE_GOOGLE_CLIENT_ID to enable Google Sign-In"
    >
      <svg class="social-auth-google-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </button>

    <button
      type="button"
      class="social-auth-apple"
      :class="{ 'social-auth-apple--disabled': !isAppleSignInEnabled }"
      :disabled="loading || !isAppleSignInEnabled"
      :title="isAppleSignInEnabled ? undefined : 'Set VITE_APPLE_CLIENT_ID to enable Apple Sign-In'"
      @click="signInWithApple"
    >
      <span aria-hidden="true"></span>
      {{ loading ? 'Signing in…' : 'Continue with Apple' }}
    </button>

    <p v-if="error" class="social-auth-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { authConfig, isAppleSignInEnabled, isGoogleSignInEnabled } from '@/config/auth'
import { getApiError } from '@/api/client'
import { readHotelContext } from '@/utils/hotelContext'

const emit = defineEmits<{ success: [] }>()

const auth = useAuthStore()
const theme = useThemeStore()
const googleButtonEl = ref<HTMLElement | null>(null)
const loading = ref(false)
const error = ref('')

let googleButtonWidth = 0
let resizeObserver: ResizeObserver | undefined

type GoogleAccounts = {
  accounts: {
    id: {
      initialize: (cfg: Record<string, unknown>) => void
      renderButton: (el: HTMLElement, cfg: Record<string, unknown>) => void
    }
  }
}

function loadScript(src: string, id: string) {
  if (document.getElementById(id)) return Promise.resolve()
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${id}`))
    document.head.appendChild(script)
  })
}

async function handleGoogleCredential(response: { credential: string }) {
  loading.value = true
  error.value = ''
  try {
    await auth.loginWithGoogle(response.credential, readHotelContext())
    emit('success')
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function signInWithApple() {
  if (!isAppleSignInEnabled) return
  loading.value = true
  error.value = ''
  try {
    await loadScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js', 'apple-auth-js')
    const AppleID = (window as Window & {
      AppleID?: {
        auth: {
          init: (cfg: Record<string, unknown>) => void
          signIn: () => Promise<{
            authorization: { id_token: string }
            user?: { name?: { firstName?: string; lastName?: string } }
          }>
        }
      }
    }).AppleID
    if (!AppleID) throw new Error('Apple Sign In unavailable')
    AppleID.auth.init({
      clientId: authConfig.appleClientId,
      scope: 'name email',
      redirectURI: window.location.origin,
      usePopup: true,
    })
    const result = await AppleID.auth.signIn()
    const fullName = [result.user?.name?.firstName, result.user?.name?.lastName].filter(Boolean).join(' ')
    await auth.loginWithApple(result.authorization.id_token, fullName, readHotelContext())
    emit('success')
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

function googleButtonTheme() {
  return theme.mode === 'dark' ? 'filled_black' : 'outline'
}

function renderGoogleButton() {
  const google = (window as Window & { google?: GoogleAccounts }).google
  if (!google || !googleButtonEl.value || !isGoogleSignInEnabled) return

  const width = Math.max(googleButtonEl.value.offsetWidth, 280)
  if (width === googleButtonWidth && googleButtonEl.value.childElementCount > 0) return
  googleButtonWidth = width
  googleButtonEl.value.innerHTML = ''

  google.accounts.id.initialize({
    client_id: authConfig.googleClientId,
    callback: handleGoogleCredential,
    auto_select: false,
    cancel_on_tap_outside: true,
  })
  google.accounts.id.renderButton(googleButtonEl.value, {
    type: 'standard',
    theme: googleButtonTheme(),
    size: 'large',
    text: 'continue_with',
    shape: 'pill',
    width,
  })
}

async function initGoogleSignIn() {
  if (!isGoogleSignInEnabled || !googleButtonEl.value) return
  try {
    await loadScript('https://accounts.google.com/gsi/client', 'google-gsi')
    await nextTick()
    renderGoogleButton()
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(() => renderGoogleButton())
    }
    resizeObserver.observe(googleButtonEl.value)
  } catch {
    error.value = 'Google Sign-In could not be loaded. Check your connection and try again.'
  }
}

watch(
  () => theme.mode,
  () => {
    googleButtonWidth = 0
    renderGoogleButton()
  },
)

onMounted(() => {
  void initGoogleSignIn()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.social-auth {
  display: grid;
  gap: 0.75rem;
}

.social-auth-google-wrap {
  position: relative;
  width: 100%;
  min-height: 44px;
}

.social-auth-google-visual,
.social-auth-google-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: 100%;
  min-height: 44px;
  padding: 0 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
}

.social-auth-google-visual {
  pointer-events: none;
}

.social-auth-google-fallback {
  opacity: 0.55;
  cursor: not-allowed;
}

.social-auth-google-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.social-auth-google-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-pill);
  opacity: 0.011;
  cursor: pointer;
}

.social-auth-google-overlay :deep(div),
.social-auth-google-overlay :deep(iframe) {
  width: 100% !important;
  min-height: 44px !important;
  margin: 0 !important;
}

.social-auth-apple {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-brand);
  color: var(--color-on-brand);
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-base), border-color var(--transition-base);
}

.social-auth-apple:hover:not(:disabled) {
  background: var(--color-brand-soft);
}

.social-auth-apple:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.social-auth-apple--disabled {
  opacity: 0.55;
}

.social-auth-error {
  margin: 0;
  font-size: 12px;
  color: var(--color-error);
}

[data-theme='dark'] .social-auth-google-visual,
[data-theme='dark'] .social-auth-google-fallback {
  background: var(--color-surface-inset);
  border-color: var(--color-border);
  color: var(--color-text);
}

[data-theme='dark'] .social-auth-apple {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}

[data-theme='dark'] .social-auth-apple:hover:not(:disabled) {
  border-color: var(--color-necha-green);
  background: var(--color-bg-soft);
}
</style>
