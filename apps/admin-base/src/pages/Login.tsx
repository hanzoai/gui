// Login — unguarded route. Standard OAuth2 PKCE redirect to Hanzo IAM.
//
// Click "Sign in" → IAM /oauth/authorize → IAM owns the credential UI
// (password, social, MFA, magic link, …) → redirect back to /_/callback
// → callback page calls `iam.handleCallback()` → tokens stored, app
// navigates to the originally-requested route.
//
// The IAM SDK (@hanzo/iam/browser, ≥ 0.9.4) is OIDC-only — no Casdoor
// `/v1/login` shortcut. Every credential interaction lives inside the
// IAM server.
//
// SERVER_URL resolution (in priority):
//   1. VITE_IAM_SERVER_URL — build-time inlined by Vite
//   2. Same-origin `/v1/iam` — production gateway pattern
//   3. localhost:8090 fallback for SSR-style builds where `window`
//      is missing.

import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IAM } from '@hanzo/iam/browser'
import { Button, H2, Text, YStack } from 'hanzogui'

function resolveServerUrl(): string {
  const fromEnv = import.meta.env.VITE_IAM_SERVER_URL
  if (fromEnv) {
    if (/^https?:\/\//i.test(fromEnv)) return fromEnv
    if (typeof window !== 'undefined') return `${window.location.origin}${fromEnv}`
    return fromEnv
  }
  if (typeof window !== 'undefined') return `${window.location.origin}/v1/iam`
  return 'http://localhost:8090/v1/iam'
}

const SERVER_URL = resolveServerUrl()

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    '/collections'

  const iam = useMemo(
    () =>
      new IAM({
        serverUrl: SERVER_URL,
        clientId: 'hanzo-base',
        appName: 'hanzo-base',
        orgName: 'hanzo',
        redirectUri:
          typeof window !== 'undefined'
            ? `${window.location.origin}/_/callback`
            : '/_/callback',
      }),
    [],
  )

  const onSignIn = async () => {
    // Stash where the user wanted to land — callback restores it.
    try {
      sessionStorage.setItem('hanzo_iam_post_login', from)
    } catch {
      /* ok */
    }
    await iam.signinRedirect()
    // unreachable — signinRedirect navigates away
    void navigate
  }

  return (
    <YStack flex={1} items="center" justify="center" minH="100vh" bg="$background" p="$4">
      <YStack gap="$4" items="center" maxW={400}>
        <H2>Sign in to Base</H2>
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
