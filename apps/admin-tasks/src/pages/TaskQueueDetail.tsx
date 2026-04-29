// Task queue detail — pollers, backlog stats, build-id versioning,
// partitions table. Partitions poll every 10s while open.

import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, H1, H3, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import {
  Alert,
  Badge,
  Empty,
  ErrorState,
  LoadingState,
  SummaryCard,
  formatTimestamp,
  useFetch,
} from '@hanzogui/admin'
import { TaskQueues, type WorkflowExecution, type Worker } from '../lib/api'
import type { DescribeTaskQueueResponse, TaskQueuePartition } from '../lib/types'
import { shortStatus, statusVariant } from '../lib/api'
import { useTaskEvents } from '../lib/events'
import { PollerTable } from '../components/task-queue/PollerTable'
import { PartitionsTable, type PartitionRow } from '../components/task-queue/PartitionsTable'

interface DetailResp extends Partial<DescribeTaskQueueResponse> {
  name: string
  kind?: string
  workflows: WorkflowExecution[]
  running: number
  total: number
  backlog?: number
  pollers?: Worker[]
}

interface PartitionsResp {
  partitions?: PartitionRow[]
}

const POLL_MS = 10_000

export function TaskQueueDetailPage() {
  const { ns, queue } = useParams()
  const namespace = ns!
  const queueName = decodeURIComponent(queue!)

  const detailUrl = TaskQueues.describeUrl(namespace, queueName)
  const partitionsUrl = TaskQueues.partitionsUrl(namespace, queueName)

  const { data, error, isLoading, mutate } = useFetch<DetailResp>(detailUrl)

  const [partitions, setPartitions] = useState<PartitionRow[]>([])
  const [partsErr, setPartsErr] = useState<string | null>(null)

  const refreshPartitions = useCallback(async () => {
    try {
      const res = await fetch(partitionsUrl, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) {
        // 501 / 404 — endpoint not yet wired. Stay silent.
        if (res.status === 501 || res.status === 404) {
          setPartitions([])
          setPartsErr(null)
          return
        }
        throw new Error(`HTTP ${res.status}`)
      }
      const body = (await res.json()) as PartitionsResp
      setPartitions(body.partitions ?? [])
      setPartsErr(null)
    } catch (e) {
      setPartsErr(e instanceof Error ? e.message : String(e))
    }
  }, [partitionsUrl])

  // Poll partitions every 10s while mounted.
  useEffect(() => {
    void refreshPartitions()
    const id = setInterval(() => void refreshPartitions(), POLL_MS)
    return () => clearInterval(id)
  }, [refreshPartitions])

  useTaskEvents(namespace, useCallback(() => void mutate(), [mutate]), [
    'workflow.started',
    'workflow.canceled',
    'workflow.terminated',
  ])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const rows = data.workflows ?? []
  const pollers = data.pollers ?? data.taskQueueStatus ? data.pollers ?? [] : []
  const versioning = data.versioningInfo
  const backlog = data.backlog ?? Number(data.taskQueueStatus?.backlogCountHint ?? 0)

  return (
    <YStack gap="$5">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}/task-queues`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">task queues</Text>
        </XStack>
      </Link>

      <YStack gap="$1">
        <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
          TASK QUEUE
        </Text>
        <XStack items="center" gap="$3" flexWrap="wrap">
          <H1 size="$7" color="$color" fontWeight="600">{data.name}</H1>
          {data.kind ? <Badge variant="muted">{data.kind}</Badge> : null}
        </XStack>
      </YStack>

      <XStack gap="$3" flexWrap="wrap">
        <SummaryCard label="Total workflows" value={data.total} />
        <SummaryCard label="Running" value={data.running} accent="success" />
        <SummaryCard label="Closed" value={Math.max(0, data.total - data.running)} accent="muted" />
        <SummaryCard label="Backlog" value={backlog} accent={backlog > 0 ? 'success' : 'muted'} />
        <SummaryCard label="Pollers" value={pollers.length} accent="default" />
        <SummaryCard label="Partitions" value={partitions.length} accent="default" />
      </XStack>

      <Section title="Pollers">
        <PollerTable pollers={pollers} />
      </Section>

      <Section title="Partitions">
        {partsErr ? (
          <Alert title="Partition stats unavailable">{partsErr}</Alert>
        ) : (
          <PartitionsTable partitions={partitions} />
        )}
      </Section>

      <Section title="Versioning">
        {versioning ? (
          <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1} gap="$1">
            {versioning.behavior ? (
              <Row k="behavior" v={versioning.behavior} />
            ) : null}
            {versioning.deploymentVersion?.deploymentName ? (
              <Row
                k="deployment"
                v={versioning.deploymentVersion.deploymentName}
                href={`/namespaces/${encodeURIComponent(namespace)}/deployments/${encodeURIComponent(versioning.deploymentVersion.deploymentName)}`}
              />
            ) : null}
            {versioning.deploymentVersion?.buildId ? (
              <Row k="build" v={versioning.deploymentVersion.buildId} mono />
            ) : null}
            {versioning.version ? <Row k="version" v={versioning.version} mono /> : null}
          </Card>
        ) : (
          <Empty
            title="No versioning ruleset"
            hint="Build-ID routing applies once a worker registers a deployment series."
          />
        )}
      </Section>

      <Section title={`Workflows on this queue (${rows.length})`}>
        {rows.length === 0 ? (
          <Empty
            title={`No workflows targeting ${data.name}`}
            hint="Workflows are bucketed by their taskQueue field on start."
          />
        ) : (
          <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
            <XStack
              bg={'rgba(255,255,255,0.03)' as never}
              px="$4"
              py="$2.5"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <HeaderCell flex={1.2}>Status</HeaderCell>
              <HeaderCell flex={3}>Workflow ID</HeaderCell>
              <HeaderCell flex={2}>Type</HeaderCell>
              <HeaderCell flex={2}>Start</HeaderCell>
            </XStack>
            {(() => {
              const last = rows.length - 1
              return rows.map((wf, i) => (
                <XStack
                  key={`${wf.execution.workflowId}-${wf.execution.runId}`}
                  px="$4"
                  py="$2.5"
                  borderBottomWidth={i === last ? 0 : 1}
                  borderBottomColor="$borderColor"
                  hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
                  items="center"
                >
                  <YStack flex={1.2} px="$2">
                    <Badge variant={statusVariant(wf.status)}>{shortStatus(wf.status)}</Badge>
                  </YStack>
                  <YStack flex={3} px="$2">
                    <Link
                      to={`/namespaces/${encodeURIComponent(namespace)}/workflows/${encodeURIComponent(wf.execution.workflowId)}?runId=${encodeURIComponent(wf.execution.runId)}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Text fontSize="$2" color={'#86efac' as never} numberOfLines={1}>
                        {wf.execution.workflowId}
                      </Text>
                    </Link>
                  </YStack>
                  <YStack flex={2} px="$2">
                    <Text fontSize="$2" color="$color">{wf.type.name}</Text>
                  </YStack>
                  <YStack flex={2} px="$2">
                    <Text fontSize="$2" color="$placeholderColor">
                      {wf.startTime ? formatTimestamp(new Date(wf.startTime)) : '—'}
                    </Text>
                  </YStack>
                </XStack>
              ))
            })()}
          </Card>
        )}
      </Section>
    </YStack>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <YStack gap="$2">
      <H3 size="$5" color="$color" fontWeight="500">{title}</H3>
      {children}
    </YStack>
  )
}

function Row({ k, v, mono, href }: { k: string; v: string; mono?: boolean; href?: string }) {
  const value = (
    <Text
      fontSize="$2"
      color="$color"
      fontFamily={mono ? ('ui-monospace, SFMono-Regular, monospace' as never) : undefined}
      numberOfLines={1}
    >
      {v}
    </Text>
  )
  return (
    <XStack items="center" justify="space-between" gap="$2">
      <Text fontSize="$1" color="$placeholderColor">{k}</Text>
      {href ? (
        <Link to={href} style={{ textDecoration: 'none' }}>
          <Text fontSize="$2" color={'#86efac' as never}>{v}</Text>
        </Link>
      ) : (
        value
      )}
    </XStack>
  )
}

function HeaderCell({ children, flex }: { children: React.ReactNode; flex: number }) {
  return (
    <YStack flex={flex} px="$2">
      <Text fontSize="$1" fontWeight="500" color="$placeholderColor">
        {children}
      </Text>
    </YStack>
  )
}

// reference TaskQueuePartition for type completion in case future work
// promotes the local PartitionRow shape back to the wire type.
void (null as unknown as TaskQueuePartition | null)
