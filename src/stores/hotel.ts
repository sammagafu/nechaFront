import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchHotel } from '@/api/hotels'
import { getApiError } from '@/api/client'
import type { Hotel } from '@/types/api'

export const useHotelStore = defineStore('hotel', () => {
  const hotelCode = ref('')
  const currentHotel = ref<Hotel | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function loadHotel(code: string) {
    loading.value = true
    error.value = ''
    hotelCode.value = code
    try {
      currentHotel.value = await fetchHotel(code)
    } catch (e) {
      currentHotel.value = null
      error.value = getApiError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return { hotelCode, currentHotel, loading, error, loadHotel }
})
