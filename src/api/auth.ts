import client from './client'
import type { ApiSuccess } from '@/types/api'
import type { AuthResponse, User } from '@/types/auth'

export async function login(email: string, password: string) {
  const { data } = await client.post<ApiSuccess<AuthResponse>>('/auth/login', { email, password })
  return data.data
}

export async function fetchMe() {
  const { data } = await client.get<ApiSuccess<User>>('/admin/me')
  return data.data
}
