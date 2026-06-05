/**
 * Server-side IAM JWT validation.
 *
 * Replaces `getSupabaseServerClient` for the auth/user code path. Other
 * Supabase admin DB calls flow through `features/db` instead.
 *
 * The exported `authenticate(req)` validates the Authorization header (or a
 * cookie) against IAM's JWKS and returns a normalized user shape that downstream
 * code (formerly `User` from @supabase/supabase-js) consumes.
 */

import { validateToken } from '@hanzo/iam/auth'
import type { IamUser } from '@hanzo/iam'

const IAM_SERVER_URL =
  process.env.HANZO_IAM_SERVER_URL ?? 'https://iam.hanzo.ai'
const IAM_CLIENT_ID = process.env.HANZO_IAM_CLIENT_ID ?? 'hanzo-gui'

const iamConfig = {
  serverUrl: IAM_SERVER_URL,
  clientId: IAM_CLIENT_ID,
}

/** Normalized user shape mirrors enough of @supabase auth User for callers. */
export type AuthUser = {
  id: string
  email?: string
  user_metadata: {
    full_name?: string
    user_name?: string
    github_refresh_token?: string
    avatar_url?: string
  }
  app_metadata: Record<string, unknown>
  raw: IamUser | null
}

export type AuthedRequest = {
  user: AuthUser
  token: string
}

/**
 * Pull the bearer token from a Request. Accepts Authorization header first,
 * then falls back to the `hanzo-auth` cookie.
 */
function extractToken(req: Request): string | null {
  const auth = req.headers.get('Authorization')
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  const cookie = req.headers.get('Cookie') ?? ''
  const match = cookie.match(/(?:^|;\s*)hanzo-auth=([^;]+)/)
  if (match) return decodeURIComponent(match[1])
  return null
}

/** Validate the request token and return the user, or `null` if unauth. */
export async function authenticate(req: Request): Promise<AuthedRequest | null> {
  const token = extractToken(req)
  if (!token) return null

  const result = await validateToken(token, iamConfig)
  if (!result.ok) return null

  const user: AuthUser = {
    id: result.userId,
    email: result.email,
    user_metadata: {
      full_name: result.name,
      avatar_url: result.avatar,
      // IAM JWT claims for GitHub-linked providers:
      user_name:
        (result.claims['preferred_username'] as string | undefined) ??
        (result.claims['github_username'] as string | undefined),
      github_refresh_token: result.claims['github_refresh_token'] as
        | string
        | undefined,
    },
    app_metadata: {},
    raw: null,
  }
  return { user, token }
}

/** OAuth/OIDC discovery + redirect URL builder — used by login. */
export { IamClient } from '@hanzo/iam'
