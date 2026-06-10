<template>
  <div style="padding: 3rem; text-align: center">Redirecting to hotel…</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchHotel } from '@/api/hotels'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const code = route.params.code as string
  try {
    const hotel = await fetchHotel(code)
    await router.replace({ path: `/hotel/${hotel.slug || 'sea-cliff'}`, query: { ref: code } })
  } catch {
    await router.replace({ path: '/', query: { hotelError: '1' } })
  }
})
</script>
