// Real hanzo.id OIDC — Authorization Code + PKCE. This module is the protocol (no
// platform imports): it builds the authorize URL, exchanges the code, and reads the
// profile. The browser step is delegated to the platform-split ./oidc-browser (native
// opens the system browser; web redirects the page), so expo stays out of the web bundle.

import { CLIENT_ID, ISSUER, SCOPES } from './oidc-config'
import { authorize, redirectUri } from './oidc-browser'
import type { AuthOutcome } from './oidc-types'

export { CLIENT_ID, redirectUri }

export interface Tokens {
  accessToken: string
  refreshToken?: string
  /** epoch millis the access token expires, when the server reports expires_in */
  expiresAt?: number
}

export interface UserInfo {
  sub: string
  name?: string
  email?: string
  /** org slugs the account belongs to, when the IAM userinfo carries groups */
  orgs?: string[]
}

export interface Session extends Tokens {
  user?: UserInfo
}

interface Endpoints {
  authorization: string
  token: string
  userinfo: string
}

// IAM's endpoint paths, used when discovery is unreachable.
const FALLBACK: Endpoints = {
  authorization: `${ISSUER}/login/oauth/authorize`,
  token: `${ISSUER}/api/login/oauth/access_token`,
  userinfo: `${ISSUER}/api/userinfo`,
}

let endpointsCache: Endpoints | undefined

/** Resolve OIDC endpoints from the discovery document, falling back to IAM's paths. */
export async function discover(): Promise<Endpoints> {
  if (endpointsCache !== undefined) return endpointsCache
  try {
    const res = await fetch(`${ISSUER}/.well-known/openid-configuration`)
    if (res.ok) {
      const d = (await res.json()) as Record<string, string>
      endpointsCache = {
        authorization: d.authorization_endpoint ?? FALLBACK.authorization,
        token: d.token_endpoint ?? FALLBACK.token,
        userinfo: d.userinfo_endpoint ?? FALLBACK.userinfo,
      }
      return endpointsCache
    }
  } catch {
    // discovery blocked — fall through to the known IAM paths
  }
  endpointsCache = FALLBACK
  return endpointsCache
}

const UNRESERVED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'

function randomString(length: number): string {
  const bytes = new Uint8Array(length)
  const c = globalThis.crypto
  if (c?.getRandomValues != null) c.getRandomValues(bytes)
  else for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256)
  let out = ''
  for (let i = 0; i < length; i++) out += UNRESERVED[bytes[i] % UNRESERVED.length]
  return out
}

function base64Url(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  const b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bytes).toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

interface Challenge {
  value: string
  method: 'S256' | 'plain'
}

/** PKCE challenge: SHA-256 where a subtle-crypto digest exists (web), else plain. */
async function codeChallenge(verifier: string): Promise<Challenge> {
  const subtle = globalThis.crypto?.subtle
  if (subtle?.digest != null) {
    const data = new TextEncoder().encode(verifier)
    const digest = await subtle.digest('SHA-256', data)
    return { value: base64Url(new Uint8Array(digest)), method: 'S256' }
  }
  return { value: verifier, method: 'plain' }
}

function buildAuthUrl(opts: {
  endpoint: string
  state: string
  challenge: Challenge
  redirect: string
}): string {
  const q = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    scope: SCOPES,
    redirect_uri: opts.redirect,
    state: opts.state,
    code_challenge: opts.challenge.value,
    code_challenge_method: opts.challenge.method,
  })
  return `${opts.endpoint}?${q.toString()}`
}

function parseCallback(url: string): { code?: string; state?: string; error?: string } {
  const q = url.includes('?') ? url.slice(url.indexOf('?') + 1) : ''
  const p = new URLSearchParams(q)
  return {
    code: p.get('code') ?? undefined,
    state: p.get('state') ?? undefined,
    error: p.get('error') ?? undefined,
  }
}

