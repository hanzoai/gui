// Reset a workflow to a prior WorkflowTaskCompleted event. The engine
// replays history up to the chosen event and resumes from that point.
// Candidate events are derived from the workflow's history feed.

import { useEffect, useState } from 'react'
import { Button, Card, Input, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ApiError, Workflows } from '../../lib/api'
import type { HistoryEvent } from '../../lib/api'
import { eventBus } from '../../stores/event-bus'
import { ActionDialog } from './ActionDialog'

export interface ResetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  namespace: string
  workflowId: string
  runId?: string
  onSuccess?: () => void
}

interface ResetCandidate {
  eventId: number
  eventTime?: string
}

export function ResetModal({
  open,
  onOpenChange,
  namespace,
  workflowId,
  runId,
  onSuccess,
}: ResetModalProps) {
  const [candidates, setCandidates] = useState<ResetCandidate[] | null>(null)
  const [loadErr, setLoadErr] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [reason, setReason] = useState('Reset from UI')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // Load WorkflowTaskCompleted candidate events whenever the modal opens.
  useEffect(() => {
    if (!open) return
    let cancelled = false
    setCandidates(null)
    setLoadErr(null)
    setSelected(null)
    ;(async () => {
      try {
        const url = Workflows.historyUrl(namespace, workflowId, runId)
        const resp = await fetch(url, { credentials: 'same-origin' })
        if (!resp.ok) throw new Error(`history ${resp.status}`)
        const body = (await resp.json()) as { events?: HistoryEvent[] }
        if (cancelled) return
        const taskCompleted = (body.events ?? [])
          .filter((e) => e.eventType === 'WorkflowTaskCompleted')
          .map((e) => ({ eventId: Number(e.eventId), eventTime: e.eventTime }))
          .filter((c) => Number.isFinite(c.eventId) && c.eventId > 0)
        setCandidates(taskCompleted)
      } catch (e) {
        if (cancelled) return
        setLoadErr(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, namespace, workflowId, runId])

  function close() {
    if (busy) return
    setReason('Reset from UI')
    setErr(null)
    onOpenChange(false)
  }

  async function submit() {
    if (selected === null) {
      setErr('Pick an event to reset to.')
      return
    }
    setBusy(true)
    setErr(null)
    try {
      await Workflows.reset(namespace, workflowId, runId, {
        eventId: selected,
        reason,
      })
      eventBus.emit({
        kind: 'workflow-action-completed',
        namespace,
        workflowId,
        runId,
        action: 'reset',
      })
      onSuccess?.()
      onOpenChange(false)
    } catch (e) {
      if (e instanceof ApiError && e.status === 501) {
        setErr('Reset is not yet implemented in the native server (501).')
      } else {
        setErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <ActionDialog
      title="Reset workflow"
      open={open}
      busy={busy}
      error={err}
      onClose={close}
      width={600}
      footer={
        <XStack gap="$2" justify="flex-end">
          <Button size="$2" chromeless onPress={close} disabled={busy}>
            Cancel
          </Button>
          <Button size="$2" onPress={submit} disabled={busy || selected === null}>
            {busy ? <Spinner size="small" /> : <Text fontSize="$2">Reset to event {selected ?? ''}</Text>}
          </Button>
        </XStack>
      }
    >
      <YStack gap="$3">
        <Text fontSize="$2" color="$color">
          Replay history up to a prior WorkflowTaskCompleted event and resume
          from that point. A new run is created.
        </Text>

        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Candidate events
          </Text>
          {loadErr ? (
            <Text fontSize="$1" color={'#fca5a5' as never}>
              Could not load history: {loadErr}
            </Text>
          ) : candidates === null ? (
            <XStack items="center" gap="$2">
              <Spinner size="small" />
              <Text fontSize="$1" color="$placeholderColor">
                Loading history…
              </Text>
            </XStack>
          ) : candidates.length === 0 ? (
            <Text fontSize="$1" color="$placeholderColor">
              No WorkflowTaskCompleted events on this run.
            </Text>
          ) : (
            <YStack gap="$1" style={{ maxHeight: 220, overflow: 'auto' } as never}>
              {candidates.map((c) => {
                const active = selected === c.eventId
                return (
                  <Card
                    key={c.eventId}
                    p="$2"
                    borderWidth={1}
                    borderColor={active ? ('#86efac' as never) : '$borderColor'}
                    bg={active ? ('rgba(134,239,172,0.08)' as never) : ('transparent' as never)}
                    onPress={() => setSelected(c.eventId)}
                    cursor="pointer"
                  >
                    <XStack items="center" justify="space-between">
                      <Text fontSize="$2" color="$color">
                        Event {c.eventId}
                      </Text>
                      {c.eventTime ? (
                        <Text fontSize="$1" color="$placeholderColor">
                          {c.eventTime}
                        </Text>
                      ) : null}
                    </XStack>
                  </Card>
                )
              })}
            </YStack>
          )}
        </YStack>

        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Reason
          </Text>
          <Input
            size="$3"
            value={reason}
            onChangeText={setReason}
            placeholder="Reset from UI"
            disabled={busy}
          />
        </YStack>
      </YStack>
    </ActionDialog>
  )
}
