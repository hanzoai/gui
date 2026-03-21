import { createStore, createUseStore } from '@tamagui/use-store'
import type { PromoConfig } from './promoConfig'

// re-export pricing constants so existing imports keep working
export {
  SUPPORT_TIERS,
  type SupportTier,
  V2_LICENSE_PRICE,
  V2_UPGRADE_PRICE,
} from '~/features/stripe/pricing'

import type { SupportTier } from '~/features/stripe/pricing'

class PaymentModal {
  show = false
  yearlyTotal = 0
  monthlyTotal = 0
  disableAutoRenew = false
  chatSupport = false
  supportTier: SupportTier = 'chat'
  teamSeats = 0
  selectedPrices = {
    disableAutoRenew: false,
    chatSupport: false,
    supportTier: 'chat' as SupportTier,
    teamSeats: 0,
  }
  // V2 fields
  isV2 = true // Default to V2 for new purchases
  projectName = ''
  projectDomain = ''
  // Support tier upgrade only (no license purchase)
  isSupportUpgradeOnly = false
  // promo support
  activePromo: PromoConfig | null = null
  prefilledCouponCode: string | null = null
  // parity discount (stacks with promo)
  parityDiscount: number = 0
  parityCountry: string | null = null
}

export const paymentModal = createStore(PaymentModal)
export const usePaymentModal = createUseStore(PaymentModal)
