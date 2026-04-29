// EventLink — clickable reference to a sibling event by id. Used inside
// EventAttributeTable for fields like scheduledEventId, startedEventId,
// initiatedEventId, workflowTaskCompletedEventId.

import { Link } from 'react-router-dom'
import { Text } from 'hanzogui'

export interface EventLinkProps {
  ns: string
  workflowId: string
  runId?: string
  eventId: string | number
  label?: string
}

export function EventLink({ ns, workflowId, runId, eventId, label }: EventLinkProps) {
  const id = String(eventId)
  if (!id || id === '0') {
    return (
      <Text fontFamily={'ui-monospace, SFMono-Regular, monospace' as never} fontSize="$2" color="$color">
        —
      </Text>
    )
  }
  const qs = runId ? `?runId=${encodeURIComponent(runId)}` : ''
  const href = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(workflowId)}/events/${encodeURIComponent(id)}${qs}`
  return (
    <Link to={href} style={{ textDecoration: 'none' }}>
      <Text
        fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
        fontSize="$2"
        color={'#86efac' as never}
        hoverStyle={{ opacity: 0.8 }}
      >
        {label ?? `#${id}`}
      </Text>
    </Link>
  )
}
