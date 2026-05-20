// AuthGate — single declarative guard for any hanzoai/base-backed
// admin SPA. Wraps the route subtree, drives the OIDC/PKCE redirect
// dance via the canonical IAM class from @hanzo/iam/browser, and
// exposes the resulting token + user via `useAuth()`.
//
// Mounting pattern (consumer):
//
//   <BrowserRouter>
//     <AuthGate iam={iam}>
//       <Routes>
//         <Route path="/" element={<AdminApp …><Outlet/></AdminApp>}>
//           <Route index element={<Collections/>}/>
//         </Route>
//       </Routes>
//     </AuthGate>
//   </BrowserRouter>
//
// AuthGate intercepts two paths internally:
//   - GET /login     → renders <SignInRedirect/> (single button → IAM)
//   - GET /callback  → renders <CallbackHandler/> (consumes code, sets token)
// Everything else is forwarded to children iff there's a live token,
// otherwise it stashes the intended path and bounces to /login.
//
// The IAM class is the auth boundary. PKCE, code-verifier, refresh
// token storage all live inside it (sessionStorage by default). This
// component never touches localStorage directly; it derives the user
// observable from a tiny in-memory subscription set.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Button, H2, Text, YStack } from 'hanzogui'

// Structural type for the IAM client. We intentionally do NOT import
// the concrete `IAM` class from `@hanzo/iam/browser` here — every
// consumer pins its own peer version, and the class' surface keeps
// growing (loginWithCredentials, sendVerificationCode, etc.). The gate
// only needs the OIDC subset. By naming the shape here we keep this
// package version-agnostic against `@hanzo/iam` 0.8.x / 0.9.x / next.
export interface IAMClient {
  signinRedirect(params?: { additionalParams?: Record<string, string> }): Promise<void>
  handleCallback(callbackUrl?: string): Promise<{
    access_token?: string
    accessToken?: string
    [key: string]: unknown
  }>
  getUserInfo(): Promise<Record<string, unknown>>
  getAccessToken?: () => string | null
  /** 0.8.x exposes `clearTokens`; 0.9.x exposes both `clearTokens` and `logout`. */
  clearTokens?: () => void
  logout?: () => Promise<void> | void
}

// ---------------------------------------------------------------------------
// Identity store — module-scoped, IAM-driven
// ---------------------------------------------------------------------------

export interface AuthUser {
  sub?: string
  email?: string
  name?: string
  displayName?: string
  avatar?: string
  owner?: string
  [key: string]: unknown
}

interface AuthState {
  token: string
  user: AuthUser | null
  ready: boolean
}

type Listener = (s: AuthState) => void

const listeners = new Set<Listener>()
let state: AuthState = { token: '', user: null, ready: false }

function setState(next: Partial<AuthState>) {
  state = { ...state, ...next }
  for (const fn of listeners) fn(state)
}

function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  fn(state)
  return () => {
    listeners.delete(fn)
  }
}

// Single-use code guard for React 18 StrictMode (double-mount) and
// for tabs where the user clicks back into /callback after exchange.
const consumedCodes = new Set<string>()

// ---------------------------------------------------------------------------
// React context
// ---------------------------------------------------------------------------

export interface AuthContextValue extends AuthState {
  iam: IAMClient
  /** Trigger OIDC redirect to the IAM authorize endpoint. */
  signIn: (postLoginPath?: string) => Promise<void>
  /** Clear the local token and (if RP-initiated logout configured) hit IAM. */
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('[useAuth] must be used under <AuthGate>')
  }
  return ctx
}

// ---------------------------------------------------------------------------
// AuthGate
// ---------------------------------------------------------------------------

