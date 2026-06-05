/**
 * Server-side auth gate for One framework API routes.
 *
 * Validates the request's IAM JWT, ensures a corresponding `users_private`
 * record exists in Base, and returns `{ user, token }` to the caller.
 *
 * Note: the return shape is intentionally compatible with the previous
 * `{ supabase, user }` shape — we hand back `supabaseAdmin` so the dozens of
 * route handlers that destructure `const { supabase, user } = await ensureAuth(...)`
 * continue to compile. They're using it as a generic DB facade.
 */

import { redirect } from 'one'
import { authenticate, type AuthUser } from '~/features/iam/server'
import { db } from '~/features/db'
import { setupCors } from './cors'
import { supabaseAdmin } from '../auth/supabaseAdmin'

export const ensureAuth = async ({
  req,
  shouldRedirect = false,
}: {
  req: Request
  shouldRedirect?: boolean
}): Promise<{ user: AuthUser; supabase: typeof supabaseAdmin; token: string }> => {
  setupCors(req)

  const authed = await authenticate(req)
  if (!authed) {
    if (shouldRedirect) {
      throw redirect(
        `/login?${new URLSearchParams({ redirect_to: req.url ?? '' }).toString()}`,
        303,
      )
    }
    throw Response.json(
      { error: 'The user is not authenticated' },
      { status: 401, statusText: 'Not authed' },
    )
  }

  const { user, token } = authed

  // Ensure users_private row exists (mirrors old supabase upsert behaviour).
  const existing = await db.from('users_private').select('*').eq('id', user.id).maybeSingle()
  if (!existing.data?.email || !existing.data?.github_user_name) {
    const result = await db.from('users_private').upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata.full_name,
      github_refresh_token: user.user_metadata.github_refresh_token,
      github_user_name: user.user_metadata.user_name,
    })
    if (result.error) {
      console.error('Error updating user metadata', result.error)
    }
  }

  return { user, supabase: supabaseAdmin, token }
}
