import client from './client'
import type { ApiSuccess } from '@/types/api'

export interface PaymentStatusResponse {
  order_id: string
  payment_status: string
  order_status: string
}

export async function fetchPaymentStatus(orderId: string) {
  const { data } = await client.get<ApiSuccess<PaymentStatusResponse>>('/payments/status', {
    params: { order_id: orderId },
  })
  return data.data
}

export async function completeMockPayment(orderId: string) {
  const { data } = await client.post<ApiSuccess<PaymentStatusResponse>>('/payments/mock/complete', null, {
    params: { order_id: orderId },
  })
  return data.data
}
