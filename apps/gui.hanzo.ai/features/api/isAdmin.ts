/**
 * Admin allowlist for the /api/admin routes: impersonate, recent-purchases,
 * whitelist. Empty, so every caller gets 403.
 *
 * Admin identity is Hanzo IAM membership of the reserved `admin` org, not an
 * email list. This app authenticates against Supabase and cannot evaluate that
 * predicate, so it grants admin to no one.
 */
export const ADMIN_EMAILS: readonly string[] = []

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
