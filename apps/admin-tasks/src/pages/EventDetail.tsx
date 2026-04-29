// EventDetail — per-event drill-down.
// Route: /namespaces/:ns/workflows/:workflowId(/:runId)/events/:eventId.
// Fetches the full history once via Workflows.historyUrl, locates the
// event by id, and delegates rendering to EventCard + EventAttributeTable.

import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { EventCard } from '../components/event/EventCard'
import { EventAttributeTable } from '../components/event/EventAttributeTable'
import { Workflows } from '../lib/api'
import type { GetWorkflowExecutionHistoryResponse } from '../lib/types'

export function EventDetailPage() {
  const { ns, workflowId, runId: pathRunId, eventId } = useParams()
  const [sp] = useSearchParams()
  const runId = pathRunId ?? sp.get('runId') ?? undefined
  const namespace = ns!
  const wf = workflowId!
  const url = Workflows.historyUrl(namespace, wf, runId, undefined)
  const { data, error, isLoading } = useFetch<GetWorkflowExecutionHistoryResponse>(url)

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const events = data.history?.events ?? data.events ?? []
  const target = Number(eventId)
  const idx = events.findIndex((e) => Number(e.eventId) === target)
  const ev = idx >= 0 ? events[idx] : undefined
  const prev = idx > 0 ? events[idx - 1] : undefined
  const next = idx >= 0 && idx < events.length - 1 ? events[idx + 1] : undefined
  const qs = runId ? `?runId=${encodeURIComponent(runId)}` : ''

  return (
    <YStack gap="$5">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}/workflows/${encodeURIComponent(wf)}/history${qs}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            history
          </Text>
        </XStack>
      </Link>

      {!ev ? (
        <Empty title="Event not found" hint={`No event with id ${eventId} on this workflow run.`} />
      ) : (
        <EventCard event={ev} ns={namespace} workflowId={wf} runId={runId} prev={prev} next={next}>
          <EventAttributeTable event={ev} ns={namespace} workflowId={wf} runId={runId} />
        </EventCard>
      )}
    </YStack>
  )
}
