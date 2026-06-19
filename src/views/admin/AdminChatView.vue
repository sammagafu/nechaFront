<template>
  <div class="admin-page admin-chat-layout">
    <aside class="admin-card admin-chat-list">
      <h2>Conversations</h2>
      <p v-if="loading" class="admin-loading">Loading…</p>
      <p v-else-if="error" class="admin-error">{{ error }}</p>
      <ul v-else class="chat-list">
        <li v-for="item in conversations" :key="item.id">
          <button type="button" :class="{ active: item.id === activeId }" @click="select(item.id)">
            <strong>{{ item.guest_name }}</strong>
            <span>{{ categoryLabel(item.category) }}</span>
            <small>{{ item.status }} · {{ formatDate(item.updated_at) }}</small>
          </button>
        </li>
      </ul>
    </aside>

    <section class="admin-card admin-chat-thread">
      <template v-if="activeId && detail">
        <header class="thread-head">
          <div>
            <h2>{{ categoryLabel(detail.conversation.category) }}</h2>
            <p>{{ detail.conversation.guest_name }} · {{ detail.conversation.guest_email }}</p>
          </div>
          <button
            v-if="detail.conversation.status === 'open'"
            type="button"
            class="admin-btn admin-btn--ghost"
            @click="closeChat"
          >
            Close chat
          </button>
        </header>
        <div ref="messagesEl" class="thread-messages">
          <div
            v-for="msg in detail.messages"
            :key="msg.id"
            class="thread-bubble"
            :class="msg.sender_role === 'admin' ? 'thread-bubble--admin' : 'thread-bubble--guest'"
          >
            <p>{{ msg.body }}</p>
            <small>{{ formatDate(msg.created_at) }}</small>
          </div>
        </div>
        <form class="thread-compose" @submit.prevent="send">
          <input v-model="draft" type="text" placeholder="Reply to guest…" :disabled="detail.conversation.status === 'closed' || sending" />
          <button class="admin-btn" type="submit" :disabled="!draft.trim() || sending">Send</button>
        </form>
      </template>
      <p v-else class="admin-empty">Select a conversation to reply.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { closeAdminChat, fetchAdminChat, fetchAdminChats, sendAdminChatMessage } from '@/api/messaging'
import { getApiError } from '@/api/client'
import { categoryLabel } from '@/config/messaging'
import type { Conversation, ConversationDetail } from '@/types/messaging'

const route = useRoute()
const router = useRouter()
const conversations = ref<Conversation[]>([])
const detail = ref<ConversationDetail | null>(null)
const activeId = ref('')
const draft = ref('')
const loading = ref(true)
const sending = ref(false)
const error = ref('')
const messagesEl = ref<HTMLElement | null>(null)

async function loadList() {
  loading.value = true
  error.value = ''
  try {
    conversations.value = await fetchAdminChats()
    const routeId = route.params.id as string | undefined
    if (routeId) await select(routeId)
    else if (conversations.value[0]) await select(conversations.value[0].id)
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

async function select(id: string) {
  activeId.value = id
  router.replace({ name: 'admin-chat-detail', params: { id } })
  try {
    detail.value = await fetchAdminChat(id)
    await scrollMessages()
  } catch (e) {
    error.value = getApiError(e)
  }
}

async function send() {
  if (!activeId.value || !draft.value.trim()) return
  sending.value = true
  try {
    const msg = await sendAdminChatMessage(activeId.value, draft.value.trim())
    detail.value?.messages.push(msg)
    draft.value = ''
    await scrollMessages()
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    sending.value = false
  }
}

async function closeChat() {
  if (!activeId.value) return
  try {
    const updated = await closeAdminChat(activeId.value)
    if (detail.value) detail.value.conversation = updated
    await loadList()
  } catch (e) {
    error.value = getApiError(e)
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

async function scrollMessages() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

onMounted(loadList)
</script>

<style scoped>
.chat-list button.active {
  color: var(--color-necha-green-dark, #5a8f28);
}

.chat-list span,
.chat-list small {
  font-size: 12px;
  color: var(--color-body, #5c5a56);
}

.thread-bubble {
  max-width: 75%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
}

.thread-bubble--guest {
  justify-self: start;
  background: var(--color-bg-soft, #f3f1ea);
}

.thread-bubble--admin {
  justify-self: end;
  background: var(--color-black, #2c2c2a);
  color: #fff;
}

.thread-compose input {
  border: 1px solid var(--color-border, #d3d1c7);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-family: inherit;
  font-size: 14px;
}
</style>