export interface AuthGateProps {
  /** Configured IAM client (caller owns construction). */
  iam: IAMClient
  /** Path under which the redirect-to-IAM page is rendered. Default `/login`. */
  loginPath?: string
  /** Path that IAM redirects back to after auth. Default `/callback`. */
  callbackPath?: string
  /** Optional render override for the sign-in screen. */
  renderSignIn?: (props: { onSignIn: () => void; title: string }) => ReactNode
  /** Visible application title on the default sign-in screen. */
  appTitle?: string
  /** Where to send users after a successful auth when no `from` was stashed. */
  defaultLandingPath?: string
  /**
   * Override the "go to URL" navigation. Defaults to
   * `window.location.replace`. Useful for tests and for SPAs that
   * want to bridge into their router instead of a hard nav.
   */
  navigate?: (path: string) => void
  /** Wrapped subtree. */
  children: ReactNode
}

const defaultNavigate = (path: string) => {
  if (typeof window !== 'undefined') window.location.replace(path)
}

const POST_LOGIN_KEY = 'hanzo_iam_post_login'

export function AuthGate({
  iam,
  loginPath = '/login',
  callbackPath = '/callback',
  renderSignIn,
  appTitle = 'Admin',
  defaultLandingPath = '/',
  navigate = defaultNavigate,
  children,
}: AuthGateProps) {
  const [snap, setSnap] = useState<AuthState>(state)

  // Subscribe to module store + bootstrap from IAM at mount.
  useEffect(() => {
    const off = subscribe(setSnap)
    // Re-hydrate from IAM's storage on every mount. The IAM class
    // persists tokens to sessionStorage; on a hard refresh we must
    // pick it back up before deciding to redirect.
    void hydrateFromIAM(iam)
    return off
  }, [iam])

  // Cross-tab logout: when sessionStorage clears in another tab we
  // won't see it (sessionStorage is per-tab), but localStorage events
  // do propagate. Apps that want cross-tab logout can mirror tokens
  // to localStorage in their getStorage() override. Not enforced here.

  const signIn = useCallback(
    async (postLoginPath?: string) => {
      try {
        sessionStorage.setItem(POST_LOGIN_KEY, postLoginPath ?? location.pathname + location.search)
      } catch {
        /* private mode */
      }
      await iam.signinRedirect()
    },
    [iam]
  )

  const signOut = useCallback(() => {
    try {
      // 0.8.x: clearTokens (sync). 0.9.x: clearTokens + RP-initiated
      // logout. Call both best-effort; swallow if either is absent.
      iam.clearTokens?.()
      void iam.logout?.()
    } catch {
      /* swallow */
    }
    setState({ token: '', user: null, ready: true })
  }, [iam])

  const value = useMemo<AuthContextValue>(
    () => ({ ...snap, iam, signIn, signOut }),
    [snap, iam, signIn, signOut]
  )

  // Route dispatch is path-based (not router-aware) so AuthGate
  // composes with any router. Consumers can also instead place the
  // sub-components (SignInRedirect, CallbackHandler) at explicit routes.
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  const inLogin = path === loginPath
  const inCallback = path === callbackPath

  if (inCallback) {
    return (
      <AuthContext.Provider value={value}>
        <CallbackHandler
          iam={iam}
          defaultLandingPath={defaultLandingPath}
          navigate={navigate}
        />
      </AuthContext.Provider>
    )
  }

  if (!snap.ready) {
    // Suppress UI flash while bootstrap is in flight.
    return null
  }

  if (!snap.token && !inLogin) {
    // Stash + redirect without React Router (transport-agnostic).
    try {
      sessionStorage.setItem(POST_LOGIN_KEY, path + window.location.search)
    } catch {
      /* private mode */
    }
    navigate(loginPath)
    return null
  }

  if (inLogin) {
    const onSignIn = () => void signIn(defaultLandingPath)
    return (
      <AuthContext.Provider value={value}>
        {renderSignIn
          ? renderSignIn({ onSignIn, title: appTitle })
          : <DefaultSignIn title={appTitle} onSignIn={onSignIn} />}
      </AuthContext.Provider>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ---------------------------------------------------------------------------
// Hydration from IAM session storage
// ---------------------------------------------------------------------------

async function hydrateFromIAM(iam: IAMClient): Promise<void> {
  try {
    // 0.8.x / 0.9.x: getAccessToken() reads from sessionStorage and
    // returns null when nothing is stored.
    const token = iam.getAccessToken?.() ?? ''
    if (!token) {
      setState({ token: '', user: null, ready: true })
      return
    }
    let user: AuthUser | null = null
    try {
      user = ((await iam.getUserInfo?.()) as AuthUser | null) ?? null
    } catch {
      /* userinfo may fail offline; token is still usable */
    }
    setState({ token, user, ready: true })
  } catch {
    setState({ token: '', user: null, ready: true })
  }
}

// ---------------------------------------------------------------------------
// CallbackHandler — consumes the OIDC code, persists token, redirects
// ---------------------------------------------------------------------------

export interface CallbackHandlerProps {
  iam: IAMClient
  /** Where to send the user when no `from` is stashed. */
  defaultLandingPath?: string
  /** Override the post-exchange navigation. Defaults to window.location.replace. */
  navigate?: (path: string) => void
}

export function CallbackHandler({
  iam,
  defaultLandingPath = '/',
  navigate = defaultNavigate,
}: CallbackHandlerProps) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code') ?? ''
    if (!code || consumedCodes.has(code)) return
    consumedCodes.add(code)

    void (async () => {
      try {
        // `handleCallback` returns snake_case `access_token` on IAM
        // 0.8.x (TokenResponse) and camelCase `accessToken` on 0.9.x+
        // (IAMToken). The IAMClient union shape covers both; we pick
        // whichever is populated.
        const tokens = await iam.handleCallback()
        const accessToken = tokens.accessToken ?? tokens.access_token ?? ''
        const user = await iam.getUserInfo().catch(() => null)
        setState({
          token: accessToken,
          user: (user as AuthUser | null) ?? null,
          ready: true,
        })
        let to = defaultLandingPath
        try {
          to = sessionStorage.getItem(POST_LOGIN_KEY) ?? defaultLandingPath
          sessionStorage.removeItem(POST_LOGIN_KEY)
        } catch {
          /* private mode */
        }
        // Hard navigate by default — works for every router. SPAs that
        // want soft navigation pass a router-bound `navigate` override.
        navigate(to)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    })()
  }, [iam, defaultLandingPath])

  return (
    <YStack flex={1} items="center" justify="center" minH="100vh" bg="$background" p="$4">
      <YStack gap="$3" items="center" maxW={400}>
        {error ? (
          <>
            <Text fontSize="$4" color={'$red10' as never}>Sign-in failed</Text>
            <Text fontSize="$3" color="$placeholderColor">{error}</Text>
          </>
        ) : (
          <Text fontSize="$3" color="$placeholderColor">Completing sign-in…</Text>
        )}
      </YStack>
    </YStack>
  )
}

// ---------------------------------------------------------------------------
// Default sign-in screen
// ---------------------------------------------------------------------------

interface DefaultSignInProps {
  title: string
  onSignIn: () => void
}

function DefaultSignIn({ title, onSignIn }: DefaultSignInProps) {
  return (
    <YStack flex={1} items="center" justify="center" minH="100vh" bg="$background" p="$4">
      <YStack gap="$4" items="center" maxW={400}>
        <H2>Sign in to {title}</H2>
        <Text fontSize="$3" color="$placeholderColor">
          You'll be redirected to Hanzo IAM to authenticate.
        </Text>
        <Button size="$4" onPress={onSignIn}>
          Sign in with Hanzo
        </Button>
      </YStack>
    </YStack>
  )
}

// ---------------------------------------------------------------------------
// Test hook — clears the module store between tests
// ---------------------------------------------------------------------------

/** @internal */
export function __resetAuthForTests(): void {
  state = { token: '', user: null, ready: false }
  consumedCodes.clear()
}
