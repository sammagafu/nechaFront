<template>
  <div class="account-page page-wrap">
    <header class="page-hero account-hero">
      <p class="eyebrow">Account</p>
      <h1 class="page-title">My account</h1>
      <p class="page-subtitle">Welcome back — manage your Necha profile.</p>
    </header>

    <div v-if="auth.isCustomer && auth.user" class="card card-elevated account-welcome">
      <div class="account-avatar" aria-hidden="true">{{ initials }}</div>
      <h3>{{ auth.user.full_name }}</h3>
      <p class="muted">{{ auth.user.email }}</p>
      <div class="account-actions">
        <router-link to="/shop" class="btn">Continue shopping</router-link>
        <button type="button" class="btn btn-outline" @click="auth.logout()">Sign out</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const initials = computed(() => {
  const parts = auth.user?.full_name?.trim().split(/\s+/) ?? []
  if (!parts.length) return 'N'
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
})

onMounted(async () => {
  if (!auth.isAuthenticated) {
    await router.replace({ name: 'sign-in', query: { redirect: '/account' } })
    return
  }
  if (!auth.user) await auth.loadMe()
  if (!auth.isCustomer) {
    await router.replace({ name: 'sign-in', query: { redirect: '/account' } })
  }
})
</script>

<style scoped>
.account-page {
  padding-bottom: max(var(--space-8), env(safe-area-inset-bottom));
}

.account-hero {
  margin-bottom: var(--space-5);
}

.account-welcome {
  text-align: center;
  padding: clamp(1.75rem, 4vw, 2.25rem);
}

.account-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-necha-green) 18%, var(--color-bg-soft));
  border: 1px solid color-mix(in srgb, var(--color-necha-green) 30%, var(--color-border));
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  color: var(--color-necha-green-dark);
}

h3 {
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
}

.account-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
  margin-top: 1.25rem;
}
</style>
