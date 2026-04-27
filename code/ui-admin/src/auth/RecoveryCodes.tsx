// RecoveryCodes — display the one-time recovery codes the backend
// generates when MFA is enabled. The user must save them; we make
// it explicit they won't be shown again.
//
// Note: there is no upstream-equivalent file because Casdoor folds
// recovery codes into MfaEnableForm. We split it out here so the
// codes have a dedicated review screen — both for first-time setup
// and for re-generation later.

import { useState } from 'react'
import { Button, Card, Paragraph, Switch, Text, XStack, YStack } from 'hanzogui'

export interface RecoveryCodesProps {
  codes: string[]
  // Caller proceeds (closes the dialog, navigates away, etc.) after
  // confirmation.
  onConfirm: () => void
}

export function RecoveryCodes({ codes, onConfirm }: RecoveryCodesProps) {
  const [copied, setCopied] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // Clipboard denied — user can still hand-copy from the list.
    }
  }

  return (
    <YStack gap="$3" width="100%" maxW={420}>
      <Text fontSize="$8" fontWeight="700">
        Save your recovery codes
      </Text>
      <Paragraph color="$placeholderColor" fontSize="$2">
        Each code can be used once if you lose access to your authenticator. We will not show
        them again.
      </Paragraph>
      <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$1">
          {codes.map((c) => (
            <Text key={c} fontFamily={'ui-monospace, monospace' as never} fontSize="$3">
              {c}
            </Text>
          ))}
        </YStack>
      </Card>

      <Button size="$2" chromeless onPress={() => void onCopy()}>
        {copied ? 'Copied' : 'Copy all'}
      </Button>

      <XStack items="center" gap="$2">
        <Switch
          checked={acknowledged}
          onCheckedChange={(v) => setAcknowledged(Boolean(v))}
          size="$2"
        >
          <Switch.Thumb />
        </Switch>
        <Text fontSize="$2">I have saved these codes somewhere safe.</Text>
      </XStack>

      <Button
        size="$4"
        theme="blue"
        disabled={!acknowledged}
        onPress={onConfirm}
      >
        Continue
      </Button>
    </YStack>
  )
}
