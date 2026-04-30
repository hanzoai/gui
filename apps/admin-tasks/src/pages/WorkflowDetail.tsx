// Workflow detail — eleven tabs, one shell. The route enumerates each
// tab as its own URL so deep links work and the Tabs component is
// driven by the active tab prop. Engine-gated tabs render an honest
// empty state with a forward-pointing hint instead of inventing rows.

import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Button,
  Card,
  H1,
  Spinner,
  Tabs,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { History } from '@hanzogui/lucide-icons-2/icons/History'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Alert, Badge, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { ApiError, apiPost, shortStatus, statusVariant } from '../lib/api'
import type { WorkflowExecution } from '../lib/api'
import { useTaskEvents } from '../lib/events'
import { WorkflowActionMenu } from '../components/workflow/WorkflowActionMenu'
import { WorkflowStatusPill } from '../components/workflow/WorkflowStatusPill'
import { HistoryStrip } from './workflow-tabs/HistoryStrip'
import { JsonPane } from './workflow-tabs/JsonPane'
import { NexusLinksPane } from './workflow-tabs/NexusLinksPane'
import { PendingActivitiesPane } from './workflow-tabs/PendingActivitiesPane'
import { PendingNexusPane } from './workflow-tabs/PendingNexusPane'
import { QueriesPane } from './workflow-tabs/QueriesPane'
import { RelationshipsPane } from './workflow-tabs/RelationshipsPane'
import { TimelinePane } from './workflow-tabs/TimelinePane'
import { UserMetadataPane } from './workflow-tabs/UserMetadataPane'
import { WorkersPane } from './workflow-tabs/WorkersPane'

interface DescribeResp {
  workflowExecutionInfo: WorkflowExecution
  executionConfig?: {
    taskQueue?: { name: string }
    workflowRunTimeout?: string
    workflowTaskTimeout?: string
  }
}

export type WorkflowTab =
  | 'summary'
  | 'call-stack'
  | 'history'
  | 'timeline'
  | 'pending-activities'
  | 'pending-nexus'
  | 'workers'
  | 'query'
  | 'memo'
  | 'search-attributes'
  | 'user-metadata'
  | 'relationships'
  | 'nexus-links'

interface TabSpec {
  value: WorkflowTab
  label: string
  // Returns the count badge content. Undefined means no badge.
  // Zero is rendered (matches upstream Workers '0' / Pending '0').
  count?: (wf: WorkflowExecution) => number | undefined
}

const TABS: TabSpec[] = [
  { value: 'summary', label: 'Summary' },
  { value: 'call-stack', label: 'Call stack' },
  { value: 'history', label: 'History', count: (wf) => wf.historyLength ?? 0 },
  { value: 'timeline', label: 'Timeline' },
  {
    value: 'pending-activities',
    label: 'Pending activities',
    count: (wf) => wf.pendingActivities?.length ?? 0,
  },
  {
    value: 'pending-nexus',
    label: 'Pending nexus',
    count: (wf) => wf.pendingNexusOperations?.length ?? 0,
  },
  { value: 'workers', label: 'Workers', count: () => 0 },
  { value: 'query', label: 'Queries' },
  { value: 'memo', label: 'Memo' },
  { value: 'search-attributes', label: 'Search attributes' },
  { value: 'user-metadata', label: 'User metadata' },
  {
    value: 'relationships',
    label: 'Relationships',
    count: (wf) =>
      (wf.parentExecution ? 1 : 0) + (wf.rootExecution ? 1 : 0),
  },
  {
    value: 'nexus-links',
    label: 'Nexus links',
    count: (wf) => wf.pendingNexusOperations?.length ?? 0,
  },
]

