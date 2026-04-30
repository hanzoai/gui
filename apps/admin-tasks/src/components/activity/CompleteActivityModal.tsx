// Operator-side "complete" path for a stuck activity. Worker SDK is
// the natural producer of success — this surface exists for recovery
// when the worker is gone (drained, crashed) and a human knows the
// activity has actually finished. Result is a JSON payload encoded
// the same way as workflow signal payloads.

import { useState } from 'react'
import { Button, Spinner, Text, TextArea, XStack, YStack } from 'hanzogui'
import { ApiError, Activities } from '../../lib/api'
import { ActionDialog, encodeJsonPayload } from '../workflow-actions/ActionDialog'

export interface CompleteActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  namespace: string
  activityId: string
  runId: string
  onSuccess?: () => void
}

export function CompleteActivityModal({
  open,
  onOpenChange,
  namespace,
  activityId,
  runId,
  onSuccess,
}: CompleteActivityModalProps) {
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function close() {
    if (busy) return
    setResult('')
    setErr(null)
    onOpenChange(false)
  }

  async function submit() {
    setErr(null)
    let parsed: unknown
    if (result.trim()) {
      try {
        parsed = JSON.parse(result)
      } catch (e) {
        setErr(`Result must be valid JSON: ${e instanceof Error ? e.message : String(e)}`)
        return
      }
    }
    setBusy(true)
    try {
      const encoded = encodeJsonPayload(parsed)
      await Activities.complete(namespace, activityId, runId, encoded ?? undefined)
      onSuccess?.()
      onOpenChange(false)
    } catch (e) {
      if (e instanceof ApiError && e.status === 501) {
        setErr('Complete is not yet implemented in the native server (501).')
      } else {
        setErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <ActionDialog
      title="Complete activity"
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
            {busy ? <Spinner size="small" /> : <Text fontSize="$2">Mark completed</Text>}
          </Button>
        </XStack>
      }
    >
      <YStack gap="$3">
        <Text fontSize="$2" color="$color">
          Marks{' '}
          <Text fontWeight="500" color="$color">
            {activityId}
          </Text>{' '}
          as Completed. Use this when the worker is gone but the activity
          truly finished — it short-circuits the retry loop.
        </Text>
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Result (JSON, optional)
          </Text>
          <TextArea
            size="$3"
            minH={100}
            value={result}
            onChangeText={setResult}
            placeholder={'{"ok": true}'}
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            disabled={busy}
          />
        </YStack>
      </YStack>
    </ActionDialog>
  )
}
