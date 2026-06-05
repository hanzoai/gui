/**
 * Add team seats — commerce pass-through.
 *
 * Forwards a subscription update that increases (or adds) the team-seats
 * line item. Commerce resolves the price ID server-side from the metadata
 * shape, so the client only sends the additional-seats count.
 *
 * TODO(supabase-rip): commerce should expose a dedicated /subscriptions/:id/
 * add-seats endpoint with first-class team-seat semantics. Once it does,
 * collapse this route to a single forwarded call rather than the items[]
 * update we're using here.
 */

import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { commerce, CommerceError } from '~/features/commerce/client'

type Body = {
  subscriptionId?: string
  additionalSeats?: number
  paymentMethodId?: string
  couponId?: string
  teamSeatPriceId?: string
}

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const body = (await req.json()) as Body
  if (!body.subscriptionId || !body.additionalSeats || !body.teamSeatPriceId) {
    return Response.json(
      { error: 'subscriptionId, additionalSeats, teamSeatPriceId required' },
      { status: 400 },
    )
  }

  try {
    const { token } = await ensureAuth({ req })
    const updated = await commerce.subscriptions.update(token, body.subscriptionId, {
      items: [{ price: body.teamSeatPriceId, quantity: body.additionalSeats }],
      proration_behavior: 'create_prorations',
      metadata: body.couponId ? { coupon_id: body.couponId } : undefined,
    })
    return Response.json(updated)
  } catch (err) {
    if (err instanceof CommerceError) {
      return Response.json(err.detail, { status: err.status })
    }
    console.error('add-team-seats failed', err)
    return Response.json({ error: 'Failed to add team seats' }, { status: 500 })
  }
})