export function WorkflowDetailPage({ tab = 'summary' }: { tab?: WorkflowTab } = {}) {
  const { ns, workflowId } = useParams()
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const runId = sp.get('runId') ?? ''
  const namespace = ns!
  const qs = new URLSearchParams({
    'execution.workflowId': workflowId!,
    'execution.runId': runId,
  }).toString()
  const url = `/v1/tasks/namespaces/${encodeURIComponent(namespace)}/workflows/${encodeURIComponent(workflowId!)}?${qs}`
  const { data, error, isLoading, mutate } = useFetch<DescribeResp>(url)

  useTaskEvents(namespace, () => void mutate(), [
    'workflow.canceled',
    'workflow.terminated',
    'workflow.signaled',
  ])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const wf = data.workflowExecutionInfo
  const runQs = runId ? `?runId=${encodeURIComponent(runId)}` : ''
  const taskQueue = wf.taskQueue ?? data.executionConfig?.taskQueue?.name
  const isRunning = wf.status === 'WORKFLOW_EXECUTION_STATUS_RUNNING'

  const baseHref = `/namespaces/${encodeURIComponent(namespace)}/workflows/${encodeURIComponent(wf.execution.workflowId)}`

  const onTabChange = (v: string) => {
    const next = v as WorkflowTab
    const path = next === 'summary' ? baseHref : `${baseHref}/${next}`
    navigate(`${path}${runQs}`, { replace: false })
  }

  return (
    <YStack gap="$5">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}/workflows`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            workflows
          </Text>
        </XStack>
      </Link>

      <XStack items="flex-start" justify="space-between" gap="$3">
        <YStack gap="$1" flex={1}>
          <XStack items="center" gap="$3" flexWrap="wrap">
            <H1 size="$7" color="$color" fontWeight="600">
              {wf.execution.workflowId}
            </H1>
            <WorkflowStatusPill status={String(wf.status)} />
          </XStack>
          <Text
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$2"
            color="$placeholderColor"
          >
            {wf.execution.runId}
          </Text>
        </YStack>
        <XStack gap="$2" items="center">
          <WorkflowActionMenu
            ns={namespace}
            workflowId={wf.execution.workflowId}
            runId={wf.execution.runId}
            status={String(wf.status)}
            onChanged={() => void mutate()}
          />
          <Link to={`${baseHref}/history${runQs}`} style={{ textDecoration: 'none' }}>
            <Button size="$2" borderWidth={1} borderColor="$borderColor">
              <XStack items="center" gap="$1.5">
                <History size={14} />
                <Text fontSize="$2">Full history</Text>
              </XStack>
            </Button>
          </Link>
        </XStack>
      </XStack>

      <HistoryStrip
        ns={namespace}
        workflowId={wf.execution.workflowId}
        runId={wf.execution.runId}
      />

      <Tabs
        value={tab}
        onValueChange={onTabChange}
        orientation="horizontal"
        flexDirection="column"
      >
        <Tabs.List
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          gap="$2"
          self="flex-start"
          flexWrap="wrap"
        >
          {TABS.map((t) => (
            <TabTrigger
              key={t.value}
              value={t.value}
              active={t.value === tab}
              count={t.count ? t.count(wf) : undefined}
            >
              {t.label}
            </TabTrigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="summary" mt="$4">
          <SummaryPane
            wf={wf}
            namespace={namespace}
            taskQueue={taskQueue}
            baseHref={baseHref}
            runQs={runQs}
          />
        </Tabs.Content>

        <Tabs.Content value="call-stack" mt="$4">
          <CallStackPane
            ns={namespace}
            workflowId={wf.execution.workflowId}
            runId={wf.execution.runId}
            running={isRunning}
          />
        </Tabs.Content>

        <Tabs.Content value="history" mt="$4">
          <HistoryRedirectPane baseHref={baseHref} runQs={runQs} />
        </Tabs.Content>

        <Tabs.Content value="timeline" mt="$4">
          <TimelinePane wf={wf} ns={namespace} />
        </Tabs.Content>

        <Tabs.Content value="pending-activities" mt="$4">
          <PendingActivitiesPane wf={wf} />
        </Tabs.Content>

        <Tabs.Content value="pending-nexus" mt="$4">
          <PendingNexusPane wf={wf} ns={namespace} />
        </Tabs.Content>

        <Tabs.Content value="workers" mt="$4">
          <WorkersPane ns={namespace} taskQueue={taskQueue} />
        </Tabs.Content>

        <Tabs.Content value="query" mt="$4">
          <QueriesPane
            ns={namespace}
            workflowId={wf.execution.workflowId}
            runId={wf.execution.runId}
            running={isRunning}
          />
        </Tabs.Content>

        <Tabs.Content value="memo" mt="$4">
          <JsonPane
            data={wf.memo}
            emptyTitle="No memo on this workflow"
            emptyHint="Memo is a free-form key/value bag attached at Start. The engine surfaces it verbatim once the worker SDK records it."
          />
        </Tabs.Content>

        <Tabs.Content value="search-attributes" mt="$4">
          <JsonPane
            data={wf.searchAttrs}
            emptyTitle="No search attributes"
            emptyHint="Search attributes power the visibility filter language. The engine doesn't yet index them — they will appear here verbatim once recorded."
          />
        </Tabs.Content>

        <Tabs.Content value="user-metadata" mt="$4">
          <UserMetadataPane wf={wf} />
        </Tabs.Content>

        <Tabs.Content value="relationships" mt="$4">
          <RelationshipsPane ns={namespace} wf={wf} />
        </Tabs.Content>

        <Tabs.Content value="nexus-links" mt="$4">
          <NexusLinksPane ns={namespace} wf={wf} />
        </Tabs.Content>
      </Tabs>
    </YStack>
  )
}

function TabTrigger({
  value,
  active,
  count,
  children,
}: {
  value: string
  active: boolean
  count?: number
  children: React.ReactNode
}) {
  return (
    <Tabs.Tab
      value={value}
      px="$3"
      py="$2"
      unstyled
      bg="transparent"
      borderBottomWidth={2}
      borderBottomColor={active ? ('#86efac' as never) : ('transparent' as never)}
    >
      <XStack items="center" gap="$1.5">
        <Text fontSize="$2" color={active ? '$color' : '$placeholderColor'}>
          {children}
        </Text>
        {count !== undefined ? (
          <Badge variant="muted">{count}</Badge>
        ) : null}
      </XStack>
    </Tabs.Tab>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <XStack items="center" gap="$3">
      <Text width={140} fontSize="$2" color="$placeholderColor">
        {label}
      </Text>
      <YStack flex={1}>{children}</YStack>
    </XStack>
  )
}

function SummaryPane({
  wf,
  namespace,
  taskQueue,
  baseHref,
  runQs,
}: {
  wf: WorkflowExecution
  namespace: string
  taskQueue?: string
  baseHref: string
  runQs: string
}) {
  const isRunning = wf.status === 'WORKFLOW_EXECUTION_STATUS_RUNNING'
  return (
    <YStack gap="$4">
      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <Field label="Type">{wf.type.name}</Field>
          <Field label="Status">
            <Badge variant={statusVariant(wf.status)}>{shortStatus(wf.status)}</Badge>
          </Field>
          <Field label="Task queue">
            {taskQueue ? (
              <Link
                to={`/namespaces/${encodeURIComponent(namespace)}/task-queues/${encodeURIComponent(taskQueue)}`}
                style={{ textDecoration: 'none' }}
              >
                <Text fontSize="$2" color={'#86efac' as never}>
                  {taskQueue}
                </Text>
              </Link>
            ) : (
              <Text fontSize="$2" color="$color">
                —
              </Text>
            )}
          </Field>
          <Field label="History events">
            <Text fontSize="$2" color="$color">
              {wf.historyLength ?? '—'}
            </Text>
          </Field>
          <Field label="Started">
            <Text fontSize="$2" color="$color">
              {wf.startTime ? new Date(wf.startTime).toLocaleString() : '—'}
            </Text>
          </Field>
          <Field label="Closed">
            <Text fontSize="$2" color="$color">
              {wf.closeTime ? new Date(wf.closeTime).toLocaleString() : 'running'}
            </Text>
          </Field>
          <Field label="Full history">
            <Link to={`${baseHref}/history${runQs}`} style={{ textDecoration: 'none' }}>
              <Text fontSize="$2" color={'#86efac' as never}>
                Open full history
              </Text>
            </Link>
          </Field>
        </YStack>
      </Card>

      <XStack gap="$4" flexWrap="wrap">
        <PayloadPanel
          title="Input"
          data={wf.input}
          emptyText="No input"
          flex={1}
          minW={320}
        />
        <PayloadPanel
          title="Result"
          data={wf.result}
          emptyText={isRunning ? 'Workflow still running' : 'No result'}
          flex={1}
          minW={320}
        />
      </XStack>
    </YStack>
  )
}

function PayloadPanel({
  title,
  data,
  emptyText,
  flex,
  minW,
}: {
  title: string
  data: unknown
  emptyText: string
  flex?: number
  minW?: number
}) {
  const present =
    data !== null &&
    data !== undefined &&
    !(typeof data === 'object' && Object.keys(data as object).length === 0)
  return (
    <Card
      p="$4"
      bg="$background"
      borderColor="$borderColor"
      borderWidth={1}
      flex={flex}
      minW={minW}
      gap="$2"
    >
      <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
        {title.toUpperCase()}
      </Text>
      {present ? (
        <YStack
          bg={'rgba(255,255,255,0.02)' as never}
          p="$2"
          rounded="$2"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <Text
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$1"
            color="$color"
          >
            {JSON.stringify(data, null, 2)}
          </Text>
        </YStack>
      ) : (
        <Text fontSize="$2" color="$placeholderColor">
          {emptyText}
        </Text>
      )}
    </Card>
  )
}

function HistoryRedirectPane({ baseHref, runQs }: { baseHref: string; runQs: string }) {
  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$3">
        <Text fontSize="$2" color="$placeholderColor">
          The full event timeline lives on its own page so it can paginate
          large histories without crowding the summary.
        </Text>
        <Link to={`${baseHref}/history${runQs}`} style={{ textDecoration: 'none' }}>
          <XStack items="center" gap="$1.5">
            <History size={14} color="#86efac" />
            <Text fontSize="$2" color={'#86efac' as never}>
              Open full history
            </Text>
          </XStack>
        </Link>
      </YStack>
    </Card>
  )
}

function CallStackPane({
  ns,
  workflowId,
  runId,
  running,
}: {
  ns: string
  workflowId: string
  runId: string
  running: boolean
}) {
  const [stack, setStack] = useState<string | null>(null)
  const [err, setErr] = useState<{ status: number; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    setErr(null)
    setStack(null)
    try {
      const resp = await apiPost<{ stack?: string }>(
        `/v1/tasks/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(workflowId)}/query?runId=${encodeURIComponent(runId)}`,
        { queryType: '__stack_trace' },
      )
      setStack(resp?.stack ?? '')
    } catch (e) {
      if (e instanceof ApiError) {
        setErr({ status: e.status, message: e.message })
      } else {
        setErr({ status: 0, message: e instanceof Error ? e.message : String(e) })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!running) {
    return (
      <Alert title="Stack trace requires a running workflow">
        This workflow is not running, so there is no live stack trace to query.
        Re-open while the workflow is in progress to capture a snapshot.
      </Alert>
    )
  }

  return (
    <YStack gap="$3">
      <XStack items="center" justify="space-between">
        <Text fontSize="$2" color="$placeholderColor">
          Calls QueryWorkflow(__stack_trace) on the worker.
        </Text>
        <Button size="$2" chromeless onPress={load} disabled={loading}>
          <XStack items="center" gap="$1.5">
            {loading ? <Spinner size="small" /> : <RefreshCw size={14} color="#7e8794" />}
            <Text fontSize="$2">{loading ? 'Querying…' : 'Capture stack'}</Text>
          </XStack>
        </Button>
      </XStack>

      {err ? (
        err.status === 501 ? (
          <Alert title="Worker SDK runtime not yet shipped">
            Stack-trace queries land when the worker SDK runtime ships. Until then
            the engine returns 501 — that's the honest answer rather than a
            fabricated frame.
          </Alert>
        ) : (
          <Alert variant="destructive" title="Query failed">
            {err.message}
          </Alert>
        )
      ) : stack !== null ? (
        stack ? (
          <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
            <Text
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              fontSize="$1"
              color="$color"
            >
              {stack}
            </Text>
          </Card>
        ) : (
          <Alert title="Empty stack">
            The worker returned an empty stack — the workflow may be parked
            between activities.
          </Alert>
        )
      ) : (
        <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <Text fontSize="$2" color="$placeholderColor">
            Click Capture stack to query the worker.
          </Text>
        </Card>
      )}
    </YStack>
  )
}
