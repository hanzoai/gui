// Terminate a workflow. Hard stop — no worker callback. Reason is
// recorded on the close event so audits can answer "who killed this".

import { useState } from 'react'
import { Button, Input, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ApiError, Workflows } from '../../lib/api'
import { eventBus } from '../../stores/event-bus'
import { ActionDialog } from './ActionDialog'

export interface TerminateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  namespace: string
  workflowId: string
  runId?: string
  onSuccess?: () => void
}

export function TerminateModal({
  open,
  onOpenChange,
  namespace,
  workflowId,
  runId,
  onSuccess,
}: TerminateModalProps) {
  const [reason, setReason] = useState('Terminated from UI')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function close() {
    if (busy) return
    setReason('Terminated from UI')
    setErr(null)
    onOpenChange(false)
  }

  async function submit() {
    setBusy(true)
    setErr(null)
    try {
      await Workflows.terminate(namespace, workflowId, runId, reason)
      eventBus.emit({
        kind: 'workflow-action-completed',
        namespace,
        workflowId,
        runId,
        action: 'terminate',
      })
      onSuccess?.()
      onOpenChange(false)
    } catch (e) {
      if (e instanceof ApiError && e.status === 501) {
        setErr('Terminate is not yet implemented in the native server (501).')
      } else {
        setErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <ActionDialog
      title="Terminate workflow"
      open={open}
      busy={busy}
      error={err}
      onClose={close}
      footer={
        <XStack gap="$2" justify="flex-end">
          <Button size="$2" chromeless onPress={close} disabled={busy}>
            Cancel
          </Button>
          <Button
            size="$2"
            onPress={submit}
            disabled={busy}
            borderWidth={1}
            borderColor={'#fca5a5' as never}
          >
            {busy ? (
              <Spinner size="small" />
            ) : (
              <Text fontSize="$2" color={'#fca5a5' as never}>
                Terminate
              </Text>
            )}
          </Button>
        </XStack>
      }
    >
      <YStack gap="$3">
        <Text fontSize="$2" color="$color">
          Hard-stop{' '}
          <Text fontWeight="500" color="$color">
            {workflowId}
          </Text>
          . The workflow closes immediately with status Terminated.
        </Text>
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Reason (recorded on the close event)
          </Text>
          <Input
            size="$3"
            value={reason}
            onChangeText={setReason}
            placeholder="Terminated from UI"
            disabled={busy}
          />
        </YStack>
      </YStack>
    </ActionDialog>
  )
}
