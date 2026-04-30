// DeleteVersionModal — confirm delete of a single deployment version
// (build id). Refuses outright if the version is currently routed
// traffic; the operator must set another version current first.

import { useEffect } from 'react'
import { Button, Card, H3, Spinner, Text, XStack, YStack } from 'hanzogui'

export interface DeleteVersionModalProps {
  deploymentName: string
  buildId: string
  isCurrent: boolean
  open: boolean
  busy?: boolean
  error?: string
  onConfirm: () => void
  onCancel: () => void
}

const MONO = 'ui-monospace, SFMono-Regular, monospace'

export function DeleteVersionModal({
  deploymentName,
  buildId,
  isCurrent,
  open,
  busy,
  error,
  onConfirm,
  onCancel,
}: DeleteVersionModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, busy, onCancel])

  if (!open) return null

  return (
    <YStack
      position="absolute"
      t={0}
      l={0}
      r={0}
      b={0}
      bg={'rgba(0,0,0,0.55)' as never}
      items="center"
      justify="center"
      z={1000}
      style={{ position: 'fixed' as never }}
      onPress={() => (busy ? undefined : onCancel())}
    >
      <Card
        width={520}
        maxWidth={'90vw' as never}
        p="$5"
        gap="$4"
        bg="$background"
        borderColor="$borderColor"
        borderWidth={1}
        onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()}
      >
        <H3 size="$5" color="$color" fontWeight="500">
          Delete version
        </H3>
        <Text fontSize="$2" color="$color">
          Permanently delete build{' '}
          <Text fontFamily={MONO as never} color="$color" fontWeight="500">
            {buildId}
          </Text>{' '}
          from{' '}
          <Text fontWeight="500" color="$color">
            {deploymentName}
          </Text>
          ?
        </Text>

        {isCurrent ? (
          <Card
            bg={'rgba(252,165,165,0.08)' as never}
            borderColor={'#fca5a5' as never}
            borderWidth={1}
            p="$3"
            gap="$1"
          >
            <Text fontSize="$2" color={'#fca5a5' as never} fontWeight="500">
              Cannot delete the current version
            </Text>
            <Text fontSize="$1" color="$placeholderColor">
              Set another version current first, then come back to delete this one.
            </Text>
          </Card>
        ) : null}

        {error ? (
          <Text fontSize="$1" color={'#fca5a5' as never}>
            {error}
          </Text>
        ) : null}

        <XStack gap="$2" justify="flex-end">
          <Button size="$2" chromeless onPress={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button
            size="$2"
            onPress={onConfirm}
            disabled={busy || isCurrent}
            bg={'#fca5a5' as never}
          >
            {busy ? (
              <Spinner size="small" />
            ) : (
              <Text fontSize="$2" color={'#070b13' as never} fontWeight="500">
                Delete
              </Text>
            )}
          </Button>
        </XStack>
      </Card>
    </YStack>
  )
}
