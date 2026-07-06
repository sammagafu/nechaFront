import client from './client'
import type { ApiSuccess } from '@/types/api'

export interface RewardLedgerEntry {
  id: string
  entry_type: string
  points: number
  note?: string
  order_id?: string
  created_at: string
}

export interface RewardBalance {
  balance: number
  ledger: RewardLedgerEntry[]
}

export async function fetchRewardBalance() {
  const { data } = await client.get<ApiSuccess<RewardBalance>>('/rewards/balance')
  return data.data
}

export async function redeemRewardPoints(points: number) {
  const { data } = await client.post<ApiSuccess<{ balance: number; redeemed_points: number }>>(
    '/rewards/redeem',
    { points },
  )
  return data.data
}
