import axios from 'axios'
import { appConfig } from '@/config/app'
import type { ApiError } from '@/types/api'

const client = axios.create({
  baseURL: appConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined
    if (data?.error?.message) {
      return data.error.message
    }
    return error.message
  }
  return 'Something went wrong'
}

export default client
