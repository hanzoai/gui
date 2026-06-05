/**
 * Browser-side IAM session.
 *
 * Replaces `features/auth/useSupabaseClient.ts`. The session is the IAM
 * access token persisted in localStorage; React components observe it via
 * `useIamSession()`.
 */

import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import { IAM, type IAMUser } from '@hanzo/iam/browser'

const IAM_SERVER_URL =
  process.env.NEXT_PUBLIC_HANZO_IAM_SERVER_URL ?? 'https://iam.hanzo.ai'
const IAM_CLIENT_ID = process.env.NEXT_PUBLIC_HANZO_IAM_CLIENT_ID ?? 'hanzo-gui'
const STORAGE_KEY = 'hanzo-iam-token'

let _iam: IAM | null = null

function ensureIam(): IAM | null {
  if (typeof window === 'undefined') return null
  if (_iam) return _iam
  _iam = new IAM({
    serverUrl: IAM_SERVER_URL,
    clientId: IAM_CLIENT_ID,
    storageKey: STORAGE_KEY,
    redirectUri: `${window.location.origin}/api/auth/callback`,
  } as unknown as ConstructorParameters<typeof IAM>[0])
  return _iam
}

/** Read the access token without React. */
export async function getAccessToken(): Promise<string | null> {
  const iam = ensureIam()
  if (!iam) return null
  try {
    const token = await iam.getAccessToken?.()
    if (typeof token === 'string') return token
  } catch {
    /* fall through */
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { access_token?: string }
    return parsed.access_token ?? null
  } catch {
    return null
  }
}

/** Begin the OAuth code flow. Redirects the browser. */
export async function signInWithProvider(
  provider: 'github' | 'google' | string,
  opts: { redirectTo?: string } = {},
): Promise<void> {
  const iam = ensureIam()
  if (!iam) return
  await iam.signIn?.({
    provider,
    redirectTo: opts.redirectTo ?? `${window.location.origin}/api/auth/callback`,
  } as Parameters<NonNullable<IAM['signIn']>>[0])
}

/** Email + password sign-in (IAM ROPC under the hood). */
export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ error?: Error }> {
  const iam = ensureIam()
  if (!iam) return { error: new Error('IAM not initialised') }
  try {
    await iam.signInWithPassword?.({ email, password })
    return {}
  } catch (err) {
    return { error: err as Error }
  }
}

/** Magic-link request (delegated to IAM's email-OTP endpoint). */
export async function signInWithOtp(email: string): Promise<{ error?: Error }> {
  const iam = ensureIam()
  if (!iam) return { error: new Error('IAM not initialised') }
  try {
    await iam.signInWithOtp?.({ email })
    return {}
  } catch (err) {
    return { error: err as Error }
  }
}

export async function signOut(): Promise<void> {
  const iam = ensureIam()
  if (!iam) return
  try {
    await iam.signOut?.()
  } finally {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }
}

/** React: returns the current `IAMUser | null`, updating on auth changes. */
export function useIamSession(): IAMUser | null {
  const [user, setUser] = useState<IAMUser | null>(null)
  const { mutate } = useSWRConfig()

  useEffect(() => {
    const iam = ensureIam()
    if (!iam) return
    let cancelled = false
    iam
      .getUser?.()
      .then((u) => {
        if (!cancelled) setUser((u as IAMUser | null) ?? null)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
    const unsub = iam.onChange?.((next) => {
      setUser((next as IAMUser | null) ?? null)
      void mutate('user')
    })
    return () => {
      cancelled = true
      unsub?.()
    }
  }, [mutate])

  return user
}

export function useIam() {
  return { iam: ensureIam(), session: useIamSession() }
}
