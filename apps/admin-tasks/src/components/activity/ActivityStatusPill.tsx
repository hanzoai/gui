// ActivityStatusPill — colored pill for an activity execution status.
// Maps the wire `ACTIVITY_EXECUTION_STATUS_*` enum and the PascalCase
// short form onto a Badge variant. Mirrors WorkflowStatusPill so the
// two read uniformly when both appear in a list.

import { Text, XStack } from 'hanzogui'
import { Badge } from '@hanzogui/admin'
import type { ActivityStatus, ActivityWireStatus } from '../../lib/api'

export interface ActivityStatusPillProps {
  status: ActivityWireStatus | ActivityStatus | string
  withDot?: boolean
}

type Variant = 'success' | 'destructive' | 'warning' | 'muted' | 'info' | 'accent'

// parseActivityStatus — accept wire enum or short form. Anything we
// don't recognise drops to Unspecified so the UI never renders garbage.
export function parseActivityStatus(s: string): ActivityStatus {
  switch (s) {
    case 'ACTIVITY_EXECUTION_STATUS_SCHEDULED':
    case 'Scheduled':
      return 'Scheduled'
    case 'ACTIVITY_EXECUTION_STATUS_RUNNING':
    case 'Running':
      return 'Running'
    case 'Started':
      return 'Started'
    case 'ACTIVITY_EXECUTION_STATUS_COMPLETED':
    case 'Completed':
      return 'Completed'
    case 'ACTIVITY_EXECUTION_STATUS_FAILED':
    case 'Failed':
      return 'Failed'
    case 'ACTIVITY_EXECUTION_STATUS_CANCELED':
    case 'Canceled':
      return 'Canceled'
    case 'ACTIVITY_EXECUTION_STATUS_TERMINATED':
    case 'Terminated':
      return 'Terminated'
    case 'ACTIVITY_EXECUTION_STATUS_TIMED_OUT':
    case 'TimedOut':
      return 'TimedOut'
    default:
      return 'Unspecified'
  }
}

// Variant mapping per the brief: Scheduled gray, Started/Running blue,
// Completed green, Failed red, Canceled yellow, TimedOut orange.
function variantFor(s: ActivityStatus): Variant {
  switch (s) {
    case 'Running':
    case 'Started':
      return 'info'
    case 'Completed':
      return 'success'
    case 'Failed':
    case 'Terminated':
      return 'destructive'
    case 'Canceled':
      return 'warning'
    case 'TimedOut':
      return 'accent'
    case 'Scheduled':
    case 'Unspecified':
    default:
      return 'muted'
  }
}

const DOT_COLOR: Record<ActivityStatus, string> = {
  Scheduled: '#94a3b8',
  Running: '#7dd3fc',
  Started: '#7dd3fc',
  Completed: '#86efac',
  Failed: '#fca5a5',
  Canceled: '#fcd34d',
  Terminated: '#fca5a5',
  TimedOut: '#fdba74',
  Unspecified: '#7e8794',
}

export function ActivityStatusPill({ status, withDot = true }: ActivityStatusPillProps) {
  const s = parseActivityStatus(String(status))
  return (
    <Badge variant={variantFor(s)}>
      <XStack items="center" gap="$1.5">
        {withDot ? (
          <Text fontSize={10} color={DOT_COLOR[s] as never}>
            ●
          </Text>
        ) : null}
        <Text fontSize="$1" fontWeight="500" color="inherit">
          {s}
        </Text>
      </XStack>
    </Badge>
  )
}

export function isTerminalActivity(s: ActivityStatus | string): boolean {
  const v = typeof s === 'string' ? parseActivityStatus(s) : s
  return v === 'Completed' || v === 'Failed' || v === 'Canceled' || v === 'Terminated' || v === 'TimedOut'
}
