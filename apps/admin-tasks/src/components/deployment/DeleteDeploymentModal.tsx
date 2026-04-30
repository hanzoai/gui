// DeleteDeploymentModal — confirm delete of a deployment series. Backend
// returns 409 if versions remain unless `force=true`. The modal exposes
// a "force" toggle so the operator must opt-in to cascade deletion.

import { useEffect, useState } from 'react'
import { Button, Card, H3, Spinner, Text, XStack, YStack } from 'hanzogui'

export interface DeleteDeploymentModalProps {
  deploymentName: string
  versionCount: number
  open: boolean
  busy?: boolean
  error?: string
  onConfirm: (force: boolean) => void
  onCancel: () => void
}

export function DeleteDeploymentModal({
  deploymentName,
  versionCount,
  open,
  busy,
  error,
  onConfirm,
  onCancel,
}: DeleteDeploymentModalProps) {
  const [force, setForce] = useState(false)

  useEffect(() => {
    if (!open) setForce(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, busy, onCancel])

  if (!open) return null

  const hasVersions = versionCount > 0

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
          Delete deployment
        </H3>
        <Text fontSize="$2" color="$color">
          Permanently delete{' '}
          <Text fontWeight="500" color="$color">
            {deploymentName}
          </Text>
          ? Versions are not deleted unless you force.
        </Text>

        {hasVersions ? (
          <Card
            bg={'rgba(252,165,165,0.08)' as never}
            borderColor={'#fca5a5' as never}
            borderWidth={1}
            p="$3"
            gap="$2"
          >
            <Text fontSize="$2" color={'#fca5a5' as never} fontWeight="500">
              {versionCount} version{versionCount === 1 ? '' : 's'} attached
            </Text>
            <Text fontSize="$1" color="$placeholderColor">
              The backend will refuse this delete with 409 unless force is enabled.
            </Text>
            <XStack
              gap="$2"
              items="center"
              hoverStyle={{ opacity: 0.8 }}
              onPress={() => (busy ? undefined : setForce((v) => !v))}
              cursor="pointer"
            >
              <Card
                width={16}
                height={16}
                borderColor="$borderColor"
                borderWidth={1}
                bg={force ? ('#fca5a5' as never) : ('transparent' as never)}
                items="center"
                justify="center"
                rounded="$1"
              >
                {force ? (
                  <Text fontSize="$1" color={'#070b13' as never} fontWeight="700">
                    ✓
                  </Text>
                ) : null}
              </Card>
              <Text fontSize="$1" color="$color">
                Force cascade delete (remove all versions)
              </Text>
            </XStack>
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
            onPress={() => onConfirm(force)}
            disabled={busy}
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
