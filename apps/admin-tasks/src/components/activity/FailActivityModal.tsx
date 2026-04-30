// Operator-side "fail" — the inverse of complete. Records a failure
// with cause + optional stack trace so the activity transitions to
// Failed (and the parent workflow's awaiter, if any, observes the
// failure) instead of waiting out the timeout.

import { useState } from 'react'
import { Button, Input, Spinner, Text, TextArea, XStack, YStack } from 'hanzogui'
import { ApiError, Activities } from '../../lib/api'
import { ActionDialog } from '../workflow-actions/ActionDialog'

export interface FailActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  namespace: string
  activityId: string
  runId: string
  onSuccess?: () => void
}

export function FailActivityModal({
  open,
  onOpenChange,
  namespace,
  activityId,
  runId,
  onSuccess,
}: FailActivityModalProps) {
  const [message, setMessage] = useState('')
  const [stack, setStack] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function close() {
    if (busy) return
    setMessage('')
    setStack('')
    setErr(null)
    onOpenChange(false)
  }

  async function submit() {
    setErr(null)
    if (!message.trim()) {
      setErr('Failure cause is required.')
      return
    }
    setBusy(true)
    try {
      await Activities.fail(namespace, activityId, runId, message.trim(), stack.trim() || undefined)
      onSuccess?.()
      onOpenChange(false)
    } catch (e) {
      if (e instanceof ApiError && e.status === 501) {
        setErr('Fail is not yet implemented in the native server (501).')
      } else {
        setErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <ActionDialog
      title="Fail activity"
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
            {busy ? <Spinner size="small" /> : <Text fontSize="$2">Mark failed</Text>}
          </Button>
        </XStack>
      }
    >
      <YStack gap="$3">
        <Text fontSize="$2" color="$color">
          Records a failure for{' '}
          <Text fontWeight="500" color="$color">
            {activityId}
          </Text>{' '}
          and transitions it to Failed without waiting for the next attempt.
        </Text>
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Cause *
          </Text>
          <Input
            size="$3"
            value={message}
            onChangeText={setMessage}
            placeholder="reason this activity is being failed"
            disabled={busy}
          />
        </YStack>
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Stack trace (optional)
          </Text>
          <TextArea
            size="$3"
            minH={100}
            value={stack}
            onChangeText={setStack}
            placeholder={'  at worker.run …'}
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            disabled={busy}
          />
        </YStack>
      </YStack>
    </ActionDialog>
  )
}
