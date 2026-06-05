/**
 * Recent purchases (admin) — commerce-backed.
 *
 * Pulls the most recent successful charges from commerce and joins them
 * against Base user records by email. Commerce returns processor-agnostic
 * charge objects, so this works whether the underlying processor was
 * Stripe, Square, crypto, etc.
 */

import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { isAdminEmail } from '~/features/api/isAdmin'
import { commerceFetch, CommerceError } from '~/features/commerce/client'
import { db } from '~/features/db'

type CommerceCharge = {
  id: string
  amount: number
  currency: string
  created: number
  description?: string
  status: string
  paid: boolean
  customer?: { id: string; email?: string } | string | null
}

export default apiRoute(async (req) => {
  const { user, token } = await ensureAuth({ req })

  if (!isAdminEmail(user.email)) {
    return Response.json({ error: 'Admin access required' }, { status: 403 })
  }

  const url = new URL(req.url)
  const limit = Math.min(Number(url.searchParams.get('limit')) || 20, 100)

  try {
    const { data: charges } = await commerceFetch<{ data: CommerceCharge[] }>(
      `/charges?limit=${limit}&expand=customer`,
      { token },
    )

    const purchases = await Promise.all(
      charges
        .filter((c) => c.status === 'succeeded' && c.paid)
        .map(async (charge) => {
          const customer = charge.customer
          const customerEmail =
            customer && typeof customer === 'object' ? customer.email ?? null : null

          let userRow: {
            id: string
            email: string | null
            full_name: string | null
          } | null = null

          if (customerEmail) {
            const { data } = await db
              .from<{ id: string; email: string | null; full_name: string | null }>('users')
              .select('id, email, full_name')
              .eq('email', customerEmail)
              .maybeSingle()
            userRow = data
          }

          let githubUsername: string | null = null
          if (userRow?.id) {
            const { data: priv } = await db
              .from<{ github_user_name: string | null }>('users_private')
              .select('github_user_name')
              .eq('id', userRow.id)
              .maybeSingle()
            githubUsername = priv?.github_user_name ?? null
          }

          return {
            id: charge.id,
            amount: charge.amount,
            currency: charge.currency,
            created: charge.created,
            description: charge.description,
            customerEmail,
            customerId:
              typeof customer === 'string' ? customer : customer?.id ?? null,
            userId: userRow?.id || null,
            userName: userRow?.full_name || null,
            githubUsername,
          }
        }),
    )

    return Response.json({ purchases })
  } catch (err) {
    if (err instanceof CommerceError) {
      return Response.json({ error: String(err.detail) }, { status: err.status })
    }
    console.error('recent-purchases error', err)
    return Response.json({ error: 'Failed to fetch purchases' }, { status: 500 })
  }
})
