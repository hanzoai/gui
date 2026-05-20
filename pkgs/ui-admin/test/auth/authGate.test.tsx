// AuthGate — boundary behaviour: bootstrap hydrates from the IAM
// store, no token → redirect to /login, /callback → exchange code →
// store token. The IAM SDK is stubbed (it's the auth boundary; we
// only verify the gate wires through it).
//
// Navigation is dependency-injected via the `navigate` prop, so tests
// don't need to monkey-patch window.location.replace (jsdom marks it
// non-configurable on certain Node versions).

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { HanzoguiProvider } from 'hanzogui'
import config from '../../gui.config'
import {
  AuthGate,
  CallbackHandler,
  __resetAuthForTests,
  useAuth,
} from '../../src/auth/AuthGate'

// Minimal stub that satisfies the IAM type the gate relies on.
function stubIAM(opts: {
  initialToken?: string
  user?: Record<string, unknown> | null
  callbackTokens?: { accessToken: string }
}) {
  return {
    signinRedirect: vi.fn(async () => undefined),
    getAccessToken: () => opts.initialToken ?? '',
    getUserInfo: vi.fn(async () => (opts.user ?? null) as unknown),
    handleCallback: vi.fn(async () => opts.callbackTokens ?? { accessToken: 'TOK' }),
    clear: vi.fn(),
    logout: vi.fn(),
  } as unknown as Parameters<typeof AuthGate>[0]['iam']
}

function withGui(ui: React.ReactNode) {
  return (
    <HanzoguiProvider config={config} defaultTheme="dark">
      {ui}
    </HanzoguiProvider>
  )
}

function setLocation(path: string) {
  window.history.replaceState({}, '', path)
}

function ChildProbe() {
  const { token, user } = useAuth()
  return <div data-testid="probe">{token}|{user?.email ?? ''}</div>
}

describe('AuthGate', () => {
  beforeEach(() => {
    __resetAuthForTests()
    sessionStorage.clear()
    setLocation('/')
  })

  it('redirects to /login when there is no token', async () => {
    setLocation('/dashboard')
    const navigate = vi.fn()
    const iam = stubIAM({ initialToken: '' })
    render(
      withGui(<AuthGate iam={iam} navigate={navigate}><ChildProbe /></AuthGate>)
    )
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/login'))
    expect(sessionStorage.getItem('hanzo_iam_post_login')).toBe('/dashboard')
  })

  it('renders children when IAM has a token', async () => {
    const iam = stubIAM({ initialToken: 'EXISTING', user: { email: 'z@hanzo.ai' } })
    const { findByTestId } = render(
      withGui(<AuthGate iam={iam}><ChildProbe /></AuthGate>)
    )
    const probe = await findByTestId('probe')
    expect(probe.textContent).toBe('EXISTING|z@hanzo.ai')
  })

  it('renders the default sign-in screen at /login', async () => {
    setLocation('/login')
    const iam = stubIAM({ initialToken: '' })
    const { findByText } = render(
      withGui(<AuthGate iam={iam} appTitle="Auto"><ChildProbe /></AuthGate>)
    )
    expect(await findByText(/Sign in to Auto/)).toBeTruthy()
  })

  it('renderSignIn override is honored', async () => {
    setLocation('/login')
    const iam = stubIAM({ initialToken: '' })
    const { findByText } = render(
      withGui(
        <AuthGate
          iam={iam}
          renderSignIn={({ title }) => <div>Custom sign-in for {title}</div>}
        >
          <ChildProbe />
        </AuthGate>
      )
    )
    expect(await findByText(/Custom sign-in for Admin/)).toBeTruthy()
  })
})

describe('CallbackHandler', () => {
  beforeEach(() => {
    __resetAuthForTests()
    sessionStorage.clear()
  })

  it('exchanges code, persists token, and redirects to stashed path', async () => {
    sessionStorage.setItem('hanzo_iam_post_login', '/workflows')
    setLocation('/callback?code=ABC&state=XYZ')
    const navigate = vi.fn()
    const iam = stubIAM({
      callbackTokens: { accessToken: 'NEW_TOK' },
      user: { email: 'z@hanzo.ai' },
    })
    render(
      withGui(<CallbackHandler iam={iam} navigate={navigate} defaultLandingPath="/" />)
    )
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/workflows'))
    expect(sessionStorage.getItem('hanzo_iam_post_login')).toBeNull()
  })

  it('falls back to defaultLandingPath when no stash is present', async () => {
    setLocation('/callback?code=DEF')
    const navigate = vi.fn()
    const iam = stubIAM({ callbackTokens: { accessToken: 'T' } })
    render(
      withGui(<CallbackHandler iam={iam} navigate={navigate} defaultLandingPath="/home" />)
    )
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/home'))
  })
})
