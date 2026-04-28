// Agents-specific API surface. Transport (apiPost / apiDelete /
// ApiError / useFetch) lives in @hanzogui/admin. This file only owns
// the wire-shape types that match pkg/agents JSON tags.
//
// There is no /api/ prefix and no v2 — append-only opcode evolution
// behind /v1.

export { ApiError, apiPost, apiDelete, useFetch } from '@hanzogui/admin'

// ── shape types — match pkg/agents/types JSON tags exactly ─────────

export interface Org {
  id: string
  slug: string
  name: string
  createdAt: string
  memberCount: number
}

export interface Member {
  userId: string
  email: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}

export interface ApiKey {
  id: string
  prefix: string // e.g. "hk-1234..."
  name: string
  createdAt: string
  lastUsedAt?: string
  scopes: string[]
}

export interface BillingSummary {
  orgId: string
  balanceCents: number
  currency: string
  monthSpendCents: number
  monthBudgetCents?: number
}

export interface ObservabilityWebhook {
  id: string
  url: string
  active: boolean
  lastDelivery?: string
}
