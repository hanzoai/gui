/**
 * Admin impersonation — REMOVED. Use IAM's `assume-identity` flow.
 *
 * The old route generated a Supabase magic link for the target email and
 * returned an HTML page that exchanged the OTP client-side.
 *
 * IAM exposes a server-side admin assume-identity endpoint; once an admin
 * SDK call ships in @hanzo/iam we will return a short-lived signed redirect
 * to it. Until then this route returns 501.
 *
 * TODO(supabase-rip): wire to IAM admin assume-identity once the endpoint
 * is documented and the SDK exposes it.
 */

import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { isAdminEmail } from '~/features/api/isAdmin'

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { user } = await ensureAuth({ req })
  if (!isAdminEmail(user.email)) {
    return Response.json({ error: 'Admin access required' }, { status: 403 })
  }

  return Response.json(
    {
      error: 'Impersonation moved to IAM admin assume-identity',
      docs: 'https://docs.hanzo.ai/iam/admin/assume-identity',
    },
    { status: 501 },
  )
})
