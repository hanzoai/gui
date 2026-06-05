import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { commerce, CommerceError } from '~/features/commerce/client'

export default apiRoute(async (req) => {
  const { token } = await ensureAuth({ req })
  const body = await readBodyJSON(req)

  const subId = body['subscription_id']
  if (typeof subId !== 'string') {
    return Response.json(
      { error: 'subscription_id is required and must be a string' },
      { status: 400 },
    )
  }

  try {
    await commerce.subscriptions.cancel(token, subId, { at_period_end: true })
    return Response.json({ message: 'The subscription is cancelled.' })
  } catch (err) {
    if (err instanceof CommerceError) {
      return Response.json({ message: String(err.detail) }, { status: err.status })
    }
    throw err
  }
})
