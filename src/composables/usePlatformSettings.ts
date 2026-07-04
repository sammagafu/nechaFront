import { ref } from 'vue'
import { fetchPlatformSettings, type PlatformSettings } from '@/api/inquiries'
import { storefrontConfig } from '@/config/storefront'

const settings = ref<PlatformSettings | null>(null)
let loadPromise: Promise<PlatformSettings> | null = null

export function usePlatformSettings() {
  async function ensureLoaded() {
    if (settings.value) return settings.value
    if (!loadPromise) {
      loadPromise = fetchPlatformSettings()
        .then((data) => {
          settings.value = data
          return data
        })
        .catch(() => {
          const fallback: PlatformSettings = {
            tzs_to_usd_rate: storefrontConfig.tzsToUsdRate,
            free_delivery_threshold_tzs: storefrontConfig.freeDeliveryThresholdTZS,
            default_delivery_fee_tzs: storefrontConfig.deliveryFeeTZS,
            zones: [],
          }
          settings.value = fallback
          return fallback
        })
    }
    return loadPromise
  }

  function formatDualPrice(amountTzs: number) {
    const rate = settings.value?.tzs_to_usd_rate ?? storefrontConfig.tzsToUsdRate
    const usd = Math.round(amountTzs / rate)
    return {
      tzs: `TZS ${amountTzs.toLocaleString('en-US')}`,
      usd: `≈ $${usd.toLocaleString('en-US')}`,
    }
  }

  function deliveryFeeForSubtotal(subtotalTzs: number, zoneCode?: string) {
    const s = settings.value
    const code = zoneCode?.trim() || 'A'
    const zone = s?.zones.find((z) => z.code === code)
    const threshold =
      zone?.free_threshold_tzs ??
      s?.free_delivery_threshold_tzs ??
      storefrontConfig.freeDeliveryThresholdTZS
    const fee =
      zone?.delivery_fee_tzs ?? s?.default_delivery_fee_tzs ?? storefrontConfig.deliveryFeeTZS
    return subtotalTzs >= threshold ? 0 : fee
  }

  return { settings, ensureLoaded, formatDualPrice, deliveryFeeForSubtotal }
}
