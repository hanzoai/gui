/**
 * Cancel a subscription after a failed payment.
 *
 * Commerce owns the subscription state (active / past_due / canceled) so we
 * cancel via commerce and let its event stream propagate the status change
 * back into our local mirror.
 */

import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { commerce, CommerceError } from '~/features/commerce/client'

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  await ensureAuth({ req }) // gate
  const body = await readBodyJSON(req)
  const subscriptionId = body['subscriptionId']

  if (typeof subscriptionId !== 'string') {
    return Response.json({ error: 'subscriptionId required' }, { status: 400 })
  }

  try {
    const { token } = await ensureAuth({ req })
    const sub = await commerce.subscriptions.get(token, subscriptionId)
    if (sub.status === 'canceled') {
      return Response.json({ error: 'Subscription already canceled' }, { status: 400 })
    }
    await commerce.subscriptions.cancel(token, subscriptionId, { at_period_end: false })
    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof CommerceError) {
      return Response.json({ error: String(err.detail) }, { status: err.status })
    }
    console.error('handle-failed-payment-subscription error', err)
    return Response.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
})
