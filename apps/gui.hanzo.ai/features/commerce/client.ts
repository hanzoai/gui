/**
 * Hanzo Commerce client — thin REST wrapper for subscriptions.
 *
 * Talks to `commerce.hanzo.ai/api/v1/billing/subscriptions/*`. The full
 * OpenAPI surface is large; this client exposes only what gui.hanzo.ai
 * needs (create / get / update / cancel + list). For one-off endpoints,
 * use `commerceFetch()` directly.
 *
 * Auth: passes the caller's IAM access token (server-side) so commerce can
 * resolve org from the JWT `owner` claim.
 */

const COMMERCE_URL =
  process.env.HANZO_COMMERCE_URL ?? 'https://commerce.hanzo.ai/api/v1/billing'

export type CommerceSubscription = {
  id: string
  customer_id: string
  status:
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid'
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  items: CommerceSubscriptionItem[]
  metadata?: Record<string, string>
}

export type CommerceSubscriptionItem = {
  id: string
  price: { id: string; product: string; unit_amount: number }
  quantity: number
}

export type ListSubscriptionsParams = {
  customer?: string
  status?: CommerceSubscription['status']
  limit?: number
}

export type CreateSubscriptionParams = {
  customer: string
  items: Array<{ price: string; quantity?: number }>
  payment_method?: string
  trial_period_days?: number
  metadata?: Record<string, string>
}

export type UpdateSubscriptionParams = {
  items?: Array<{ id?: string; price?: string; quantity?: number; deleted?: boolean }>
  proration_behavior?: 'create_prorations' | 'none' | 'always_invoice'
  metadata?: Record<string, string>
}

export class CommerceError extends Error {
  readonly status: number
  readonly detail: unknown
  constructor(status: number, detail: unknown) {
    super(`commerce ${status}`)
    this.status = status
    this.detail = detail
  }
}

export async function commerceFetch<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.token) headers.set('Authorization', `Bearer ${init.token}`)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(`${COMMERCE_URL}${path}`, { ...init, headers })
  if (!res.ok) {
    let detail: unknown
    try {
      detail = await res.json()
    } catch {
      detail = await res.text()
    }
    throw new CommerceError(res.status, detail)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const commerce = {
  subscriptions: {
    create(token: string, params: CreateSubscriptionParams) {
      return commerceFetch<CommerceSubscription>('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(params),
        token,
      })
    },
    list(token: string, params: ListSubscriptionsParams = {}) {
      const q = new URLSearchParams()
      if (params.customer) q.set('customer', params.customer)
      if (params.status) q.set('status', params.status)
      if (params.limit) q.set('limit', String(params.limit))
      const qs = q.toString()
      return commerceFetch<{ data: CommerceSubscription[] }>(
        `/subscriptions${qs ? '?' + qs : ''}`,
        { token },
      )
    },
    get(token: string, id: string) {
      return commerceFetch<CommerceSubscription>(
        `/subscriptions/${encodeURIComponent(id)}`,
        { token },
      )
    },
    update(token: string, id: string, params: UpdateSubscriptionParams) {
      return commerceFetch<CommerceSubscription>(
        `/subscriptions/${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify(params),
          token,
        },
      )
    },
    cancel(token: string, id: string, opts: { at_period_end?: boolean } = {}) {
      return commerceFetch<CommerceSubscription>(
        `/subscriptions/${encodeURIComponent(id)}/cancel`,
        {
          method: 'POST',
          body: JSON.stringify(opts),
          token,
        },
      )
    },
  },
}
