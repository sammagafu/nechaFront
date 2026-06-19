import type { Order } from '@/types/api'

export function handleOrderPayment(order: Order) {
  if (order.payment_required && order.payment_url) {
    window.location.href = order.payment_url
    return true
  }
  return false
}
