import { computed } from 'vue'

/** Delivery note switches at 4:00pm East Africa Time (UTC+3). */
export function useDeliveryNote() {
  const note = computed(() => {
    const now = new Date()
    const eatHour = (now.getUTCHours() + 3) % 24
    if (eatHour < 16) {
      return 'Order by 4:00pm for same-day delivery.'
    }
    return 'Order now for delivery tomorrow morning from 9:00am.'
  })
  return { note }
}
