import { computed, ref } from 'vue'
import { fetchPlatformSettings, type PlatformFeatures, type PlatformSettings } from '@/api/inquiries'
import { storefrontConfig } from '@/config/storefront'

const defaultFeatures = (): PlatformFeatures => ({
  rewards_enabled: true,
  rewards_redeem_enabled: false,
  discovery_ticketing_enabled: false,
  partner_portal_enabled: true,
  partner_products_manage_enabled: false,
  dual_currency_enabled: true,
  distance_delivery_enabled: true,
})

const settings = ref<PlatformSettings | null>(null)
let loadPromise: Promise<PlatformSettings> | null = null

function fallbackSettings(): PlatformSettings {
  return {
    tzs_to_usd_rate: storefrontConfig.tzsToUsdRate,
    free_delivery_threshold_tzs: storefrontConfig.freeDeliveryThresholdTZS,
    default_delivery_fee_tzs: storefrontConfig.deliveryFeeTZS,
    delivery_base_fee_tzs: 3000,
    delivery_per_km_tzs: 1000,
    features: defaultFeatures(),
    zones: [],
  }
}

export function usePlatformSettings() {
  async function ensureLoaded(force = false) {
    if (settings.value && !force) return settings.value
    if (force) {
      loadPromise = null
      settings.value = null
    }
    if (!loadPromise) {
      loadPromise = fetchPlatformSettings()
        .then((data) => {
          settings.value = {
            ...fallbackSettings(),
            ...data,
            features: { ...defaultFeatures(), ...data.features },
          }
          return settings.value
        })
        .catch(() => {
          settings.value = fallbackSettings()
          return settings.value
        })
    }
    return loadPromise
  }

  const features = computed(() => settings.value?.features ?? defaultFeatures())

  function isFeatureEnabled(key: keyof PlatformFeatures) {
    return features.value[key] ?? false
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

  return { settings, features, ensureLoaded, isFeatureEnabled, formatDualPrice, deliveryFeeForSubtotal }
}
