export interface Notification {
  id: string
  type: string
  title: string
  body: string
  link: string
  severity: 'info' | 'success' | 'warning' | 'alert'
  read_at: string | null
  created_at: string
}

export interface NotificationList {
  items: Notification[]
  unread_count: number
}

export interface SystemAlert {
  id: string
  title: string
  body: string
  severity: 'info' | 'success' | 'warning' | 'alert'
  link?: string
  is_active?: boolean
  starts_at?: string | null
  ends_at?: string | null
}

export interface Conversation {
  id: string
  category: string
  status: 'open' | 'closed'
  guest_name: string
  guest_email: string
  hotel_id?: string | null
  user_id?: string | null
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  sender_role: 'guest' | 'customer' | 'admin' | 'system'
  body: string
  created_at: string
}

export interface ConversationDetail {
  conversation: Conversation
  messages: ChatMessage[]
}

export interface WebhookEndpoint {
  id: string
  url: string
  description: string
  events: string[]
  is_active: boolean
  created_at: string
}

export interface WebhookDelivery {
  id: string
  endpoint_id: string
  event_type: string
  status: 'pending' | 'success' | 'failed'
  response_code: number
  attempts: number
  created_at: string
}

export interface ToastItem {
  id: string
  title: string
  body: string
  severity: Notification['severity']
}
