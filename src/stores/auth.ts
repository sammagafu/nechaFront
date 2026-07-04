import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  fetchMe,
  login as apiLogin,
  loginWithApple as apiLoginWithApple,
  loginWithGoogle as apiLoginWithGoogle,
  register as apiRegister,
} from '@/api/auth'
import { getApiError } from '@/api/client'
import type { User } from '@/types/auth'
import type { HotelContextPayload } from '@/utils/hotelContext'

const TOKEN_KEY = 'access_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isCustomer = computed(() => user.value?.role === 'customer')
  const isPartner = computed(() => user.value?.role === 'partner')
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

  async function loginAdmin(email: string, password: string) {
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

  async function loginPartner(email: string, password: string) {
    loading.value = true
    error.value = ''
    try {
      const result = await apiLogin(email, password)
      if (result.user.role !== 'partner') {
        throw new Error('Partner access only')
      }
      setSession(result.access_token, result.user)
    } catch (e) {
      error.value = getApiError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function loginCustomer(email: string, password: string) {
    loading.value = true
    error.value = ''
    try {
      const result = await apiLogin(email, password)
      if (result.user.role !== 'customer') {
        throw new Error('Customer account required')
      }
      setSession(result.access_token, result.user)
    } catch (e) {
      error.value = getApiError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function registerCustomer(payload: {
    email: string
    password: string
    full_name: string
    phone?: string
    hotel_context?: HotelContextPayload
  }) {
    loading.value = true
    error.value = ''
    try {
      const result = await apiRegister(payload)
      setSession(result.access_token, result.user)
    } catch (e) {
      error.value = getApiError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle(idToken: string, hotelContext?: HotelContextPayload) {
    loading.value = true
    error.value = ''
    try {
      const result = await apiLoginWithGoogle(idToken, hotelContext)
      if (result.user.role !== 'customer') {
        throw new Error('Customer account required')
      }
      setSession(result.access_token, result.user)
    } catch (e) {
      error.value = getApiError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function loginWithApple(idToken: string, fullName?: string, hotelContext?: HotelContextPayload) {
    loading.value = true
    error.value = ''
    try {
      const result = await apiLoginWithApple(idToken, fullName, hotelContext)
      if (result.user.role !== 'customer') {
        throw new Error('Customer account required')
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

  return {
    token,
    user,
    loading,
    error,
    isAdmin,
    isCustomer,
    isPartner,
    isAuthenticated,
    loginAdmin,
    loginPartner,
    loginCustomer,
    registerCustomer,
    loginWithGoogle,
    loginWithApple,
    loadMe,
    logout,
  }
})
