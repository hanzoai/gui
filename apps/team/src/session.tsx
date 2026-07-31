// One session store for every screen. Persists the OIDC session (AsyncStorage works
// on web via localStorage and on native), exposes it through React context, and owns
// sign-in / sign-out so the screens never touch the protocol directly.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getItem, removeItem, setItem } from './store'
import { login as oidcLogin, type Session } from './auth'

const STORAGE_KEY = 'hanzo-team-session'

async function load(): Promise<Session | null> {
  const raw = await getItem(STORAGE_KEY)
  if (raw == null) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

async function save(session: Session | null): Promise<void> {
  if (session == null) await removeItem(STORAGE_KEY)
  else await setItem(STORAGE_KEY, JSON.stringify(session))
}

export interface SessionState {
  session: Session | null
  loading: boolean
  /** true while a sign-in is in flight */
  signingIn: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionState | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    let live = true
    void load().then((s) => {
      if (live) {
        setSession(s)
        setLoading(false)
      }
    })
    return () => {
      live = false
    }
  }, [])

  const signIn = useCallback(async () => {
    setSigningIn(true)
    try {
      const result = await oidcLogin()
      if (result.status === 'session') {
        await save(result.session)
        setSession(result.session)
      }
      // 'redirecting' (web) completes on the /callback route; 'cancelled' is a no-op
    } finally {
      setSigningIn(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    await save(null)
    setSession(null)
  }, [])

  const value = useMemo<SessionState>(
    () => ({ session, loading, signingIn, signIn, signOut }),
    [session, loading, signingIn, signIn, signOut],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext)
  if (ctx === undefined) throw new Error('useSession must be used within a SessionProvider')
  return ctx
}

/** Persist a session obtained outside the provider (the web /callback route). */
export async function persistSession(session: Session): Promise<void> {
  await save(session)
}
