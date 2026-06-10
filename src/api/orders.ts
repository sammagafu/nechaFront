import client from './client'
import type { ApiSuccess, FoodOrderRequest, Order, OrderTrack, ProductOrderRequest } from '@/types/api'

export async function createProductOrder(payload: ProductOrderRequest) {
  const { data } = await client.post<ApiSuccess<Order>>('/orders/product', payload)
  return data.data
}

export async function createFoodOrder(payload: FoodOrderRequest) {
  const { data } = await client.post<ApiSuccess<Order>>('/orders/food', payload)
  return data.data
}

export async function trackOrder(id: string) {
  const { data } = await client.get<ApiSuccess<OrderTrack>>(`/orders/${id}/track`)
  return data.data
}
