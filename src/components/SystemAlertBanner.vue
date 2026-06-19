<template>
  <div v-if="notifications.visibleAlerts.length" class="alert-stack" role="region" aria-label="System alerts">
    <div
      v-for="alert in notifications.visibleAlerts"
      :key="alert.id"
      class="system-alert"
      :class="`system-alert--${alert.severity}`"
    >
      <div class="system-alert-copy">
        <strong>{{ alert.title }}</strong>
        <p>{{ alert.body }}</p>
        <router-link v-if="alert.link" :to="alert.link" class="system-alert-link">Learn more</router-link>
      </div>
      <button type="button" class="system-alert-dismiss" aria-label="Dismiss alert" @click="notifications.dismissAlert(alert.id)">
        <Icon name="close" :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/ui/Icon.vue'
import { useNotificationsStore } from '@/stores/notifications'

const notifications = useNotificationsStore()
</script>

<style scoped>
.alert-stack {
  display: grid;
  gap: 0;
}

.system-alert {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.system-alert--info {
  background: #eef6ff;
  color: #12324f;
}

.system-alert--success {
  background: #edf8f0;
  color: #17452a;
}

.system-alert--warning {
  background: #fff7e8;
  color: #5c3d00;
}

.system-alert--alert {
  background: #fdeeee;
  color: #611818;
}

.system-alert-copy p {
  margin: 4px 0 0;
  font-size: 14px;
}

.system-alert-link {
  display: inline-block;
  margin-top: 6px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
}

.system-alert-dismiss {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  opacity: 0.7;
}
</style>
