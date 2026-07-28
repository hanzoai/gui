/*
 * The signed-in session.
 *
 * hanzo.id is the only door. The backend owns the whole OAuth hop — it holds the
 * client id, mints and checks `state`, and exchanges the code — so this module
 * never sees a credential, a client secret, or a PKCE verifier. Verified against
 * the live service:
 *
 *   GET  /v1/team/account/auth/openid  -> 302 hanzo.id/v1/iam/oauth/authorize?...
 *   POST /v1/team/account {method:login} -> account:status:Unauthorized
 *                                           "sign in at hanzo.id"
 *
 * Sign-in is therefore one navigation, and there is deliberately no credential
 * form to build.
 */

const KEY = 'hanzo-team-token'

/** Start sign-in. The backend redirects to hanzo.id and back. */
export function signIn(): void {
  window.location.assign('/v1/team/account/auth/openid')
}

export function signOut(): void {
  window.localStorage.removeItem(KEY)
  window.location.assign('/login')
}

export function token(): string | null {
  return window.localStorage.getItem(KEY)
}

/**
 * Take the token the backend handed back, and report any error it reported.
 *
 * Read from the query rather than from a route, because the backend chooses the
 * path: it bounces to `/login:component:LoginApp/auth?token=…` on success and
 * `/login?error=…` on failure (cloud `apps/team/account.go:836`). The first is a
 * Huly location string that means nothing to this shell, so matching on the path
 * would couple us to it. The query is the actual contract.
 */
export function claim(): { error: string | null } {
  const query = new URLSearchParams(window.location.search)
  const handed = query.get('token')
  const error = query.get('error')

  if (handed !== null && handed !== '') {
    window.localStorage.setItem(KEY, handed)
    // Drop the token from the address bar so it stays out of history and out of
    // any Referer this page goes on to send.
    window.history.replaceState(null, '', window.location.pathname.startsWith('/login') ? '/' : window.location.pathname)
  }

  return { error }
}
