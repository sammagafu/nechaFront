<template>
  <div class="chat-widget">
    <button
      type="button"
      class="chat-fab"
      :aria-label="fabLabel"
      @click="toggleOpen"
    >
      <span class="chat-fab-icon" aria-hidden="true">
        <Icon :name="open ? 'close' : 'message'" :size="22" />
        <span v-if="unreadBadge" class="chat-fab-badge">{{ unreadBadge }}</span>
      </span>
      <span v-if="!open" class="chat-fab-label">Chats</span>
    </button>

    <div v-if="open" class="chat-panel card card-elevated">
      <header class="chat-head">
        <div>
          <strong>Message Necha</strong>
          <p>Sign in, choose a category, and we will reply soon.</p>
        </div>
        <button v-if="conversationId" type="button" class="chat-new" @click="resetChat">New message</button>
      </header>

      <div v-if="!auth.isAuthenticated || !auth.isCustomer" class="chat-start">
        <p class="chat-signin-copy">Sign in to send us a message.</p>
        <SocialAuthButtons @success="onSignedIn" />
        <form class="form-stack chat-email-form" @submit.prevent="signInWithEmail">
          <div class="field">
            <label for="chat-email">Email</label>
            <input id="chat-email" v-model="email" type="email" required />
          </div>
          <div class="field">
            <label for="chat-password">Password</label>
            <input id="chat-password" v-model="password" type="password" required />
          </div>
          <p v-if="error" class="chat-error">{{ error }}</p>
          <button class="btn btn-block" type="submit" :disabled="sending">
            {{ sending ? 'Signing in…' : 'Sign in with email' }}
          </button>
        </form>
        <router-link to="/sign-up" class="chat-account-link">Create an account</router-link>
      </div>

      <div v-else-if="!conversationId" class="chat-start">
        <form class="form-stack" @submit.prevent="start">
          <div class="field">
            <label for="chat-category">Category</label>
            <select id="chat-category" v-model="category" required>
              <option v-for="cat in messageCategories" :key="cat.id" :value="cat.id">
                {{ cat.label }}
              </option>
            </select>
          </div>
          <div class="field">
            <label for="chat-message">Message</label>
            <textarea id="chat-message" v-model="message" rows="4" required placeholder="How can we help?" />
          </div>
          <p v-if="error" class="chat-error">{{ error }}</p>
          <button class="btn btn-block" type="submit" :disabled="sending">
            {{ sending ? 'Sending…' : 'Send message' }}
          </button>
        </form>
      </div>

      <template v-else>
        <div class="chat-thread-meta">
          <span>{{ categoryLabel(activeCategory) }}</span>
        </div>
        <div ref="messagesEl" class="chat-messages">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="chat-bubble"
            :class="isMine(msg) ? 'chat-bubble--mine' : 'chat-bubble--staff'"
          >
            <p>{{ msg.body }}</p>
            <small>{{ formatTime(msg.created_at) }}</small>
          </div>
        </div>
        <form class="chat-compose" @submit.prevent="send">
          <input v-model="draft" type="text" placeholder="Type a message…" :disabled="status === 'closed' || sending" />
          <button type="submit" :disabled="!draft.trim() || status === 'closed' || sending">Send</button>
        </form>
        <p v-if="status === 'closed'" class="chat-closed">This conversation is closed.</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'
import SocialAuthButtons from '@/components/SocialAuthButtons.vue'
import { fetchMyChat, fetchMyChats, sendMyMessage, startChat } from '@/api/messaging'
import { getApiError } from '@/api/client'
import { categoryLabel, messageCategories, type MessageCategoryId } from '@/config/messaging'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import type { ChatMessage } from '@/types/messaging'

const props = defineProps<{ hotelSlug?: string }>()

const route = useRoute()
const auth = useAuthStore()
const notifications = useNotificationsStore()
const open = ref(false)
const sending = ref(false)
const error = ref('')
const conversationId = ref('')
const messages = ref<ChatMessage[]>([])
const status = ref<'open' | 'closed'>('open')
const draft = ref('')
const messagesEl = ref<HTMLElement | null>(null)
const category = ref<MessageCategoryId>(messageCategories[0].id)
const message = ref('')
const email = ref('')
const password = ref('')
const activeCategory = ref<string>(messageCategories[0].id)

const unreadBadge = computed(() => {
  const count = notifications.chatUnreadCount
  if (!count || open.value) return ''
  return count > 9 ? '9+' : String(count)
})

const fabLabel = computed(() => {
  const unread = notifications.chatUnreadCount
  if (open.value) return 'Close chats'
  if (unread) return `Open chats, ${unread} unread message${unread === 1 ? '' : 's'}`
  return 'Open chats'
})

function isMine(msg: ChatMessage) {
  return msg.sender_role === 'customer' || msg.sender_role === 'guest'
}

async function onSignedIn() {
  await auth.loadMe()
  error.value = ''
}

async function signInWithEmail() {
  sending.value = true
  error.value = ''
  try {
    await auth.loginCustomer(email.value, password.value)
    await onSignedIn()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    sending.value = false
  }
}

