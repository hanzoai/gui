/**
 * Test-user fixture endpoint — REMOVED.
 *
 * The old route created test accounts directly against Supabase Auth and
 * mocked V1/V2 subscriptions in the local Stripe DB tables.
 *
 * Equivalent fixtures now belong in:
 *   - IAM seed scripts (~/work/hanzo/iam/migrations) for accounts
 *   - commerce fixture seed (~/work/hanzo/commerce/cmd/seed) for plans
 *
 * Returning 501 so the route doesn't accidentally run in production.
 *
 * TODO(supabase-rip): port the new/v1/v2 fixture variants to an IAM admin
 * seed script + commerce fixture sub.
 */

import { apiRoute } from '~/features/api/apiRoute'

export default apiRoute(async () => {
  return Response.json(
    {
      error: 'Test-user fixture endpoint moved to IAM/commerce seeders',
    },
    { status: 501 },
  )
})
