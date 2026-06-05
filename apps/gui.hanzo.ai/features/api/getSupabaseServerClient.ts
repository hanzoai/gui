/**
 * Compatibility stub — Supabase SSR client is gone.
 *
 * Callers should switch to `features/iam/server::authenticate(req)`.
 * Any remaining import of this module is a TODO(supabase-rip).
 */

export function getSupabaseServerClient(_request?: Request): never {
  throw new Error(
    'getSupabaseServerClient: removed. Use authenticate(req) from features/iam/server.',
  )
}
