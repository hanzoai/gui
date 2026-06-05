import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { commerce, CommerceError } from '~/features/commerce/client'

export default apiRoute(async (req) => {
  const { token } = await ensureAuth({ req })
  const body = await readBodyJSON(req)

  const subItemId = body['subscription_item_id']
  const subscriptionId = body['subscription_id']

  if (typeof subItemId !== 'string' || typeof subscriptionId !== 'string') {
    return Response.json(
      { error: 'subscription_id and subscription_item_id are required strings' },
      { status: 400 },
    )
  }

  try {
    await commerce.subscriptions.update(token, subscriptionId, {
      items: [{ id: subItemId, deleted: true }],
      proration_behavior: 'none',
    })
    return Response.json({ message: 'deleted successfully' })
  } catch (err) {
    if (err instanceof CommerceError) {
      return Response.json({ message: String(err.detail) }, { status: err.status })
    }
    throw err
  }
})
