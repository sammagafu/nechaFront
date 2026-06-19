import client from './client'
import type { ApiSuccess } from '@/types/api'
import type { AuthResponse, User } from '@/types/auth'

export async function login(email: string, password: string) {
  const { data } = await client.post<ApiSuccess<AuthResponse>>('/auth/login', { email, password })
  return data.data
}

export async function register(payload: {
  email: string
  password: string
  full_name: string
  phone?: string
}) {
  const { data } = await client.post<ApiSuccess<AuthResponse>>('/auth/register', payload)
  return data.data
}

export async function fetchMe() {
  const { data } = await client.get<ApiSuccess<User>>('/auth/me')
  return data.data
}

export async function loginWithGoogle(idToken: string) {
  const { data } = await client.post<ApiSuccess<AuthResponse>>('/auth/google', { id_token: idToken })
  return data.data
}

export async function loginWithApple(idToken: string, fullName?: string) {
  const { data } = await client.post<ApiSuccess<AuthResponse>>('/auth/apple', {
    id_token: idToken,
    full_name: fullName,
  })
  return data.data
}

export async function fetchAdminMe() {
  const { data } = await client.get<ApiSuccess<User>>('/admin/me')
  return data.data
}
