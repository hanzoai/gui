// SetCurrentDialog — confirm flipping the active build for a deployment.
// Lightweight inline overlay (no Dialog primitive in @hanzogui/admin yet).
// Shows current → proposed diff and any task queues impacted by the swap.

import { useEffect } from 'react'
import { Button, Card, H3, Spinner, Text, XStack, YStack } from 'hanzogui'

export interface SetCurrentDialogProps {
  deploymentName: string
  currentBuildId?: string
  proposedBuildId: string
  impactedTaskQueues?: string[]
  open: boolean
  busy?: boolean
  error?: string
  onConfirm: () => void
  onCancel: () => void
}

export function SetCurrentDialog({
  deploymentName,
  currentBuildId,
  proposedBuildId,
  impactedTaskQueues = [],
  open,
  busy,
  error,
  onConfirm,
  onCancel,
}: SetCurrentDialogProps) {
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
          Set as current
        </H3>
        <Text fontSize="$2" color="$color">
          Route all traffic for{' '}
          <Text fontWeight="500" color="$color">
            {deploymentName}
          </Text>{' '}
          to build{' '}
          <Text
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontWeight="500"
            color="$color"
          >
            {proposedBuildId}
          </Text>
          .
        </Text>

        {currentBuildId ? (
          <Card
            bg={'rgba(255,255,255,0.03)' as never}
            borderColor="$borderColor"
            borderWidth={1}
            p="$3"
          >
            <XStack items="center" justify="space-between" gap="$3">
              <Text fontSize="$1" color="$placeholderColor">
                build id
              </Text>
              <XStack items="center" gap="$2">
                <Text
                  fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                  fontSize="$1"
                  color="$placeholderColor"
                  numberOfLines={1}
                >
                  {currentBuildId}
                </Text>
                <Text fontSize="$1" color="$placeholderColor">
                  →
                </Text>
                <Text
                  fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                  fontSize="$1"
                  color="$color"
                  numberOfLines={1}
                >
                  {proposedBuildId}
                </Text>
              </XStack>
            </XStack>
          </Card>
        ) : null}

        {impactedTaskQueues.length > 0 ? (
          <YStack gap="$1">
            <Text fontSize="$1" color="$placeholderColor" fontWeight="500">
              Impacted task queues ({impactedTaskQueues.length})
            </Text>
            <YStack gap="$1">
              {impactedTaskQueues.slice(0, 6).map((q) => (
                <Text key={q} fontSize="$1" color="$color" numberOfLines={1}>
                  {q}
                </Text>
              ))}
              {impactedTaskQueues.length > 6 ? (
                <Text fontSize="$1" color="$placeholderColor">
                  +{impactedTaskQueues.length - 6} more
                </Text>
              ) : null}
            </YStack>
          </YStack>
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
          <Button size="$2" onPress={onConfirm} disabled={busy}>
            {busy ? <Spinner size="small" /> : <Text fontSize="$2">Set current</Text>}
          </Button>
        </XStack>
      </Card>
    </YStack>
  )
}
