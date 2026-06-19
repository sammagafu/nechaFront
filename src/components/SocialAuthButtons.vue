<template>
  <div class="social-auth">
    <div ref="googleButtonEl" class="social-auth-google" />
    <button type="button" class="social-auth-apple" :disabled="loading" @click="signInWithApple">
      <span aria-hidden="true"></span>
      {{ loading ? 'Signing in…' : 'Continue with Apple' }}
    </button>
    <p v-if="error" class="social-auth-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getApiError } from '@/api/client'

const emit = defineEmits<{ success: [] }>()

const auth = useAuthStore()
const googleButtonEl = ref<HTMLElement | null>(null)
const loading = ref(false)
const error = ref('')

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined
let googleButtonWidth = 0
let resizeObserver: ResizeObserver | undefined

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
    await auth.loginWithGoogle(response.credential)
    emit('success')
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function signInWithApple() {
  if (!appleClientId) {
    error.value = 'Apple Sign In is not configured yet.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await loadScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js', 'apple-auth-js')
    const AppleID = (window as Window & { AppleID?: { auth: { init: (cfg: Record<string, unknown>) => void; signIn: () => Promise<{ authorization: { id_token: string }; user?: { name?: { firstName?: string; lastName?: string } } }> } } }).AppleID
    if (!AppleID) throw new Error('Apple Sign In unavailable')
    AppleID.auth.init({
      clientId: appleClientId,
      scope: 'name email',
      redirectURI: window.location.origin,
      usePopup: true,
    })
    const result = await AppleID.auth.signIn()
    const fullName = [result.user?.name?.firstName, result.user?.name?.lastName].filter(Boolean).join(' ')
    await auth.loginWithApple(result.authorization.id_token, fullName)
    emit('success')
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

function renderGoogleButton() {
  const google = (window as Window & { google?: { accounts: { id: { initialize: (cfg: Record<string, unknown>) => void; renderButton: (el: HTMLElement, cfg: Record<string, unknown>) => void } } } }).google
  if (!google || !googleButtonEl.value || !googleClientId) return
  const width = Math.min(Math.max(googleButtonEl.value.offsetWidth, 240), 400)
  if (width === googleButtonWidth) return
  googleButtonWidth = width
  googleButtonEl.value.innerHTML = ''
  google.accounts.id.initialize({
    client_id: googleClientId,
    callback: handleGoogleCredential,
  })
  google.accounts.id.renderButton(googleButtonEl.value, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    width,
  })
}

onMounted(async () => {
  if (!googleClientId || !googleButtonEl.value) return
  try {
    await loadScript('https://accounts.google.com/gsi/client', 'google-gsi')
    await nextTick()
    renderGoogleButton()
    resizeObserver = new ResizeObserver(() => renderGoogleButton())
    resizeObserver.observe(googleButtonEl.value)
  } catch {
    error.value = 'Google Sign In could not be loaded.'
  }
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

.social-auth-google {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 44px;
  overflow: hidden;
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
}

.social-auth-apple:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.social-auth-error {
  margin: 0;
  font-size: 12px;
  color: var(--color-error);
}
</style>
