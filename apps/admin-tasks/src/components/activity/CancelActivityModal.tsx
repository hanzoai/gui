// Cancel a standalone activity. Mirrors the workflow CancelModal
// surface: optional reason, single-shot submit, ApiError-aware copy
// for the 501 path while the engine wires this RPC.

import { useState } from 'react'
import { Button, Input, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ApiError, Activities } from '../../lib/api'
import { ActionDialog } from '../workflow-actions/ActionDialog'

export interface CancelActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  namespace: string
  activityId: string
  runId: string
  onSuccess?: () => void
}

export function CancelActivityModal({
  open,
  onOpenChange,
  namespace,
  activityId,
  runId,
  onSuccess,
}: CancelActivityModalProps) {
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function close() {
    if (busy) return
    setReason('')
    setErr(null)
    onOpenChange(false)
  }

  async function submit() {
    setBusy(true)
    setErr(null)
    try {
      await Activities.cancel(namespace, activityId, runId, reason.trim() || undefined)
      onSuccess?.()
      onOpenChange(false)
    } catch (e) {
      if (e instanceof ApiError && e.status === 501) {
        setErr('Cancel is not yet implemented in the native server (501).')
      } else {
        setErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <ActionDialog
      title="Cancel activity"
      open={open}
      busy={busy}
      error={err}
      onClose={close}
      footer={
        <XStack gap="$2" justify="flex-end">
          <Button size="$2" chromeless onPress={close} disabled={busy}>
            Keep running
          </Button>
          <Button size="$2" onPress={submit} disabled={busy}>
            {busy ? <Spinner size="small" /> : <Text fontSize="$2">Cancel activity</Text>}
          </Button>
        </XStack>
      }
    >
      <YStack gap="$3">
        <Text fontSize="$2" color="$color">
          Cancel{' '}
          <Text fontWeight="500" color="$color">
            {activityId}
          </Text>
          . The worker observes the request on its next heartbeat and closes
          out as Canceled.
        </Text>
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Reason (optional)
          </Text>
          <Input
            size="$3"
            value={reason}
            onChangeText={setReason}
            placeholder="why this activity is being cancelled"
            disabled={busy}
          />
        </YStack>
      </YStack>
    </ActionDialog>
  )
}
