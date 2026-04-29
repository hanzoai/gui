// WorkflowActionMenu — header actions for a running workflow. Each
// action is gated by the FSM (e.g. terminate hidden once Terminated).
// Clicking opens the corresponding F2 modal under
// src/components/workflow-actions/. Reset is surfaced whenever a
// runId is present (terminal or running).

import { useState } from 'react'
import { Button, Text, XStack } from 'hanzogui'
import { Ban } from '@hanzogui/lucide-icons-2/icons/Ban'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { RotateCcw } from '@hanzogui/lucide-icons-2/icons/RotateCcw'
import { Send } from '@hanzogui/lucide-icons-2/icons/Send'
import { Square } from '@hanzogui/lucide-icons-2/icons/Square'
import { parseWorkflowStatus } from '@hanzogui/admin'
import {
  CancelModal,
  ResetModal,
  SignalModal,
  TerminateModal,
} from '../workflow-actions'
import { availableActions, isTerminal } from '../../stores/workflow-fsm'

export interface WorkflowActionMenuProps {
  ns: string
  workflowId: string
  runId: string
  status: string
  onChanged?: () => void
}

type ModalKey = 'signal' | 'cancel' | 'terminate' | 'reset'
type ActionKey = 'signal' | 'cancel-request' | 'terminate' | 'reset'

const ACTIONS: ReadonlyArray<{
  key: ActionKey
  modal: ModalKey
  label: string
  Icon: typeof Send
  destructive?: boolean
}> = [
  { key: 'signal', modal: 'signal', label: 'Signal', Icon: Send },
  { key: 'cancel-request', modal: 'cancel', label: 'Request cancel', Icon: Ban },
  { key: 'terminate', modal: 'terminate', label: 'Terminate', Icon: Square, destructive: true },
  { key: 'reset', modal: 'reset', label: 'Reset', Icon: RotateCcw },
]

export function WorkflowActionMenu({
  ns,
  workflowId,
  runId,
  status,
  onChanged,
}: WorkflowActionMenuProps) {
  const parsed = parseWorkflowStatus(status)
  const allowed = new Set(availableActions(parsed))
  const resetAllowed = !!runId

  const [modal, setModal] = useState<ModalKey | null>(null)

  if (isTerminal(parsed) && !resetAllowed) return null

  const visible = ACTIONS.filter((a) => {
    if (a.key === 'reset') return resetAllowed
    return allowed.has(a.key)
  })

  if (visible.length === 0) return null

  const onSuccess = () => {
    onChanged?.()
  }

  return (
    <>
      <XStack gap="$2" items="center">
        {visible.map((a) => {
          const Icon = a.Icon
          return (
            <Button
              key={a.key}
              size="$2"
              borderWidth={1}
              borderColor={a.destructive ? ('#fca5a5' as never) : '$borderColor'}
              onPress={() => setModal(a.modal)}
              aria-label={a.label}
            >
              <XStack items="center" gap="$1.5">
                <Icon size={14} color={a.destructive ? '#fca5a5' : '#cbd5e1'} />
                <Text fontSize="$2" color={a.destructive ? ('#fca5a5' as never) : '$color'}>
                  {a.label}
                </Text>
              </XStack>
            </Button>
          )
        })}
      </XStack>

      <SignalModal
        open={modal === 'signal'}
        onOpenChange={(o) => !o && setModal(null)}
        namespace={ns}
        workflowId={workflowId}
        runId={runId}
        onSuccess={onSuccess}
      />
      <CancelModal
        open={modal === 'cancel'}
        onOpenChange={(o) => !o && setModal(null)}
        namespace={ns}
        workflowId={workflowId}
        runId={runId}
        onSuccess={onSuccess}
      />
      <TerminateModal
        open={modal === 'terminate'}
        onOpenChange={(o) => !o && setModal(null)}
        namespace={ns}
        workflowId={workflowId}
        runId={runId}
        onSuccess={onSuccess}
      />
      <ResetModal
        open={modal === 'reset'}
        onOpenChange={(o) => !o && setModal(null)}
        namespace={ns}
        workflowId={workflowId}
        runId={runId}
        onSuccess={onSuccess}
      />
    </>
  )
}

// Compact placeholder — shows a dropdown caret when there is no
// visible action. Reserved for the future menu collapse path.
export function WorkflowActionMenuTrigger() {
  return <ChevronDown size={14} color="#7e8794" />
}
