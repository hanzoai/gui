// Workflow history — top-level page hosting four views over the same
// event payload: tree (default), feed, compact, json. View is keyed
// on the trailing URL segment so the view is shareable.
//
// Above the body: horizontal timeline strip + view tabs. The page
// fetches once and feeds the same events array into whichever view
// is active.

import { useMemo } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import {
  Card,
  H1,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import {
  Alert,
  ErrorState,
  LoadingState,
  useFetch,
} from '@hanzogui/admin'
import { Workflows } from '../lib/api'
import { useTaskEvents } from '../lib/events'
import { HistoryCompact } from '../components/workflow/HistoryCompact'
import { HistoryFeed } from '../components/workflow/HistoryFeed'
import { HistoryJson } from '../components/workflow/HistoryJson'
import { HistoryTimeline } from '../components/workflow/HistoryTimeline'
import { HistoryTree } from '../components/workflow/HistoryTree'
import type { HistoryEvent } from '../lib/types'

interface HistoryResp {
  events?: HistoryEvent[]
  synthetic?: boolean
}

type View = 'tree' | 'feed' | 'compact' | 'json'

const VIEWS: ReadonlyArray<{ value: View; label: string }> = [
  { value: 'tree', label: 'Tree' },
  { value: 'feed', label: 'Feed' },
  { value: 'compact', label: 'Compact' },
  { value: 'json', label: 'JSON' },
]

function detectView(pathname: string): View {
  const seg = pathname.split('/').pop() ?? ''
  if (seg === 'feed' || seg === 'compact' || seg === 'json') return seg
  return 'tree'
}

export function WorkflowHistoryPage() {
  const { ns, workflowId, runId: runIdParam } = useParams()
  const [sp] = useSearchParams()
  const location = useLocation()
  const namespace = ns!
  const runId = runIdParam ?? sp.get('runId') ?? ''
  const view = detectView(location.pathname)

  const url = Workflows.historyUrl(namespace, workflowId!, runId || undefined)
  const { data, error, isLoading, mutate } = useFetch<HistoryResp>(url)

  useTaskEvents(namespace, () => void mutate(), [
    'workflow.canceled',
    'workflow.terminated',
    'workflow.signaled',
  ])

  const events = useMemo(() => data?.events ?? [], [data])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const qs = runId ? `?runId=${encodeURIComponent(runId)}` : ''
  const detailHref = `/namespaces/${encodeURIComponent(namespace)}/workflows/${encodeURIComponent(workflowId!)}${qs}`
  const baseHistoryHref = `/namespaces/${encodeURIComponent(namespace)}/workflows/${encodeURIComponent(workflowId!)}${runIdParam ? `/${encodeURIComponent(runIdParam)}` : ''}/history`

  return (
    <YStack gap="$5">
      <Link to={detailHref} style={{ textDecoration: 'none', color: 'inherit' }}>
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            {workflowId}
          </Text>
        </XStack>
      </Link>

      <YStack gap="$1">
        <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
          HISTORY
        </Text>
        <H1 size="$7" color="$color" fontWeight="600">
          {workflowId}
        </H1>
        {runId ? (
          <Text
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$2"
            color="$placeholderColor"
          >
            {runId}
          </Text>
        ) : null}
      </YStack>

      {data.synthetic ? (
        <Alert title="Synthetic timeline">
          Native engine event history coming soon. This view derives events
          from the workflow record (start, signal count, terminal transition)
          — no events are fabricated.
        </Alert>
      ) : null}

      <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <HistoryTimeline ns={namespace} workflowId={workflowId!} runId={runId} events={events} />
      </Card>

      <XStack gap="$2" borderBottomWidth={1} borderBottomColor="$borderColor" pb="$1">
        {VIEWS.map((v) => {
          const path = v.value === 'tree' ? baseHistoryHref : `${baseHistoryHref}/${v.value}`
          const active = v.value === view
          return (
            <Link
              key={v.value}
              to={`${path}${qs}`}
              style={{
                textDecoration: 'none',
                padding: '6px 12px',
                borderBottom: active ? '2px solid #86efac' : '2px solid transparent',
              }}
            >
              <Text fontSize="$2" color={active ? '$color' : '$placeholderColor'}>
                {v.label}
              </Text>
            </Link>
          )
        })}
      </XStack>

      {view === 'tree' ? (
        <HistoryTree ns={namespace} workflowId={workflowId!} runId={runId} events={events} />
      ) : view === 'feed' ? (
        <HistoryFeed ns={namespace} workflowId={workflowId!} runId={runId} events={events} />
      ) : view === 'compact' ? (
        <HistoryCompact ns={namespace} workflowId={workflowId!} runId={runId} events={events} />
      ) : (
        <HistoryJson events={events} />
      )}
    </YStack>
  )
}
