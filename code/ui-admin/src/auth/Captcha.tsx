// Captcha — pluggable captcha host. We don't bundle reCAPTCHA,
// Turnstile, or hCaptcha SDKs here; consumers pass a renderer that
// returns a captcha token. This is the secure default — IAM never
// trusts captcha data assembled in this component, the backend
// re-verifies the token against the provider's verify endpoint.
//
// Two modes:
//   - `Default`: backend renders an image; the user types the text.
//     Token = the typed text. Backend validates against its own
//     ephemeral session-bound state.
//   - reCAPTCHA / Turnstile / hCaptcha: caller passes a `Widget`
//     prop that mounts the third-party iframe. The widget invokes
//     `onToken(token)` once the user solves the challenge.
//
// Original at `~/work/hanzo/iam/web/src/CaptchaPage.tsx`.

import type { ComponentType } from 'react'
import { useState } from 'react'
import { Button, Card, Image, Input, Label, Paragraph, XStack, YStack } from 'hanzogui'
import type { CaptchaConfig } from './types'

export interface CaptchaProps {
  config: CaptchaConfig
  Widget?: ComponentType<{
    siteKey: string
    onToken: (token: string) => void
    onError?: (msg: string) => void
  }>
  onToken: (token: string, providerType: CaptchaConfig['type']) => void
  onRefreshImage?: () => void
}

export function Captcha({ config, Widget, onToken, onRefreshImage }: CaptchaProps) {
  const [text, setText] = useState('')

  if (config.type === 'none') return null

  if (config.type === 'Default') {
    return (
      <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$2">
          <Label htmlFor="captcha-input">Verify you're human</Label>
          <XStack items="center" gap="$2">
            {config.imageUrl ? (
              <Image
                source={{ uri: config.imageUrl, width: 120, height: 40 }}
                width={120}
                height={40}
                onPress={onRefreshImage}
              />
            ) : (
              <Paragraph color="$placeholderColor">Loading…</Paragraph>
            )}
            <Input
              id="captcha-input"
              flex={1}
              value={text}
              onChangeText={setText}
              placeholder="Code"
              autoCapitalize="none"
            />
            <Button
              size="$2"
              onPress={() => text && onToken(text, 'Default')}
              disabled={!text}
            >
              OK
            </Button>
          </XStack>
        </YStack>
      </Card>
    )
  }

  if (!Widget) {
    return (
      <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <Paragraph color="#fca5a5">
          Captcha provider {config.type} is enabled but no widget is configured.
        </Paragraph>
      </Card>
    )
  }

  return (
    <YStack gap="$2">
      <Widget
        siteKey={config.siteKey || ''}
        onToken={(t) => onToken(t, config.type)}
      />
    </YStack>
  )
}
