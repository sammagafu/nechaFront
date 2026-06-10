import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchMe, login as apiLogin } from '@/api/auth'
import { getApiError } from '@/api/client'
import type { User } from '@/types/auth'

const TOKEN_KEY = 'access_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isAuthenticated = computed(() => !!token.value)

  function setSession(accessToken: string, u: User) {
    token.value = accessToken
    user.value = u
    localStorage.setItem(TOKEN_KEY, accessToken)
  }

  function clearSession() {
    token.value = ''
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = ''
    try {
      const result = await apiLogin(email, password)
      if (result.user.role !== 'admin') {
        throw new Error('Admin access only')
      }
      setSession(result.access_token, result.user)
    } catch (e) {
      error.value = getApiError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function loadMe() {
    if (!token.value) return
    try {
      user.value = await fetchMe()
    } catch {
      clearSession()
    }
  }

  function logout() {
    clearSession()
  }

  return { token, user, loading, error, isAdmin, isAuthenticated, login, loadMe, logout }
})
