// Signal a running workflow. Name + optional JSON payload. Payload is
// encoded as Payload{encoding:'json/plain', data: base64(utf-8(json))}
// before being sent to the server.

import { useState } from 'react'
import { Button, Input, Spinner, Text, TextArea, XStack, YStack } from 'hanzogui'
import { ApiError, Workflows } from '../../lib/api'
import { eventBus } from '../../stores/event-bus'
import { ActionDialog, encodeJsonPayload } from './ActionDialog'

export interface SignalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  namespace: string
  workflowId: string
  runId?: string
  onSuccess?: () => void
}

export function SignalModal({
  open,
  onOpenChange,
  namespace,
  workflowId,
  runId,
  onSuccess,
}: SignalModalProps) {
  const [name, setName] = useState('')
  const [payload, setPayload] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function close() {
    if (busy) return
    setName('')
    setPayload('')
    setErr(null)
    onOpenChange(false)
  }

  async function submit() {
    setErr(null)
    if (!name.trim()) {
      setErr('Signal name is required.')
      return
    }
    let parsed: unknown
    if (payload.trim()) {
      try {
        parsed = JSON.parse(payload)
      } catch (e) {
        setErr(`Payload must be valid JSON: ${e instanceof Error ? e.message : String(e)}`)
        return
      }
    }
    setBusy(true)
    try {
      const encoded = encodeJsonPayload(parsed)
      await Workflows.signal(namespace, workflowId, runId, name.trim(), encoded ?? undefined)
      eventBus.emit({
        kind: 'workflow-action-completed',
        namespace,
        workflowId,
        runId,
        action: 'signal',
      })
      onSuccess?.()
      onOpenChange(false)
    } catch (e) {
      if (e instanceof ApiError && e.status === 501) {
        setErr('Signal is not yet implemented in the native server (501).')
      } else {
        setErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <ActionDialog
      title="Signal workflow"
      open={open}
      busy={busy}
      error={err}
      onClose={close}
      footer={
        <XStack gap="$2" justify="flex-end">
          <Button size="$2" chromeless onPress={close} disabled={busy}>
            Cancel
          </Button>
          <Button size="$2" onPress={submit} disabled={busy}>
            {busy ? <Spinner size="small" /> : <Text fontSize="$2">Send signal</Text>}
          </Button>
        </XStack>
      }
    >
      <YStack gap="$3">
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Signal name
          </Text>
          <Input
            size="$3"
            value={name}
            onChangeText={setName}
            placeholder="orderUpdate"
            disabled={busy}
          />
        </YStack>
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Payload (JSON, optional)
          </Text>
          <TextArea
            size="$3"
            minH={100}
            value={payload}
            onChangeText={setPayload}
            placeholder={'{"id": 42}'}
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            disabled={busy}
          />
        </YStack>
      </YStack>
    </ActionDialog>
  )
}