async function loadConversation() {
  if (!conversationId.value || !auth.isCustomer) return
  try {
    const detail = await fetchMyChat(conversationId.value)
    messages.value = detail.messages
    status.value = detail.conversation.status
    activeCategory.value = detail.conversation.category
  } catch (e) {
    error.value = getApiError(e)
  }
}

async function start() {
  sending.value = true
  error.value = ''
  try {
    const slug = props.hotelSlug || (route.params.slug as string | undefined)
    const result = await startChat({
      category: category.value,
      message: message.value.trim(),
      hotel_slug: slug,
    })
    conversationId.value = result.conversation.id
    activeCategory.value = result.conversation.category || category.value
    notifications.saveChatSession(conversationId.value)
    messages.value = [{ id: 'local', sender_role: 'customer', body: message.value.trim(), created_at: new Date().toISOString() }]
    status.value = 'open'
    message.value = ''
    await loadConversation()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    sending.value = false
  }
}

async function send() {
  if (!draft.value.trim() || !conversationId.value) return
  sending.value = true
  try {
    const msg = await sendMyMessage(conversationId.value, draft.value.trim())
    messages.value.push(msg)
    draft.value = ''
    await scrollMessages()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    sending.value = false
  }
}

function resetChat() {
  conversationId.value = ''
  messages.value = []
  notifications.clearChatSession()
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function scrollMessages() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

async function toggleOpen() {
  open.value = !open.value
}

async function ensureActiveConversation() {
  if (!auth.isCustomer) return
  if (!conversationId.value) {
    try {
      const chats = await fetchMyChats()
      const latest = chats.find((c) => c.status === 'open') || chats[0]
      if (latest) {
        conversationId.value = latest.id
        activeCategory.value = latest.category
        notifications.saveChatSession(latest.id)
      }
    } catch {
      /* no conversations yet */
    }
  }
  await loadConversation()
}

watch(open, async (isOpen) => {
  if (!isOpen) return
  await notifications.markChatNotificationsRead()
  if (!auth.user && auth.isAuthenticated) await auth.loadMe()
  await ensureActiveConversation()
})

watch(
  () => notifications.chatUnreadCount,
  async (count, prev) => {
    if (!open.value || count <= prev) return
    if (auth.isCustomer) await loadConversation()
  },
)

onMounted(async () => {
  if (auth.isAuthenticated && !auth.user) await auth.loadMe()
  const saved = notifications.getChatSession()
  if (saved.conversationId && auth.isCustomer) {
    conversationId.value = saved.conversationId
  }
})
</script>

<style scoped>
.chat-widget {
  position: fixed;
  right: max(20px, env(safe-area-inset-right, 0px));
  bottom: max(20px, env(safe-area-inset-bottom, 0px));
  z-index: 700;
}

.chat-fab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 56px;
  padding: 10px 12px 8px;
  border: none;
  border-radius: 999px;
  background: var(--color-brand);
  color: var(--color-on-brand);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.chat-fab:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.chat-fab-icon {
  position: relative;
  display: flex;
  line-height: 0;
}

.chat-fab-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--radius-pill);
  background: var(--color-error, #c53030);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  border: 2px solid var(--color-brand);
}

.chat-fab-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
}

.chat-panel {
  position: absolute;
  right: 0;
  bottom: calc(100% + 12px);
  width: min(380px, calc(100vw - 32px));
  max-height: min(72vh, 620px);
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
}

.chat-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
}

.chat-head p {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--color-muted);
}

.chat-new {
  border: none;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  color: var(--color-brand-ink);
}

.chat-start {
  padding: 16px;
  overflow: auto;
}

.chat-signin-copy {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--color-body);
}

.chat-email-form {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.chat-account-link {
  display: block;
  margin-top: 0.75rem;
  font-size: 12px;
  text-align: center;
  color: var(--color-text);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.chat-account-link:hover {
  color: var(--color-interactive-hover);
}

.chat-thread-meta {
  padding: 0.5rem 16px 0;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-muted);
}

.chat-messages {
  padding: 16px;
  overflow: auto;
  display: grid;
  gap: 10px;
  align-content: start;
  min-height: 220px;
}

.chat-bubble {
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 13px;
}

.chat-bubble--mine {
  justify-self: end;
  background: var(--color-brand);
  color: var(--color-on-brand);
}

.chat-bubble--staff {
  justify-self: start;
  background: var(--color-bg-soft);
}

.chat-bubble small {
  display: block;
  margin-top: 4px;
  opacity: 0.7;
  font-size: 11px;
}

.chat-compose {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 12px 16px 16px;
  border-top: 1px solid var(--color-border);
}

.chat-compose input {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 10px 14px;
}

.chat-compose button {
  border: none;
  border-radius: 999px;
  padding: 0 16px;
  background: var(--color-brand);
  color: var(--color-on-brand);
  cursor: pointer;
}

.chat-error,
.chat-closed {
  padding: 0 16px 12px;
  font-size: 12px;
  color: var(--color-error);
}
</style>
