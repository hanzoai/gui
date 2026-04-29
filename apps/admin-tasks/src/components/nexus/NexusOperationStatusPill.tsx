// Pill for a pending/historical nexus operation. State strings come
// from the wire as either PENDING_NEXUS_OPERATION_STATE_* or
// short-form (Started/Completed/Failed/...). Maps to admin Badge.

import { Badge } from '@hanzogui/admin'

export interface NexusOperationStatusPillProps {
  state?: string
}

function shortState(s?: string): string {
  if (!s) return 'unknown'
  return s
    .replace(/^PENDING_NEXUS_OPERATION_STATE_/, '')
    .replace(/^NEXUS_OPERATION_/, '')
    .toLowerCase()
}

function variant(s?: string): 'success' | 'destructive' | 'warning' | 'info' | 'muted' {
  const v = shortState(s)
  if (v.includes('completed') || v === 'succeeded') return 'success'
  if (v.includes('fail') || v.includes('canceled')) return 'destructive'
  if (v.includes('timed_out') || v.includes('cancel_requested')) return 'warning'
  if (v.includes('started') || v.includes('scheduled')) return 'info'
  return 'muted'
}

export function NexusOperationStatusPill({ state }: NexusOperationStatusPillProps) {
  return <Badge variant={variant(state)}>{shortState(state)}</Badge>
}
