// MigrationDialog — destructive-action gate for moving a namespace
// to a different replicator node. Two interlocks:
//
//   1. Operator must pick a target from the validator list (we never
//      free-form a node id; if it's not a known validator, it can't
//      hold the namespace).
//   2. Operator must type the namespace name verbatim. The dialog
//      runs a 30s countdown highlighting impact: writes paused,
//      reads degrade to leader-only.
//
// The submit button is disabled until both interlocks pass.

import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  Input,
  Label,
  Paragraph,
  Spinner,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { Alert } from '@hanzogui/admin'
import { ApiError, Migration, type MigrationJob, type Validator } from '../../lib/api'

export interface MigrationDialogProps {
  ns: string
  open: boolean
  // Validators eligible as the migration target. The current leader
  // is excluded by the parent so the operator can't pick a no-op.
  candidates: Validator[]
  onClose: () => void
  // Fired once the engine accepts the request and returns a jobId;
  // the parent typically opens MigrationStatusCard at that point.
  onStarted: (job: MigrationJob) => void
}

// Predicate exported for unit tests. Confirmation gate passes only
// when the typed name matches the namespace exactly (case-sensitive)
// and a candidate target node was chosen.
export function canSubmitMigration(typedName: string, expectedName: string, toNode: string | null): boolean {
  return typedName === expectedName && toNode !== null && toNode.length > 0
}

export function MigrationDialog({ ns, open, candidates, onClose, onStarted }: MigrationDialogProps) {
  const [toNode, setToNode] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    if (!open) {
      setToNode(null)
      setTyped('')
      setSubmitting(false)
      setErr(null)
      setCountdown(30)
      return
    }
    setCountdown(30)
    const id = setInterval(() => setCountdown((n) => (n > 0 ? n - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [open])

  const ok = canSubmitMigration(typed, ns, toNode)

  async function submit() {
    if (!ok || toNode === null) return
    setSubmitting(true)
    setErr(null)
    try {
      const job = await Migration.start(ns, toNode)
      onStarted(job)
      onClose()
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : (e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      modal
      open={open}
      onOpenChange={(next: boolean) => {
        if (!next) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay key="overlay" opacity={0.6} />
        <Dialog.Content bordered elevate key="content" gap="$3" width={560}>
          <Dialog.Title>Migrate namespace {ns}</Dialog.Title>
          <Dialog.Description>
            <Text fontSize="$2" color={'#fca5a5' as never}>
              Writes to {ns} will pause for ~5–30s while the shard is locked, copied, and
              replayed on the target node. Reads degrade to leader-only during the cut-over.
              Workers polling this namespace will reconnect automatically.
            </Text>
          </Dialog.Description>

          <YStack gap="$2" data-testid="migration-target-list">
            <Label>Target node</Label>
            <XStack gap="$2" flexWrap="wrap">
              {candidates.length === 0 ? (
                <Text fontSize="$2" color="$placeholderColor">
                  No other validators available — single-node deployment.
                </Text>
              ) : (
                candidates.map((v) => (
                  <Button
                    key={v.id}
                    size="$2"
                    chromeless={toNode !== v.id}
                    borderWidth={1}
                    borderColor={(toNode === v.id ? '$color' : '$borderColor') as never}
                    onPress={() => setToNode(v.id)}
                    aria-pressed={toNode === v.id}
                  >
                    <Text fontSize="$2">{v.id}</Text>
                  </Button>
                ))
              )}
            </XStack>
          </YStack>

          <YStack gap="$2">
            <Label htmlFor="migrate-confirm">
              Type the namespace name{' '}
              <Text color="$color" fontWeight="700">
                {ns}
              </Text>{' '}
              to confirm
            </Label>
            <Input
              id="migrate-confirm"
              value={typed}
              onChangeText={(v: string) => setTyped(v)}
              placeholder={ns}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </YStack>

          {err ? (
            <Alert variant="destructive" title="Migration failed to start">
              {err}
            </Alert>
          ) : null}

          <XStack gap="$2" justify="space-between" items="center">
            <Paragraph fontSize="$1" color="$placeholderColor">
              Reviewing for {countdown}s
            </Paragraph>
            <XStack gap="$2">
              <Button size="$3" variant="outlined" onPress={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button
                size="$3"
                disabled={!ok || submitting}
                onPress={() => void submit()}
                aria-label="Confirm migrate namespace"
              >
                <XStack items="center" gap="$2">
                  {submitting ? <Spinner size="small" /> : null}
                  <Text fontSize="$2">{submitting ? 'Starting…' : 'Migrate namespace'}</Text>
                </XStack>
              </Button>
            </XStack>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
