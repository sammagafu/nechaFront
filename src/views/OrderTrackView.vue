<template>
  <div class="page-wrap">
    <header class="page-hero">
      <p class="eyebrow">Tracking</p>
      <h1 class="page-title">Order tracking</h1>
    </header>

    <div class="card card-elevated">
      <p v-if="loading" class="muted">Loading status...</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <div v-else-if="track" class="track-details">
        <p class="status-line">
          <span class="eyebrow">Status</span>
          <strong class="success">{{ track.status }}</strong>
        </p>
        <p><span class="label">Reference</span> {{ track.kkooapp_ref }}</p>
        <p class="muted">Last updated: {{ track.updated_at }}</p>
        <button class="btn btn-sm" @click="refresh">Refresh</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { trackOrder } from '@/api/orders'
import { getApiError } from '@/api/client'
import type { OrderTrack } from '@/types/api'

const route = useRoute()
const track = ref<OrderTrack | null>(null)
const loading = ref(false)
const error = ref('')

async function refresh() {
  loading.value = true
  error.value = ''
  try {
    track.value = await trackOrder(String(route.params.id))
  } catch (e) {
    error.value = getApiError(e)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)
</script>

<style scoped>
.track-details {
  display: grid;
  gap: 0.75rem;
}

.status-line strong {
  display: block;
  font-family: var(--font-display);
  font-size: 2rem;
  text-transform: capitalize;
}

.label {
  font-weight: 600;
  color: var(--color-text);
}
</style>
