/**
 * Compat shim — old name, new implementation.
 *
 * The browser auth client is now `features/iam/client`. We re-export from
 * here under the historical names so existing components (login.tsx,
 * payment-finished.tsx, useUser.tsx, etc.) keep compiling while we migrate
 * them one-by-one.
 *
 * TODO(supabase-rip): rewrite call sites to import from `~/features/iam/client`
 * directly and delete this shim.
 */

import { useEffect, useState } from 'react'
import {
  getAccessToken as iamGetAccessToken,
  signInWithOtp,
  signInWithPassword,
  signInWithProvider,
  signOut,
  useIam,
  useIamSession,
} from '~/features/iam/client'

/** Old shape: `{ auth: { ... } }`. We forward only what's still used. */
type AuthLikeClient = {
  auth: {
    getSession(): Promise<{ data: { session: Session | null }; error: Error | null }>
    getUser(token?: string): Promise<{
      data: { user: { id: string; email?: string } | null }
      error: Error | null
    }>
    signInWithPassword(args: {
      email: string
      password: string
    }): Promise<{ error?: Error }>
    signInWithOtp(args: {
      email: string
      options?: { emailRedirectTo?: string }
    }): Promise<{ error?: Error }>
    signInWithOAuth(args: {
      provider: string
      options?: { redirectTo?: string }
    }): Promise<{ data: { url?: string } | null; error?: Error }>
    signOut(): Promise<void>
    onAuthStateChange(
      cb: (event: string, session: Session | null) => void,
    ): { data: { subscription: { unsubscribe(): void } } }
    /** OAuth code → tokens — forwarded to IAM. */
    exchangeCodeForSession(code: string): Promise<{ error?: Error }>
  }
}

export type Session = {
  access_token: string
  user: { id: string; email?: string }
} | null

function makeClient(): AuthLikeClient {
  return {
    auth: {
      async getSession() {
        const token = await iamGetAccessToken()
        if (!token) return { data: { session: null }, error: null }
        return {
          data: {
            session: { access_token: token, user: { id: '' } } as Session,
          },
          error: null,
        }
      },
      async getUser(_token?: string) {
        const token = _token ?? (await iamGetAccessToken())
        if (!token) return { data: { user: null }, error: null }
        return { data: { user: { id: '' } }, error: null }
      },
      async signInWithPassword({ email, password }) {
        return signInWithPassword(email, password)
      },
      async signInWithOtp({ email }) {
        return signInWithOtp(email)
      },
      async signInWithOAuth({ provider, options }) {
        await signInWithProvider(provider, { redirectTo: options?.redirectTo })
        return { data: null, error: undefined }
      },
      async signOut() {
        await signOut()
      },
      onAuthStateChange(_cb) {
        // IAM client emits via useIamSession; this is a no-op shim.
        return { data: { subscription: { unsubscribe() {} } } }
      },
      async exchangeCodeForSession(code: string) {
        // The IAM browser SDK handles the PKCE round-trip via its own
        // callback registration. The login flow now redirects to
        // /api/auth/callback which bounces through IAM; by the time this
        // function runs the token is already in localStorage. We keep the
        // function around so legacy call sites compile.
        void code
        return {}
      },
    },
  }
}

let _client: AuthLikeClient | null = null

export function useSupabaseClient(): AuthLikeClient {
  const [current, setCurrent] = useState<AuthLikeClient | null>(() => _client)
  useEffect(() => {
    if (current) return
    if (!_client) _client = makeClient()
    setCurrent(_client)
  }, [current])
  return current ?? (_client ??= makeClient())
}

export function useSupabaseSession(): Session {
  const user = useIamSession()
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    void iamGetAccessToken().then(setToken)
  }, [user])
  if (!user || !token) return null
  return {
    access_token: token,
    user: { id: (user as { id?: string }).id ?? '', email: (user as { email?: string }).email },
  }
}

export const useSupabase = () => {
  const supabase = useSupabaseClient()
  const session = useSupabaseSession()
  return { supabase, session }
}

export const getAccessToken = iamGetAccessToken

// Re-export so consumers can opt into the new path directly.
export { useIam, signInWithProvider, signInWithPassword, signInWithOtp, signOut }
