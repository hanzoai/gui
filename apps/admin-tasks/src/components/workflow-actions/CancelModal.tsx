// Request cancel of a running workflow. The engine still treats it as
// Running until the worker observes the cancel and emits the close
// event — UI surfaces "Cancel pending" via the workflow detail header,
// not via a synthetic state change.

import { useState } from 'react'
import { Button, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ApiError, Workflows } from '../../lib/api'
import { eventBus } from '../../stores/event-bus'
import { ActionDialog } from './ActionDialog'

export interface CancelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  namespace: string
  workflowId: string
  runId?: string
  onSuccess?: () => void
}

export function CancelModal({
  open,
  onOpenChange,
  namespace,
  workflowId,
  runId,
  onSuccess,
}: CancelModalProps) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function close() {
    if (busy) return
    setErr(null)
    onOpenChange(false)
  }

  async function submit() {
    setBusy(true)
    setErr(null)
    try {
      await Workflows.cancel(namespace, workflowId, runId)
      eventBus.emit({
        kind: 'workflow-action-completed',
        namespace,
        workflowId,
        runId,
        action: 'cancel',
      })
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
      title="Request cancel"
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
            {busy ? <Spinner size="small" /> : <Text fontSize="$2">Request cancel</Text>}
          </Button>
        </XStack>
      }
    >
      <YStack gap="$2">
        <Text fontSize="$2" color="$color">
          Send a cancellation request to{' '}
          <Text fontWeight="500" color="$color">
            {workflowId}
          </Text>
          .
        </Text>
        <Text fontSize="$1" color="$placeholderColor">
          The workflow remains Running until the worker observes the request and
          closes cleanly. Use Terminate for an immediate stop.
        </Text>
      </YStack>
    </ActionDialog>
  )
}
