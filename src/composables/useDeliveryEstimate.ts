/** Estimated delivery window copy for order confirmation (EAT / UTC+3). */
export function useDeliveryEstimate() {
  const now = new Date()
  const eatHour = (now.getUTCHours() + 3) % 24

  if (eatHour < 16) {
    const start = eatHour < 12 ? '2:00pm' : '3:30pm'
    const end = eatHour < 12 ? '3:30pm' : '5:00pm'
    return `Between ${start} and ${end} today`
  }
  return 'Tomorrow morning from 9:00am'
}
