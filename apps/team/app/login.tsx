import { Linking } from 'react-native'
import { Button, SizableText, YStack } from 'hanzogui'
import { Mark } from '~/components/Mark'

// OIDC code flow against hanzo.id — launched in the system browser, the session
// returns via the app deep link. No in-app credential entry, no fake auth.
const authorize =
  'https://hanzo.id/oidc/authorize' +
  '?client_id=hanzo-team' +
  '&response_type=code' +
  '&scope=openid+profile+email' +
  '&redirect_uri=hanzo-team://callback'

export default function Login() {
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
        pressStyle={{ opacity: 0.8, bg: '$color' }}
        onPress={() => Linking.openURL(authorize)}
      >
        <Button.Text color="$background" fontWeight="600">
          Continue with hanzo.id
        </Button.Text>
      </Button>

      <SizableText size="$1" color="$color10">
        Opens your browser · returns via hanzo-team://callback
      </SizableText>
    </YStack>
  )
}
