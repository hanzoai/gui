/**
 * single source of truth for all pricing values
 *
 * every file that needs a price should import from here.
 * change a number here and it updates everywhere:
 * display, api, stripe checkout, emails, etc.
 */

// ============================================
// V2 license
// ============================================

export const V2_LICENSE_PRICE = 250
export const V2_LICENSE_PRICE_CENTS = V2_LICENSE_PRICE * 100

// ============================================
// V2 upgrade (yearly renewal after year 1)
// ============================================

export const V2_UPGRADE_PRICE = 100
export const V2_UPGRADE_PRICE_CENTS = V2_UPGRADE_PRICE * 100

// ============================================
// support tiers
// ============================================

export const SUPPORT_TIERS = {
  chat: {
    label: 'Chat',
    price: 0,
    priceLabel: 'included',
    description:
      'Access to the private #takeout Discord channel. No SLA guarantee, but we typically respond within a few days.',
  },
  direct: {
    label: 'Direct',
    price: 500,
    priceLabel: '$500/mo',
    description:
      '5 bug fixes per year, guaranteed response within 2 business days, your issues get prioritized in our queue.',
  },
  sponsor: {
    label: 'Sponsor',
    price: 2000,
    priceLabel: '$2,000/mo',
    description:
      'Unlimited higher priority bug fixes, 1 day response time, plus a monthly video call with the team.',
  },
} as const

export type SupportTier = keyof typeof SUPPORT_TIERS
