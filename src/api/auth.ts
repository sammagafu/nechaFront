import client from './client'
import type { ApiSuccess } from '@/types/api'
import type { AuthResponse, User } from '@/types/auth'
import type { HotelContextPayload } from '@/utils/hotelContext'

export async function login(email: string, password: string) {
  const { data } = await client.post<ApiSuccess<AuthResponse>>('/auth/login', { email, password })
  return data.data
}

export async function register(payload: {
  email: string
  password: string
  full_name: string
  phone?: string
  hotel_context?: HotelContextPayload
}) {
  const { data } = await client.post<ApiSuccess<AuthResponse>>('/auth/register', payload)
  return data.data
}

export async function fetchMe() {
  const { data } = await client.get<ApiSuccess<User>>('/auth/me')
  return data.data
}

export async function loginWithGoogle(idToken: string, hotelContext?: HotelContextPayload) {
  const { data } = await client.post<ApiSuccess<AuthResponse>>('/auth/google', {
    id_token: idToken,
    hotel_context: hotelContext,
  })
  return data.data
}

export async function loginWithApple(idToken: string, fullName?: string, hotelContext?: HotelContextPayload) {
  const { data } = await client.post<ApiSuccess<AuthResponse>>('/auth/apple', {
    id_token: idToken,
    full_name: fullName,
    hotel_context: hotelContext,
  })
  return data.data
}

export async function fetchAdminMe() {
  const { data } = await client.get<ApiSuccess<User>>('/admin/me')
  return data.data
}
