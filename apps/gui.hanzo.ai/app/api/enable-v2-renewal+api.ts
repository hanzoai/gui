/**
 * Enable V2 renewal — commerce pass-through.
 *
 * Tags a subscription as eligible for the V2 renewal offer. The actual
 * upgrade happens at renewal time inside commerce based on this metadata
 * flag.
 *
 * TODO(supabase-rip): V1 → V2 detection used to read Stripe product IDs.
 * Commerce should expose a `/subscriptions/:id/v2-eligibility` endpoint
 * so the client doesn't need to know SKU plumbing.
 */

import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { commerce, CommerceError } from '~/features/commerce/client'
import { sendV2RenewalEnabledEmail } from '~/features/email/helpers'
import { db } from '~/features/db'

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { user, token } = await ensureAuth({ req })
  const body = await readBodyJSON(req)
  const subscriptionId = body['subscription_id']

  if (typeof subscriptionId !== 'string') {
    return Response.json({ error: 'subscription_id is required' }, { status: 400 })
  }

  try {
    const sub = await commerce.subscriptions.get(token, subscriptionId)
    if (sub.metadata?.v2_renewal_enabled === 'true') {
      return Response.json({
        success: true,
        message: 'V2 renewal already enabled',
        alreadyEnabled: true,
      })
    }

    await commerce.subscriptions.update(token, subscriptionId, {
      metadata: {
        ...sub.metadata,
        v2_renewal_enabled: 'true',
        v2_renewal_enabled_at: new Date().toISOString(),
      },
    })

    const { data: userData } = await db
      .from<{ email?: string; full_name?: string }>('users')
      .select('email, full_name')
      .eq('id', user.id)
      .maybeSingle()

    if (userData?.email) {
      await sendV2RenewalEnabledEmail(userData.email, {
        name: userData.full_name || 'there',
      })
    }

    return Response.json({
      success: true,
      message:
        'V2 renewal enabled. When your subscription renews, you will automatically upgrade with 35% off.',
    })
  } catch (err) {
    if (err instanceof CommerceError) {
      return Response.json(err.detail, { status: err.status })
    }
    throw err
  }
})
