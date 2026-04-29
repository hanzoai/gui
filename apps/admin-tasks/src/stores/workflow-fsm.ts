// Workflow lifecycle finite state machine. Pure reducer — no React,
// no globals. Used to validate UI actions against the current
// workflow status (e.g. "Cancel is disabled when status === Completed")
// and to drive the visual lifecycle indicator on the workflow detail
// page.
//
// The states match the proto WORKFLOW_EXECUTION_STATUS_* enum, mapped
// to upstream Temporal Web UI's PascalCase short forms.

import type { WorkflowStatus } from '../lib/types'

export type WorkflowAction =
  | { type: 'start' }
  | { type: 'signal' }
  | { type: 'cancel-request' }
  | { type: 'cancel-complete' }
  | { type: 'terminate' }
  | { type: 'complete' }
  | { type: 'fail' }
  | { type: 'timeout' }
  | { type: 'continue-as-new' }
  | { type: 'pause' }
  | { type: 'unpause' }

export const TERMINAL_STATUSES: ReadonlySet<WorkflowStatus> = new Set<WorkflowStatus>([
  'Completed',
  'Failed',
  'Canceled',
  'Terminated',
  'TimedOut',
  'ContinuedAsNew',
])

export const RUNNING_STATUSES: ReadonlySet<WorkflowStatus> = new Set<WorkflowStatus>([
  'Running',
  'Paused',
  'Pending',
])

export function isTerminal(s: WorkflowStatus): boolean {
  return TERMINAL_STATUSES.has(s)
}

export function isRunning(s: WorkflowStatus): boolean {
  return RUNNING_STATUSES.has(s)
}

// transition(current, action) → next status, or null if illegal.
// Illegal transitions return null rather than throwing so the UI can
// disable the button instead of crashing on a stale click.
export function transition(current: WorkflowStatus, action: WorkflowAction): WorkflowStatus | null {
  // Terminal states never transition (a fresh run produces a new
  // execution; that's a separate FSM instance).
  if (isTerminal(current)) return null

  switch (action.type) {
    case 'start':
      // Only Unspecified → Running. Pending has already been started.
      return current === 'Unspecified' ? 'Running' : null

    case 'signal':
      // Signal preserves status (counts go up via the engine, not here).
      return current === 'Running' || current === 'Paused' || current === 'Pending' ? current : null

    case 'cancel-request':
      // The engine still treats the workflow as Running until the
      // worker observes the cancel and emits the close event. UI
      // shows "Cancel pending" via a side flag, not via state change.
      return current === 'Running' || current === 'Paused' || current === 'Pending' ? current : null

    case 'cancel-complete':
      return current === 'Running' || current === 'Paused' || current === 'Pending' ? 'Canceled' : null

    case 'terminate':
      return current === 'Running' || current === 'Paused' || current === 'Pending' ? 'Terminated' : null

    case 'complete':
      return current === 'Running' || current === 'Pending' ? 'Completed' : null

    case 'fail':
      return current === 'Running' || current === 'Pending' ? 'Failed' : null

    case 'timeout':
      return current === 'Running' || current === 'Pending' ? 'TimedOut' : null

    case 'continue-as-new':
      return current === 'Running' ? 'ContinuedAsNew' : null

    case 'pause':
      return current === 'Running' ? 'Paused' : null

    case 'unpause':
      return current === 'Paused' ? 'Running' : null
  }
}

// canPerform — UI-side guard. True when the action's transition is
// legal from `current`.
export function canPerform(current: WorkflowStatus, action: WorkflowAction): boolean {
  return transition(current, action) !== null
}

// availableActions — list of actions the UI should expose for a
// status. Used to render the action menu on the workflow detail
// header.
export function availableActions(current: WorkflowStatus): WorkflowAction['type'][] {
  if (isTerminal(current)) return []
  const all: WorkflowAction['type'][] = [
    'signal',
    'cancel-request',
    'terminate',
    'pause',
    'unpause',
  ]
  return all.filter((t) => canPerform(current, { type: t } as WorkflowAction))
}
