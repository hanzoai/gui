// Start a brand-new workflow. Minimum fields: workflowId, workflowType,
// taskQueue. Optional input is encoded as Payload{encoding:'json/plain'}
// matching what the worker SDK decodes on the other side.

import { useState } from 'react'
import { Button, Input, Spinner, Text, TextArea, XStack, YStack } from 'hanzogui'
import { ApiError, Workflows } from '../../lib/api'
import { eventBus } from '../../stores/event-bus'
import { ActionDialog, encodeJsonPayload } from './ActionDialog'

export interface StartWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  namespace: string
  // Pre-fill helpers — useful for retrying a terminated workflow.
  defaultWorkflowType?: string
  defaultTaskQueue?: string
  defaultWorkflowId?: string
  // workflowId/runId unused here but kept on the prop shape for the
  // shared FEATURE-1 hook signature.
  workflowId?: string
  runId?: string
  onSuccess?: (workflowId: string, runId?: string) => void
}

export function StartWorkflowDialog({
  open,
  onOpenChange,
  namespace,
  defaultWorkflowType,
  defaultTaskQueue,
  defaultWorkflowId,
  onSuccess,
}: StartWorkflowDialogProps) {
  const [workflowId, setWorkflowId] = useState(defaultWorkflowId ?? '')
  const [workflowType, setWorkflowType] = useState(defaultWorkflowType ?? '')
  const [taskQueue, setTaskQueue] = useState(defaultTaskQueue ?? '')
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function close() {
    if (busy) return
    setErr(null)
    onOpenChange(false)
  }

  async function submit() {
    setErr(null)
    if (!workflowId.trim()) return setErr('Workflow ID is required.')
    if (!workflowType.trim()) return setErr('Workflow type is required.')
    if (!taskQueue.trim()) return setErr('Task queue is required.')
    let parsedInput: unknown
    if (input.trim()) {
      try {
        parsedInput = JSON.parse(input)
      } catch (e) {
        return setErr(`Input must be valid JSON: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    setBusy(true)
    try {
      const encoded = encodeJsonPayload(parsedInput)
      const resp = await Workflows.start(namespace, {
        workflowId: workflowId.trim(),
        workflowType: { name: workflowType.trim() },
        taskQueue: { name: taskQueue.trim() },
        input: encoded ?? undefined,
      })
      eventBus.emit({
        kind: 'workflow-action-completed',
        namespace,
        workflowId: workflowId.trim(),
        runId: resp?.execution?.runId,
        action: 'start',
      })
      onSuccess?.(workflowId.trim(), resp?.execution?.runId)
      onOpenChange(false)
    } catch (e) {
      if (e instanceof ApiError && e.status === 501) {
        setErr('Start is not yet implemented in the native server (501).')
      } else {
        setErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <ActionDialog
      title="Start workflow"
      open={open}
      busy={busy}
      error={err}
      onClose={close}
      width={560}
      footer={
        <XStack gap="$2" justify="flex-end">
          <Button size="$2" chromeless onPress={close} disabled={busy}>
            Cancel
          </Button>
          <Button size="$2" onPress={submit} disabled={busy}>
            {busy ? <Spinner size="small" /> : <Text fontSize="$2">Start workflow</Text>}
          </Button>
        </XStack>
      }
    >
      <YStack gap="$3">
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Workflow ID
          </Text>
          <Input
            size="$3"
            value={workflowId}
            onChangeText={setWorkflowId}
            placeholder="order-12345"
            disabled={busy}
          />
        </YStack>
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Workflow type
          </Text>
          <Input
            size="$3"
            value={workflowType}
            onChangeText={setWorkflowType}
            placeholder="ProcessOrder"
            disabled={busy}
          />
        </YStack>
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Task queue
          </Text>
          <Input
            size="$3"
            value={taskQueue}
            onChangeText={setTaskQueue}
            placeholder="orders"
            disabled={busy}
          />
        </YStack>
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Input (JSON, optional)
          </Text>
          <TextArea
            size="$3"
            minH={100}
            value={input}
            onChangeText={setInput}
            placeholder={'{"orderId": 42}'}
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            disabled={busy}
          />
        </YStack>
      </YStack>
    </ActionDialog>
  )
}
