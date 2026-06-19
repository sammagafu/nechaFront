import client from './client'
import type { ApiSuccess } from '@/types/api'
import type {
  Conversation,
  ConversationDetail,
  ChatMessage,
  NotificationList,
  SystemAlert,
  WebhookDelivery,
  WebhookEndpoint,
} from '@/types/messaging'

export async function fetchActiveAlerts() {
  const { data } = await client.get<ApiSuccess<SystemAlert[]>>('/alerts')
  return data.data
}

export async function fetchNotifications() {
  const { data } = await client.get<ApiSuccess<NotificationList>>('/notifications')
  return data.data
}

export async function markNotificationsRead(ids: string[]) {
  const { data } = await client.post<ApiSuccess<{ ok: boolean }>>('/notifications/read', { ids })
  return data.data
}

export async function startChat(payload: {
  category: string
  message: string
  hotel_slug?: string
}) {
  const { data } = await client.post<ApiSuccess<{ conversation: Conversation }>>('/chat/conversations', payload)
  return data.data
}

export async function fetchMyChats() {
  const { data } = await client.get<ApiSuccess<Conversation[]>>('/chat/conversations')
  return data.data
}

export async function fetchMyChat(conversationId: string) {
  const { data } = await client.get<ApiSuccess<ConversationDetail>>(`/chat/conversations/${conversationId}`)
  return data.data
}

export async function sendMyMessage(conversationId: string, body: string) {
  const { data } = await client.post<ApiSuccess<ChatMessage>>(`/chat/conversations/${conversationId}/messages`, { body })
  return data.data
}

export async function fetchAdminAlerts() {
  const { data } = await client.get<ApiSuccess<SystemAlert[]>>('/admin/alerts')
  return data.data
}

export async function createAdminAlert(payload: Partial<SystemAlert> & { title: string; body: string; is_active?: boolean }) {
  const { data } = await client.post<ApiSuccess<SystemAlert>>('/admin/alerts', payload)
  return data.data
}

export async function updateAdminAlert(id: string, payload: Partial<SystemAlert> & { is_active?: boolean }) {
  const { data } = await client.patch<ApiSuccess<SystemAlert>>(`/admin/alerts/${id}`, payload)
  return data.data
}

export async function fetchAdminChats() {
  const { data } = await client.get<ApiSuccess<Conversation[]>>('/admin/chat')
  return data.data
}

export async function fetchAdminChat(id: string) {
  const { data } = await client.get<ApiSuccess<ConversationDetail>>(`/admin/chat/${id}`)
  return data.data
}

export async function sendAdminChatMessage(id: string, body: string) {
  const { data } = await client.post<ApiSuccess<ChatMessage>>(`/admin/chat/${id}/messages`, { body })
  return data.data
}

export async function closeAdminChat(id: string) {
  const { data } = await client.patch<ApiSuccess<Conversation>>(`/admin/chat/${id}/close`)
  return data.data
}

export async function fetchWebhooks() {
  const { data } = await client.get<ApiSuccess<WebhookEndpoint[]>>('/admin/webhooks')
  return data.data
}

export async function createWebhook(payload: { url: string; description?: string; events: string[]; is_active?: boolean }) {
  const { data } = await client.post<ApiSuccess<{ endpoint: WebhookEndpoint; secret: string }>>('/admin/webhooks', payload)
  return data.data
}

export async function updateWebhook(id: string, payload: Partial<{ url: string; description: string; events: string[]; is_active: boolean }>) {
  const { data } = await client.patch<ApiSuccess<WebhookEndpoint>>(`/admin/webhooks/${id}`, payload)
  return data.data
}

export async function fetchWebhookDeliveries() {
  const { data } = await client.get<ApiSuccess<WebhookDelivery[]>>('/admin/webhooks/deliveries')
  return data.data
}
