import client from './client'
import type {
  ApiSuccess,
  HotelReservationRequest,
  Reservation,
  TableReservationRequest,
} from '@/types/api'

export async function createHotelReservation(payload: HotelReservationRequest) {
  const { data } = await client.post<ApiSuccess<Reservation>>('/reservations/hotel', payload)
  return data.data
}

export async function createTableReservation(payload: TableReservationRequest) {
  const { data } = await client.post<ApiSuccess<Reservation>>('/reservations/table', payload)
  return data.data
}

export async function fetchReservation(id: string) {
  const { data } = await client.get<ApiSuccess<Reservation>>(`/reservations/${id}`)
  return data.data
}
