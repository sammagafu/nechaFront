<template>
  <div class="notification-bell" ref="root">
    <button type="button" class="bell-btn" :aria-expanded="open" aria-label="Notifications" @click="toggle">
      <Icon name="bell" :size="20" />
      <span v-if="notifications.unreadCount" class="bell-badge">{{ notifications.unreadCount }}</span>
    </button>

    <div v-if="open" class="bell-panel card card-elevated">
      <div class="bell-panel-head">
        <strong>Notifications</strong>
        <button v-if="notifications.unreadCount" type="button" class="bell-mark" @click="markAllRead">Mark all read</button>
      </div>
      <div v-if="notifications.loading" class="bell-empty">Loading…</div>
      <ul v-else-if="notifications.items.length" class="bell-list">
        <li v-for="item in notifications.items" :key="item.id" :class="{ unread: !item.read_at }">
          <router-link :to="item.link || '#'" @click="onOpen(item)">
            <strong>{{ item.title }}</strong>
            <span>{{ item.body }}</span>
            <small>{{ formatDate(item.created_at) }}</small>
          </router-link>
        </li>
      </ul>
      <p v-else class="bell-empty">No notifications yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import { useNotificationsStore } from '@/stores/notifications'
import type { Notification } from '@/types/messaging'

const notifications = useNotificationsStore()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

function toggle() {
  open.value = !open.value
  if (open.value) notifications.loadNotifications()
}

async function markAllRead() {
  await notifications.markRead()
}

async function onOpen(item: Notification) {
  if (!item.read_at) {
    await notifications.markRead([item.id])
  }
  open.value = false
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function onDocClick(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<style scoped>
.notification-bell {
  position: relative;
}

.bell-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
}

.bell-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #c45c26;
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
}

.bell-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: min(360px, calc(100vw - 32px));
  max-height: 420px;
  overflow: auto;
  z-index: 500;
  padding: 0;
}

.bell-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.bell-mark {
  border: none;
  background: transparent;
  color: #8b5a2b;
  font-size: 12px;
  cursor: pointer;
}

.bell-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.bell-list li a {
  display: grid;
  gap: 2px;
  padding: 12px 14px;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.bell-list li.unread a {
  background: rgba(196, 92, 38, 0.06);
}

.bell-list span,
.bell-list small {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.62);
}

.bell-empty {
  padding: 16px 14px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}
</style>
