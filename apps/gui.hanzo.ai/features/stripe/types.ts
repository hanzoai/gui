/**
 * Local payment-types — processor-agnostic.
 *
 * Was `import type Stripe from 'stripe'`. Commerce uses Stripe-shaped
 * primitives under the hood, so these still match the field names that
 * downstream UI components display. They're typed loosely on purpose: the
 * server-side commerce client is the source of truth for the actual API
 * shapes.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PageMeta = {
  title: string
  description: string
  cardImage: string
}

export type Customer = {
  id: string
  stripe_customer_id?: string
}

export type Product = {
  id: string
  active?: boolean
  name?: string
  description?: string
  image?: string | null
  metadata?: Record<string, string>
}

export type ProductWithPrice = Product & {
  prices?: Price[]
}

export type Address = {
  city?: string | null
  country?: string | null
  line1?: string | null
  line2?: string | null
  postal_code?: string | null
  state?: string | null
}

export type UserDetails = {
  id: string
  first_name: string
  last_name: string
  full_name?: string
  avatar_url?: string
  billing_address?: Address
  payment_method?: Record<string, unknown>
}

export type PriceInterval = 'day' | 'week' | 'month' | 'year'

export type Price = {
  id: string
  product_id?: string
  active?: boolean
  description?: string
  unit_amount?: number
  currency?: string
  type?: 'one_time' | 'recurring' | string
  interval?: PriceInterval
  interval_count?: number
  trial_period_days?: number | null
  metadata?: Record<string, string>
  products?: Product
}

export type PriceWithProduct = Price

export type SubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'

export type Subscription = {
  id: string
  user_id: string
  status?: SubscriptionStatus
  metadata?: Record<string, string>
  price_id?: string
  quantity?: number
  cancel_at_period_end?: boolean
  created: string
  current_period_start: string
  current_period_end: string
  ended_at?: string
  cancel_at?: string
  canceled_at?: string
  trial_start?: string
  trial_end?: string
  prices?: Price
}
