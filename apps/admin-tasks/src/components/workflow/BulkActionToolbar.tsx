// BulkActionToolbar — sits below the search bar when the user has
// selected one or more workflows. Composes @hanzogui/admin's
// BatchActionBar with confirm dialogs and the Batches.create() call.
// On submit the user is navigated to the new batch's detail page so
// progress is observable.
//
// Selection rowKeys come in as `${workflowId}::${runId}` (the format
// emitted by WorkflowsTable). We split on `::` to recover the
// workflowId for the visibility query: `WorkflowId IN ("a","b",…)`.
//
// Reset is gated: it requires every selected execution to have a
// runId (the engine reset RPC needs both ids). Since rowKeys carry
// runIds we treat any empty-tail key as reset-disabled.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleX } from '@hanzogui/lucide-icons-2/icons/CircleX'
import { Power } from '@hanzogui/lucide-icons-2/icons/Power'
import { RotateCcw } from '@hanzogui/lucide-icons-2/icons/RotateCcw'
import { Send } from '@hanzogui/lucide-icons-2/icons/Send'
import type { ReactNode } from 'react'
import { BatchActionBar } from '@hanzogui/admin'

// Mirrors @hanzogui/admin's internal BatchAction shape — admin
// exports BatchActionBar but not the row type; duplicating one
// interface here is cheaper than widening the package surface.
interface BatchAction {
  label: string
  onPress: () => void
  enabled?: boolean
  destructive?: boolean
  icon?: ReactNode
  testId?: string
}
import { Batches } from '../../lib/api'
import { BulkConfirmDialog } from './BulkConfirmDialog'

type Action = 'cancel' | 'terminate' | 'reset' | 'signal'

const WIRE: Record<Action, string> = {
  cancel: 'BATCH_OPERATION_TYPE_CANCEL',
  terminate: 'BATCH_OPERATION_TYPE_TERMINATE',
  reset: 'BATCH_OPERATION_TYPE_RESET',
  signal: 'BATCH_OPERATION_TYPE_SIGNAL',
}

const TYPE: Record<Action, string> = {
  cancel: 'Cancel',
  terminate: 'Terminate',
  reset: 'Reset',
  signal: 'Signal',
}

export interface BulkActionToolbarProps {
  ns: string
  selected: ReadonlySet<string>
  totalCount?: number
  onClear: () => void
  // When false the action buttons are disabled (used to gate writes
  // on namespaceWriteDisabled).
  enabled?: boolean
}

export function BulkActionToolbar({
  ns,
  selected,
  totalCount,
  onClear,
  enabled = true,
}: BulkActionToolbarProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState<Action | null>(null)

  if (selected.size === 0) return null

  const allHaveRunId = Array.from(selected).every((k) => k.split('::')[1])
  const workflowIds = Array.from(selected).map((k) => k.split('::')[0]).filter(Boolean)

  const actions: BatchAction[] = [
    {
      label: 'Cancel',
      onPress: () => setOpen('cancel'),
      enabled,
      icon: <CircleX size={14} color="#cbd5e1" />,
      testId: 'bulk-cancel-button',
    },
    {
      label: 'Signal',
      onPress: () => setOpen('signal'),
      enabled,
      icon: <Send size={14} color="#cbd5e1" />,
      testId: 'bulk-signal-button',
    },
    {
      label: 'Reset',
      onPress: () => setOpen('reset'),
      // Reset requires runId on every selected execution.
      enabled: enabled && allHaveRunId,
      icon: <RotateCcw size={14} color="#cbd5e1" />,
      testId: 'bulk-reset-button',
    },
    {
      label: 'Terminate',
      onPress: () => setOpen('terminate'),
      enabled,
      destructive: true,
      icon: <Power size={14} color="#fca5a5" />,
      testId: 'bulk-terminate-button',
    },
  ]

  async function submit(reason: string) {
    if (!open) return
    const query = `WorkflowId IN (${workflowIds.map((id) => `"${id}"`).join(',')})`
    const body: Record<string, unknown> = {
      operation: WIRE[open],
      operationType: TYPE[open],
      query,
      reason: reason || `Bulk ${TYPE[open]} from console`,
    }
    const created = await Batches.create(ns, body)
    onClear()
    const id = created.batchId || created.jobId
    if (id) navigate(`/namespaces/${encodeURIComponent(ns)}/batches/${encodeURIComponent(id)}`)
    else navigate(`/namespaces/${encodeURIComponent(ns)}/batches`)
  }

  const dialogCopy: Record<Action, { title: string; description: string; confirm: string; destructive: boolean; reasonRequired: boolean }> = {
    cancel: {
      title: `Cancel ${selected.size} workflow${selected.size === 1 ? '' : 's'}?`,
      description: 'A cancel request is delivered to each match. Workers decide how (or whether) to honour it.',
      confirm: 'Cancel selected',
      destructive: false,
      reasonRequired: false,
    },
    terminate: {
      title: `Terminate ${selected.size} workflow${selected.size === 1 ? '' : 's'}?`,
      description: 'Termination is irreversible — running activities lose their final state. A reason is required for the audit trail.',
      confirm: 'Terminate selected',
      destructive: true,
      reasonRequired: true,
    },
    reset: {
      title: `Reset ${selected.size} workflow${selected.size === 1 ? '' : 's'}?`,
      description: 'Each match is reset to its first workflow-task-completed event. A reason is required for the audit trail.',
      confirm: 'Reset selected',
      destructive: false,
      reasonRequired: true,
    },
    signal: {
      title: `Signal ${selected.size} workflow${selected.size === 1 ? '' : 's'}?`,
      description: 'A signal is delivered to every match. Use the dedicated batch creator if you need to attach a payload.',
      confirm: 'Signal selected',
      destructive: false,
      reasonRequired: false,
    },
  }

  return (
    <>
      <BatchActionBar
        selectedCount={selected.size}
        totalCount={totalCount}
        actions={actions}
        onClear={onClear}
      />
      {open ? (
        <BulkConfirmDialog
          open={open !== null}
          onOpenChange={(next) => {
            if (!next) setOpen(null)
          }}
          title={dialogCopy[open].title}
          description={dialogCopy[open].description}
          confirmLabel={dialogCopy[open].confirm}
          destructive={dialogCopy[open].destructive}
          reasonRequired={dialogCopy[open].reasonRequired}
          onSubmit={submit}
        />
      ) : null}
    </>
  )
}
