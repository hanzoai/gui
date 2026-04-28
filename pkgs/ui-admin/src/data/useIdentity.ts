// useIdentity — single-fetch, module-level cached read of the
// signed-in operator's IAM identity. Used for client-side gating of
// admin-only UI affordances (the server is still authoritative — this
// hook just stops users from seeing controls they can't actually
// use). Endpoint is `/v1/iam/whoami`, expected to return the canonical
// User shape; missing fields default to "not admin".
//
// One fetch per page-load: the hook resolves once into a module
// promise that all subsequent callers reuse. No global state library,
// no provider — admin pages don't need cross-tab dedup. If a deploy
// ever requires real-time identity updates, swap this for SWR at that
// consumer; don't grow the surface here.

import { useEffect, useState } from 'react'

export interface Identity {
  // `built-in/admin` is the seeded super-admin. Anyone in the
  // `built-in` org with `isAdmin: true` is treated as super-admin.
  // Org-scoped admins (owner !== 'built-in', isAdmin: true) can
  // manage their org but cannot grant super-admin status.
  owner: string
  name: string
  displayName: string
  isAdmin: boolean
}

// Fetcher seam — tests inject a stub. Production passes through to
// `fetch('/v1/iam/whoami')`.
export type IdentityFetcher = () => Promise<Identity | null>

const DEFAULT_FETCHER: IdentityFetcher = async () => {
  const res = await fetch('/v1/iam/whoami', {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  })
  if (!res.ok) return null
  const body = (await res.json().catch(() => null)) as
    | { data?: Partial<Identity> }
    | Partial<Identity>
    | null
  if (!body) return null
  // Some IAM responses wrap the user in `{ data: ... }`, others
  // return it bare. Handle both — we only care about the four
  // fields that drive gating.
  const raw =
    typeof body === 'object' && body !== null && 'data' in body
      ? (body as { data?: Partial<Identity> }).data
      : (body as Partial<Identity>)
  if (!raw || typeof raw !== 'object') return null
  return {
    owner: typeof raw.owner === 'string' ? raw.owner : '',
    name: typeof raw.name === 'string' ? raw.name : '',
    displayName:
      typeof raw.displayName === 'string' ? raw.displayName : (raw.name ?? ''),
    isAdmin: raw.isAdmin === true,
  }
}

let cached: Promise<Identity | null> | null = null
let fetcherOverride: IdentityFetcher | null = null

export function isSuperAdmin(id: Identity | null | undefined): boolean {
  if (!id) return false
  // Super-admin scope: built-in org members with the admin flag.
  // Org-scoped admins (any other owner) can flip user fields inside
  // their org but cannot promote to super-admin.
  return id.owner === 'built-in' && id.isAdmin === true
}

export interface UseIdentityState {
  identity: Identity | null
  isLoading: boolean
  error: Error | null
}

export function useIdentity(): UseIdentityState {
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true
    if (cached === null) {
      cached = (fetcherOverride ?? DEFAULT_FETCHER)().catch(() => null)
    }
    cached
      .then((id) => {
        if (!alive) return
        setIdentity(id)
        setIsLoading(false)
      })
      .catch((e: unknown) => {
        if (!alive) return
        setError(e instanceof Error ? e : new Error(String(e)))
        setIsLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return { identity, isLoading, error }
}

// Test-only: reset the module cache and override the fetcher. The
// production path never touches these — they exist so a single test
// process can simulate multiple identities sequentially without
// poisoning the next test.
export function __resetIdentityForTests(next?: IdentityFetcher | null): void {
  cached = null
  fetcherOverride = next ?? null
}
