// OAuth2 PKCE callback handler — receives `code` + `state`, calls
// `iam.handleCallback()` to exchange the code for tokens, persists the
// access token to the local auth store, then navigates the user to
// wherever they originally tried to go (stashed in sessionStorage
// by Login.tsx).

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IAM } from '@hanzo/iam/browser'
import { Text, YStack } from 'hanzogui'
import { setAuth } from '../lib/api'

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

export function Callback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const iam = new IAM({
      serverUrl: resolveServerUrl(),
      clientId: 'hanzo-base',
      appName: 'hanzo-base',
      orgName: 'hanzo',
      redirectUri: `${window.location.origin}/_/callback`,
    })

    iam
      .handleCallback()
      .then(async (tokens) => {
        const user = await iam.getUser()
        setAuth(tokens.accessToken, (user ?? {}) as Record<string, unknown>)
        let to = '/collections'
        try {
          to = sessionStorage.getItem('hanzo_iam_post_login') ?? '/collections'
          sessionStorage.removeItem('hanzo_iam_post_login')
        } catch {
          /* ok */
        }
        navigate(to, { replace: true })
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : String(e))
      })
  }, [navigate])

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
