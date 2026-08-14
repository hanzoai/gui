export const ProductName = {
  GuiPro: 'Gui Pro',
  GuiProV2: 'Gui Pro V2', // V2 per-project license
  GuiProV2Upgrade: 'Gui Pro V2 Upgrade', // V2 yearly renewal
  GuiChat: 'Gui Chat',
  GuiSupport: 'Gui Support',
  GuiSupportDirect: 'Gui Support Direct', // V2 direct support
  GuiSupportSponsor: 'Gui Support Sponsor', // V2 sponsor support
  GuiProTeamSeats: 'Gui Pro Team Seats',
  GuiBento: 'Bento',
  GuiTakeoutStack: 'Takeout Stack',
} as const

export const ProductSlug = {
  UniversalStarter: 'universal-starter',
  IconPacks: 'icon-packs',
  FontPacks: 'font-packs',
  Bento: 'bento',
} as const

export const SubscriptionStatus = {
  Trialing: 'trialing',
  Active: 'active',
  Canceled: 'canceled',
  Incomplete: 'incomplete',
  IncompleteExpired: 'incomplete_expired',
  PastDue: 'past_due',
  Unpaid: 'unpaid',
} as const

export const Pricing = {
  Recurring: 'recurring',
  OneTime: 'one_time',
} as const

// Type helpers to get the values
export type ProductNameType = (typeof ProductName)[keyof typeof ProductName]
export type ProductSlugType = (typeof ProductSlug)[keyof typeof ProductSlug]
export type SubscriptionStatusType =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]
export type PricingType = (typeof Pricing)[keyof typeof Pricing]

export type UserSubscriptionStatus = {
  pro: boolean
  /** Has V1 Pro subscription (legacy) */
  proV1: boolean
  /** Has V2 Pro license */
  proV2: boolean
  chat: boolean
  supportTier: number
  teamSeats: number
  couponCodes: {
    [key: string]: string
  }
  /** Whether this user is a developer who can test the purchase flow */
  isDeveloper?: boolean
}
