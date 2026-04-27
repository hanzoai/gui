// RecoveryCodes — display the one-time recovery codes the backend
// generates when MFA is enabled. The user must save them; we make
// it explicit they won't be shown again.
//
// Note: there is no upstream-equivalent file because Casdoor folds
// recovery codes into MfaEnableForm. We split it out here so the
// codes have a dedicated review screen — both for first-time setup
// and for re-generation later.

import { useState } from 'react'
import { Card, Paragraph, Text, XStack, YStack } from 'hanzogui'

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
    <YStack gap="$3" width="100%" maxWidth={420}>
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

      <XStack items="center" gap="$2">
        <Text
          tag="button"
          {...({ type: 'button', onClick: onCopy } as never)}
          px="$3"
          py="$2"
          rounded="$2"
          bg={'rgba(255,255,255,0.06)' as never}
          cursor="pointer"
        >
          {copied ? 'Copied' : 'Copy all'}
        </Text>
      </XStack>

      <XStack items="center" gap="$2">
        <Text
          tag="input"
          {...({
            type: 'checkbox',
            checked: acknowledged,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAcknowledged(e.target.checked),
            name: 'acknowledgeRecovery',
          } as never)}
        />
        <Text fontSize="$2">I have saved these codes somewhere safe.</Text>
      </XStack>

      <Text
        tag="button"
        {...({ type: 'button', disabled: !acknowledged, onClick: acknowledged ? onConfirm : undefined } as never)}
        px="$4"
        py="$3"
        rounded="$3"
        bg={acknowledged ? ('#3b82f6' as never) : ('rgba(59,130,246,0.4)' as never)}
        color="#ffffff"
        text="center"
        cursor={acknowledged ? 'pointer' : 'not-allowed'}
      >
        Continue
      </Text>
    </YStack>
  )
}
