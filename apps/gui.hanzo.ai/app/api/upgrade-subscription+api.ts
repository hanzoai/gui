/**
 * Upgrade subscription — commerce pass-through.
 *
 * The cloud UI no longer creates Stripe subscriptions directly. Commerce
 * decides processor (Stripe / Square / crypto / ...) based on org config and
 * the payment method. The client should:
 *
 *   1. POST /v1/upgrade-subscription with { items: [{ price, quantity? }],
 *      payment_method_id?, coupon? }
 *   2. Receive { id, client_secret? } back.
 *   3. If client_secret is present, finish the 3DS / SCA confirmation flow
 *      via the @hanzoai/pay UI (returned via redirect).
 *
 * TODO(supabase-rip): finalize the commerce → @hanzoai/pay handoff once the
 * payment-finished + checkout-session endpoints are stable in commerce.
 */

import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { commerce, CommerceError } from '~/features/commerce/client'

type Body = {
  items?: Array<{ price: string; quantity?: number }>
  payment_method_id?: string
  trial_period_days?: number
  metadata?: Record<string, string>
}

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { user, token } = await ensureAuth({ req })
  const body = (await req.json()) as Body

  if (!body.items?.length) {
    return Response.json({ error: 'items required' }, { status: 400 })
  }

  try {
    const sub = await commerce.subscriptions.create(token, {
      customer: user.id,
      items: body.items,
      payment_method: body.payment_method_id,
      trial_period_days: body.trial_period_days,
      metadata: body.metadata,
    })
    return Response.json(sub)
  } catch (err) {
    if (err instanceof CommerceError) {
      return Response.json(err.detail, { status: err.status })
    }
    console.error('upgrade-subscription failed', err)
    return Response.json({ error: 'failed to create subscription' }, { status: 500 })
  }
})