async function exchangeCode(code: string, verifier: string, redirect: string): Promise<Tokens> {
  const { token } = await discover()
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirect,
    client_id: CLIENT_ID,
    code_verifier: verifier,
  })
  const res = await fetch(token, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: body.toString(),
  })
  if (!res.ok) throw new Error(`token exchange failed (${res.status})`)
  const d = (await res.json()) as Record<string, unknown>
  const accessToken = d.access_token
  if (typeof accessToken !== 'string' || accessToken.length === 0) {
    throw new Error(typeof d.error === 'string' ? d.error : 'no access_token in token response')
  }
  const expiresIn = typeof d.expires_in === 'number' ? d.expires_in : undefined
  return {
    accessToken,
    refreshToken: typeof d.refresh_token === 'string' ? d.refresh_token : undefined,
    expiresAt: expiresIn !== undefined ? Date.now() + expiresIn * 1000 : undefined,
  }
}

/** Read the signed-in profile from the OIDC userinfo endpoint. */
export async function fetchUserInfo(accessToken: string): Promise<UserInfo | undefined> {
  try {
    const { userinfo } = await discover()
    const res = await fetch(userinfo, { headers: { authorization: `Bearer ${accessToken}` } })
    if (!res.ok) return undefined
    const d = (await res.json()) as Record<string, unknown>
    const groups = Array.isArray(d.groups)
      ? (d.groups as unknown[]).filter((g): g is string => typeof g === 'string')
      : undefined
    return {
      sub: String(d.sub ?? d.id ?? ''),
      name:
        typeof d.name === 'string'
          ? d.name
          : typeof d.preferred_username === 'string'
            ? d.preferred_username
            : undefined,
      email: typeof d.email === 'string' ? d.email : undefined,
      orgs: groups,
    }
  } catch {
    return undefined
  }
}

/** Web PKCE spans a page navigation — stash the verifier/state for the /callback route. */
const PENDING_KEY = 'hanzo-team-oidc-pending'
interface Pending {
  verifier: string
  state: string
  redirect: string
}
function savePending(p: Pending): void {
  globalThis.sessionStorage?.setItem(PENDING_KEY, JSON.stringify(p))
}
function loadPending(): Pending | undefined {
  const raw = globalThis.sessionStorage?.getItem(PENDING_KEY)
  return raw != null ? (JSON.parse(raw) as Pending) : undefined
}
function clearPending(): void {
  globalThis.sessionStorage?.removeItem(PENDING_KEY)
}

export type LoginResult =
  | { status: 'session'; session: Session }
  | { status: 'redirecting' }
  | { status: 'cancelled' }

/**
 * Begin sign-in. Native completes in-process (returns the session); web navigates
 * away and completes on the /callback route (returns `redirecting`).
 */
export async function login(): Promise<LoginResult> {
  const { authorization } = await discover()
  const redirect = redirectUri()
  const verifier = randomString(64)
  const state = randomString(24)
  const challenge = await codeChallenge(verifier)
  const url = buildAuthUrl({ endpoint: authorization, state, challenge, redirect })

  // Persist for the web /callback route; a no-op on native (no sessionStorage).
  savePending({ verifier, state, redirect })

  const outcome: AuthOutcome = await authorize(url)
  if (outcome.kind === 'redirecting') return { status: 'redirecting' }
  if (outcome.kind === 'cancelled') return { status: 'cancelled' }

  const cb = parseCallback(outcome.url)
  if (cb.error != null) throw new Error(cb.error)
  if (cb.code == null) throw new Error('no authorization code in callback')
  if (cb.state !== state) throw new Error('state mismatch')
  const tokens = await exchangeCode(cb.code, verifier, redirect)
  const user = await fetchUserInfo(tokens.accessToken)
  return { status: 'session', session: { ...tokens, user } }
}

/** Complete the web redirect flow from the /callback route's query string. */
export async function completeWebCallback(query: {
  code?: string
  state?: string
  error?: string
}): Promise<Session> {
  if (query.error != null) throw new Error(query.error)
  const pending = loadPending()
  clearPending()
  if (pending == null) throw new Error('no pending sign-in')
  if (query.code == null) throw new Error('no authorization code')
  if (query.state !== pending.state) throw new Error('state mismatch')
  const tokens = await exchangeCode(query.code, pending.verifier, pending.redirect)
  const user = await fetchUserInfo(tokens.accessToken)
  return { ...tokens, user }
}
