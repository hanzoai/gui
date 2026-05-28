/**
 * Create subscription — commerce pass-through.
 *
 * Replaces the Stripe-direct implementation. Commerce owns payment processor
 * selection, customer mapping, coupon application, and the 3DS handshake.
 *
 * Body: { items: [{ price, quantity? }], paymentMethodId?, couponId?,
 *         disableAutoRenew?, teamSeats? }
 *
 * TODO(supabase-rip): teamSeats + couponId need to be added to commerce
 * subscription create params once those make it into the OpenAPI spec.
 * For now the route forwards them in metadata so commerce can route to
 * the right line items on its side.
 */

import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { captureServerError } from '~/features/posthog'
import { commerce, CommerceError } from '~/features/commerce/client'

type Body = {
  items?: Array<{ price: string; quantity?: number }>
  paymentMethodId?: string
  couponId?: string
  disableAutoRenew?: boolean
  teamSeats?: number
}

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const body = (await req.json()) as Body
  if (!body.paymentMethodId) {
    return Response.json({ error: 'Payment method ID is required' }, { status: 400 })
  }
  if (!body.items?.length) {
    return Response.json({ error: 'items required' }, { status: 400 })
  }

  try {
    const { user, token } = await ensureAuth({ req })
    const sub = await commerce.subscriptions.create(token, {
      customer: user.id,
      items: body.items,
      payment_method: body.paymentMethodId,
      metadata: {
        ...(body.couponId ? { coupon_id: body.couponId } : {}),
        ...(typeof body.teamSeats === 'number'
          ? { team_seats: String(body.teamSeats) }
          : {}),
        ...(body.disableAutoRenew ? { auto_renew: 'false' } : {}),
      },
    })
    return Response.json(sub)
  } catch (err) {
    if (err instanceof CommerceError) {
      return Response.json(err.detail, { status: err.status })
    }
    console.error('create-subscription failed', err)
    captureServerError(err as Error, { endpoint: '/api/create-subscription' })
    return Response.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
})
