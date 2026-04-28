// Commerce-specific API surface. Transport (apiPost / apiDelete /
// ApiError / useFetch) lives in @hanzogui/admin. This file owns the
// wire-shape types that match commerce/models JSON tags.
//
// Identity is supplied upstream by hanzoai/gateway via X-Org-Id /
// X-User-Id / X-User-Email headers (see /Users/z/work/hanzo/CLAUDE.md
// HTTP Header Convention). The SPA never attaches Authorization
// itself — the browser session cookie is sent and the gateway
// rewrites it into validated identity headers.

export { ApiError, apiPost, apiDelete } from '@hanzogui/admin'

// ── Resource shapes ───────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  slug?: string
  description?: string
  price: number
  currency: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface Order {
  id: string
  number?: string
  email?: string
  total: number
  currency: string
  status?: string
  fulfillmentStatus?: string
  paymentStatus?: string
  createdAt?: string
}

export interface Customer {
  id: string
  email: string
  name?: string
  phone?: string
  totalSpend?: number
  ordersCount?: number
  createdAt?: string
}

export interface Collection {
  id: string
  name: string
  slug?: string
  productCount?: number
  createdAt?: string
}

export interface InventoryItem {
  id: string
  variantId?: string
  sku?: string
  quantity: number
  reserved?: number
  location?: string
  updatedAt?: string
}

export interface BillingPlan {
  slug: string
  name: string
  description?: string
  category?: string
  priceMonth: number
  priceYear?: number
  currency: string
}

export interface ListResponse<T> {
  count: number
  models: T[]
  page: number
  display: number
}

// ── Status formatting ─────────────────────────────────────────────

import type { StatusVariant } from '@hanzogui/admin'

export function statusVariant(s?: string): StatusVariant {
  switch (s) {
    case 'active':
    case 'completed':
    case 'paid':
      return 'success'
    case 'pending':
    case 'processing':
      return 'warning'
    case 'cancelled':
    case 'refunded':
    case 'failed':
      return 'destructive'
    case 'draft':
    case 'inactive':
      return 'muted'
    default:
      return 'muted'
  }
}

export function formatMoney(amountCents: number, currency = 'USD') {
  if (amountCents == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountCents / 100)
}
