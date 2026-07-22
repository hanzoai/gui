import { Redirect } from 'one'
import { Button, SizableText, YStack } from 'hanzogui'
import { Mark } from '~/components/Mark'
import { useSession } from '~/src/session'

// Real hanzo.id OIDC (Authorization Code + PKCE) via the system browser (native) or a
// full-page redirect (web); the session returns through the app deep link / callback
// route. No in-app credential entry, no fake auth. See ~/src/auth.ts.
export default function Login() {
  const { session, loading, signingIn, signIn } = useSession()

  if (!loading && session != null) return <Redirect href="/" />

  return (
    <YStack flex={1} items="center" justify="center" p="$4" gap="$4">
      <Mark size={44} />

      <YStack items="center" gap="$1">
        <SizableText size="$6" fontWeight="600">
          Sign in to Hanzo
        </SizableText>
        <SizableText size="$2" color="$color10">
          One account for every surface
        </SizableText>
      </YStack>

      <Button
        size="$4"
        bg="$color"
        borderWidth={0}
        disabled={signingIn}
        opacity={signingIn ? 0.6 : 1}
        pressStyle={{ opacity: 0.8, bg: '$color' }}
        onPress={() => void signIn()}
      >
        <Button.Text color="$background" fontWeight="600">
          {signingIn ? 'Opening…' : 'Continue with hanzo.id'}
        </Button.Text>
      </Button>

      <SizableText size="$1" color="$color10">
        Opens hanzo.id · returns via hanzo-team://callback
      </SizableText>
    </YStack>
  )
}
