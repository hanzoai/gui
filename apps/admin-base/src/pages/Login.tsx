// Login — unguarded route. Delegates the entire credential flow to
// `<Login iam={iam}/>` from `@hanzogui/admin/auth`. The IAM class
// owns OIDC/PKCE, token storage, and refresh; this page only wires
// the post-login navigation.
//
// Base local dev points at the embedded IAM endpoint (`/api/iam`).
// In production the gateway prefix is `/v1/iam` (same-origin), so
// the same hostname-relative URL works wherever Base is deployed.

import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IAM } from '@hanzo/iam/browser'
import { YStack } from 'hanzogui'
import { Login as IamLogin } from '@hanzogui/admin/auth'
import type { AuthApplication } from '@hanzogui/admin/auth'

const SERVER_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8090/api/iam'
    : '/v1/iam'

const APPLICATION: AuthApplication = {
  owner: 'admin',
  name: 'hanzo-base',
  organization: 'hanzo',
  displayName: 'Sign in to Base',
  enablePassword: true,
  enableSignUp: false,
  enableCodeSignin: false,
}

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

  return (
    <YStack flex={1} items="center" justify="center" minH="100vh" bg="$background" p="$4">
      <IamLogin
        iam={iam}
        application={APPLICATION}
        onSuccess={() => navigate(from, { replace: true })}
      />
    </YStack>
  )
}
