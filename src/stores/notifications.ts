import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchActiveAlerts, fetchNotifications, markNotificationsRead } from '@/api/messaging'
import { getApiError } from '@/api/client'
import type { Notification, SystemAlert, ToastItem } from '@/types/messaging'

const CHAT_ID_KEY = 'necha_chat_id'

function isChatNotification(type: string) {
  return type.startsWith('chat.')
}

export const useNotificationsStore = defineStore('notifications', () => {
  const alerts = ref<SystemAlert[]>([])
  const items = ref<Notification[]>([])
  const unreadCount = ref(0)
  const toasts = ref<ToastItem[]>([])
  const loading = ref(false)
  const dismissedAlerts = ref<string[]>(JSON.parse(localStorage.getItem('dismissed_alerts') || '[]'))

  const visibleAlerts = computed(() =>
    alerts.value.filter((a) => !dismissedAlerts.value.includes(a.id)),
  )

  const chatUnreadCount = computed(
    () => items.value.filter((n) => !n.read_at && isChatNotification(n.type)).length,
  )

  function saveChatSession(conversationId: string) {
    localStorage.setItem(CHAT_ID_KEY, conversationId)
  }

  function getChatSession() {
    return {
      conversationId: localStorage.getItem(CHAT_ID_KEY) || '',
    }
  }

  function clearChatSession() {
    localStorage.removeItem(CHAT_ID_KEY)
  }

  async function loadAlerts() {
    try {
      alerts.value = await fetchActiveAlerts()
    } catch {
      alerts.value = []
    }
  }

  async function loadNotifications() {
    const token = localStorage.getItem('access_token')
    if (!token) {
      items.value = []
      unreadCount.value = 0
      return
    }
    loading.value = true
    try {
      const result = await fetchNotifications()
      items.value = result.items
      unreadCount.value = result.unread_count
    } catch {
      items.value = []
      unreadCount.value = 0
    } finally {
      loading.value = false
    }
  }

  async function markRead(ids?: string[]) {
    const target = ids?.length ? ids : items.value.filter((n) => !n.read_at).map((n) => n.id)
    if (!target.length) return
    await markNotificationsRead(target)
    await loadNotifications()
  }

  async function markChatNotificationsRead() {
    const ids = items.value.filter((n) => !n.read_at && isChatNotification(n.type)).map((n) => n.id)
    if (!ids.length) return
    await markRead(ids)
  }

  function dismissAlert(id: string) {
    if (!dismissedAlerts.value.includes(id)) {
      dismissedAlerts.value.push(id)
      localStorage.setItem('dismissed_alerts', JSON.stringify(dismissedAlerts.value))
    }
  }

  function pushToast(title: string, body: string, severity: ToastItem['severity'] = 'info') {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    toasts.value.push({ id, title, body, severity })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 4500)
  }

  function notifyError(error: unknown) {
    pushToast('Something went wrong', getApiError(error), 'alert')
  }

  let pollTimer: ReturnType<typeof setInterval> | undefined

  function startPolling() {
    stopPolling()
    loadAlerts()
    loadNotifications()
    pollTimer = setInterval(() => {
      loadAlerts()
      loadNotifications()
    }, 30000)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = undefined
    }
  }

  return {
    alerts,
    visibleAlerts,
    items,
    unreadCount,
    chatUnreadCount,
    toasts,
    loading,
    loadAlerts,
    loadNotifications,
    markRead,
    markChatNotificationsRead,
    dismissAlert,
    pushToast,
    notifyError,
    startPolling,
    stopPolling,
    saveChatSession,
    getChatSession,
    clearChatSession,
  }
})
