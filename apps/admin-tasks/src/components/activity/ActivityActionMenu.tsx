// ActivityActionMenu — header actions for a standalone activity. FSM
// gated: Cancel/Complete/Fail are hidden once terminal; Heartbeat is
// hidden when not Running. The capability bit (canWriteNamespace)
// hides the entire menu when the namespace is read-only.

import { useState } from 'react'
import { Button, Spinner, Text, XStack } from 'hanzogui'
import { Ban } from '@hanzogui/lucide-icons-2/icons/Ban'
import { Check } from '@hanzogui/lucide-icons-2/icons/Check'
import { HeartPulse } from '@hanzogui/lucide-icons-2/icons/HeartPulse'
import { Square } from '@hanzogui/lucide-icons-2/icons/Square'
import { Activities, ApiError } from '../../lib/api'
import { canWriteNamespace, useSettings } from '../../stores/settings'
import { CancelActivityModal } from './CancelActivityModal'
import { CompleteActivityModal } from './CompleteActivityModal'
import { FailActivityModal } from './FailActivityModal'
import { isTerminalActivity, parseActivityStatus } from './ActivityStatusPill'

export interface ActivityActionMenuProps {
  ns: string
  activityId: string
  runId: string
  status: string
  onChanged?: () => void
}

type ModalKey = 'cancel' | 'complete' | 'fail' | null

export function ActivityActionMenu({
  ns,
  activityId,
  runId,
  status,
  onChanged,
}: ActivityActionMenuProps) {
  const { settings } = useSettings()
  const writable = canWriteNamespace(settings)
  const parsed = parseActivityStatus(String(status))
  const terminal = isTerminalActivity(parsed)
  const running = parsed === 'Running' || parsed === 'Started'

  const [modal, setModal] = useState<ModalKey>(null)
  const [hbBusy, setHbBusy] = useState(false)
  const [hbErr, setHbErr] = useState<string | null>(null)

  if (!writable) return null
  if (terminal) return null

  async function heartbeat() {
    setHbBusy(true)
    setHbErr(null)
    try {
      await Activities.heartbeat(ns, activityId, runId)
      onChanged?.()
    } catch (e) {
      if (e instanceof ApiError && e.status === 501) {
        setHbErr('501')
      } else {
        setHbErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setHbBusy(false)
    }
  }

  return (
    <>
      <XStack gap="$2" items="center">
        {running ? (
          <Button
            size="$2"
            borderWidth={1}
            borderColor="$borderColor"
            onPress={() => void heartbeat()}
            disabled={hbBusy}
            aria-label="Reset heartbeat"
          >
            <XStack items="center" gap="$1.5">
              {hbBusy ? <Spinner size="small" /> : <HeartPulse size={14} color="#7dd3fc" />}
              <Text fontSize="$2" color="$color">
                Heartbeat
              </Text>
            </XStack>
          </Button>
        ) : null}
        <Button
          size="$2"
          borderWidth={1}
          borderColor="$borderColor"
          onPress={() => setModal('cancel')}
          aria-label="Cancel activity"
        >
          <XStack items="center" gap="$1.5">
            <Ban size={14} color="#cbd5e1" />
            <Text fontSize="$2" color="$color">
              Cancel
            </Text>
          </XStack>
        </Button>
        <Button
          size="$2"
          borderWidth={1}
          borderColor="$borderColor"
          onPress={() => setModal('complete')}
          aria-label="Complete activity"
        >
          <XStack items="center" gap="$1.5">
            <Check size={14} color="#86efac" />
            <Text fontSize="$2" color="$color">
              Complete
            </Text>
          </XStack>
        </Button>
        <Button
          size="$2"
          borderWidth={1}
          borderColor={'#fca5a5' as never}
          onPress={() => setModal('fail')}
          aria-label="Fail activity"
        >
          <XStack items="center" gap="$1.5">
            <Square size={14} color="#fca5a5" />
            <Text fontSize="$2" color={'#fca5a5' as never}>
              Fail
            </Text>
          </XStack>
        </Button>
      </XStack>
      {hbErr ? (
        <Text fontSize="$1" color={'#fca5a5' as never}>
          {hbErr === '501'
            ? 'Heartbeat reset is not yet implemented in the native server (501).'
            : `Heartbeat failed: ${hbErr}`}
        </Text>
      ) : null}

      <CancelActivityModal
        open={modal === 'cancel'}
        onOpenChange={(o) => !o && setModal(null)}
        namespace={ns}
        activityId={activityId}
        runId={runId}
        onSuccess={onChanged}
      />
      <CompleteActivityModal
        open={modal === 'complete'}
        onOpenChange={(o) => !o && setModal(null)}
        namespace={ns}
        activityId={activityId}
        runId={runId}
        onSuccess={onChanged}
      />
      <FailActivityModal
        open={modal === 'fail'}
        onOpenChange={(o) => !o && setModal(null)}
        namespace={ns}
        activityId={activityId}
        runId={runId}
        onSuccess={onChanged}
      />
    </>
  )
}
