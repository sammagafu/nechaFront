import { storefrontConfig } from '@/config/storefront'

export function formatTZS(amount: number): string {
  return `TZS ${amount.toLocaleString('en-US')}`
}

export function formatUSD(amountTzs: number): string {
  const usd = Math.round(amountTzs / storefrontConfig.tzsToUsdRate)
  return `≈ $${usd}`
}

export function deliveryFee(subtotalTzs: number): number {
  return subtotalTzs >= storefrontConfig.freeDeliveryThresholdTZS
    ? 0
    : storefrontConfig.deliveryFeeTZS
}
