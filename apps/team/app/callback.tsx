import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'one'
import { SizableText, YStack } from 'hanzogui'
import { Mark } from '~/components/Mark'
import { completeWebCallback } from '~/src/auth'
import { persistSession } from '~/src/session'

// Web-only: hanzo.id redirects here with ?code&state. Complete the PKCE exchange,
// persist the session, then hard-navigate home so the session provider re-reads it.
// (Native completes the flow in-process via expo-web-browser; this route is unused there.)
export default function Callback() {
  const params = useLocalSearchParams<{ code?: string; state?: string; error?: string }>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    void (async () => {
      try {
        const session = await completeWebCallback({
          code: params.code,
          state: params.state,
          error: params.error,
        })
        await persistSession(session)
        globalThis.location?.assign('/')
      } catch (e) {
        if (live) setError(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => {
      live = false
    }
  }, [params.code, params.state, params.error])

  return (
    <YStack flex={1} items="center" justify="center" p="$4" gap="$4">
      <Mark size={44} />
      {error == null ? (
        <>
          <ActivityIndicator />
          <SizableText size="$3" color="$color10">
            Completing sign-in…
          </SizableText>
        </>
      ) : (
        <YStack items="center" gap="$2">
          <SizableText size="$4" fontWeight="600">
            Sign-in failed
          </SizableText>
          <SizableText size="$2" color="$color10">
            {error}
          </SizableText>
        </YStack>
      )}
    </YStack>
  )
}
