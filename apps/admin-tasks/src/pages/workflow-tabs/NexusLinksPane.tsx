// Nexus links pane — outbound nexus operations called by this
// workflow. Two sources are merged: pending operations from the
// describe envelope (live state) and historical NexusOperation*
// events (terminal records). Clicking a row routes to the endpoint.

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, Text, XStack, YStack } from 'hanzogui'
import { ArrowUpRight } from '@hanzogui/lucide-icons-2/icons/ArrowUpRight'
import { Globe } from '@hanzogui/lucide-icons-2/icons/Globe'
import { Network } from '@hanzogui/lucide-icons-2/icons/Network'
import { Empty, useFetch } from '@hanzogui/admin'
import {
  Workflows,
  type HistoryEvent,
  type PendingNexusOperation,
  type WorkflowExecution,
} from '../../lib/api'
import { NexusOperationStatusPill } from '../../components/nexus/NexusOperationStatusPill'

interface HistoryResp {
  events?: HistoryEvent[]
}

interface LinkRow {
  endpoint: string
  service: string
  operation: string
  state?: string
  eventId?: string
}

const NEXUS_PREFIX = 'NexusOperation'

function rowsFromHistory(events: HistoryEvent[]): LinkRow[] {
  const byKey = new Map<string, LinkRow>()
  for (const ev of events) {
    const t = String(ev.eventType ?? '')
    if (!t.startsWith(NEXUS_PREFIX)) continue
    const attrs = (ev.attributes ?? {}) as Record<string, unknown>
    // Wire shape varies between scheduled/started/completed; the
    // endpoint+service+operation triple lives at the top level on
    // Scheduled and is referenced by scheduledEventId thereafter.
    const endpoint = String(attrs.endpoint ?? attrs.endpointId ?? '')
    const service = String(attrs.service ?? '')
    const operation = String(attrs.operation ?? '')
    const scheduledRef = String(attrs.scheduledEventId ?? '')
    const key = scheduledRef || `${endpoint}/${service}/${operation}/${ev.eventId}`
    const existing = byKey.get(key)
    const stateFromEvent = t.replace(NEXUS_PREFIX, '') // Scheduled, Started, Completed, Failed, ...
    if (!existing) {
      byKey.set(key, { endpoint, service, operation, state: stateFromEvent, eventId: ev.eventId })
    } else {
      // Later event wins for state.
      existing.state = stateFromEvent
      if (endpoint && !existing.endpoint) existing.endpoint = endpoint
      if (service && !existing.service) existing.service = service
      if (operation && !existing.operation) existing.operation = operation
    }
  }
  return Array.from(byKey.values())
}

function rowsFromPending(pending: PendingNexusOperation[]): LinkRow[] {
  return pending.map((p) => ({
    endpoint: p.endpoint,
    service: p.service,
    operation: p.operation,
    state: p.state,
    eventId: p.scheduledEventId !== undefined ? String(p.scheduledEventId) : undefined,
  }))
}

function mergeRows(historyRows: LinkRow[], pendingRows: LinkRow[]): LinkRow[] {
  const out: LinkRow[] = []
  const seen = new Set<string>()
  for (const r of [...pendingRows, ...historyRows]) {
    const k = `${r.endpoint}|${r.service}|${r.operation}|${r.eventId ?? ''}`
    if (seen.has(k)) continue
    seen.add(k)
    out.push(r)
  }
  return out
}

export function NexusLinksPane({
  ns,
  wf,
}: {
  ns: string
  wf: WorkflowExecution
}) {
  const url = Workflows.historyUrl(ns, wf.execution.workflowId, wf.execution.runId || undefined)
  const { data } = useFetch<HistoryResp>(url)

  const pending = useMemo(() => rowsFromPending(wf.pendingNexusOperations ?? []), [wf])
  const history = useMemo(() => rowsFromHistory(data?.events ?? []), [data])
  const rows = useMemo(() => mergeRows(history, pending), [history, pending])

  if (rows.length === 0) {
    return (
      <Empty
        title="No nexus operations"
        hint="This workflow has not invoked any cross-namespace nexus endpoint."
        action={
          <Link
            to={`/namespaces/${encodeURIComponent(ns)}/nexus`}
            style={{ textDecoration: 'none' }}
          >
            <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
              <Network size={14} color="#86efac" />
              <Text fontSize="$2" color={'#86efac' as never}>
                Open nexus endpoints
              </Text>
            </XStack>
          </Link>
        }
      />
    )
  }

  return (
    <YStack gap="$3">
      <Text fontSize="$3" color="$color" fontWeight="500">
        Outbound{' '}
        <Text fontSize="$2" color="$placeholderColor" fontWeight="400">
          ({rows.length})
        </Text>
      </Text>
      <YStack gap="$2">
        {rows.map((r, i) => (
          <Card
            key={`${r.endpoint}-${r.service}-${r.operation}-${r.eventId ?? i}`}
            p="$3"
            bg="$background"
            borderColor="$borderColor"
            borderWidth={1}
          >
            <XStack items="center" gap="$3">
              {r.endpoint.startsWith('http') ? (
                <Globe size={16} color="#7e8794" />
              ) : (
                <Network size={16} color="#7e8794" />
              )}
              <YStack flex={1} minW={0}>
                <Text fontSize="$2" fontWeight="500" color="$color" numberOfLines={1}>
                  {r.service}
                  {r.service && r.operation ? '.' : ''}
                  {r.operation}
                </Text>
                <Text fontSize="$1" color="$placeholderColor" numberOfLines={1}>
                  endpoint{' '}
                  <Text fontFamily={'ui-monospace, SFMono-Regular, monospace' as never} color="$color">
                    {r.endpoint || '—'}
                  </Text>
                </Text>
              </YStack>
              <NexusOperationStatusPill state={r.state} />
              {r.endpoint ? (
                <Link
                  to={`/namespaces/${encodeURIComponent(ns)}/nexus/${encodeURIComponent(r.endpoint)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <ArrowUpRight size={14} color="#7e8794" />
                </Link>
              ) : null}
            </XStack>
          </Card>
        ))}
      </YStack>
    </YStack>
  )
}
