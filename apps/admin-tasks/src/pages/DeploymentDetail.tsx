// DeploymentDetail — versions list with "Set current" action. Shows
// drift (current vs latest) and ramping state when present.

import { useCallback, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, H1, H3, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import {
  Badge,
  Empty,
  ErrorState,
  LoadingState,
  SummaryCard,
  formatTimestamp,
  useFetch,
} from '@hanzogui/admin'
import {
  Deployments,
  TaskQueues,
  ApiError,
  type Deployment,
} from '../lib/api'
import { VersionTable } from '../components/deployment/VersionTable'
import { SetCurrentDialog } from '../components/deployment/SetCurrentDialog'

interface TaskQueuesListResp {
  taskQueues?: Array<{ name: string; deployment?: string }>
}

export function DeploymentDetailPage() {
  const { ns, name } = useParams()
  const namespace = ns!
  const series = decodeURIComponent(name!)

  const detailUrl = Deployments.describeUrl(namespace, series)
  const { data, error, isLoading, mutate } = useFetch<Deployment>(detailUrl)

  // Best-effort: pull task queues to estimate impact.
  const { data: queuesResp } = useFetch<TaskQueuesListResp>(TaskQueues.listUrl(namespace))

  const [pending, setPending] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [dialogError, setDialogError] = useState<string | undefined>(undefined)

  const impactedQueues = useMemo(() => {
    const all = queuesResp?.taskQueues ?? []
    const matches = all.filter((q) => q.deployment === series).map((q) => q.name)
    return matches
  }, [queuesResp, series])

  const onSetCurrent = useCallback((buildId: string) => {
    setPending(buildId)
    setDialogError(undefined)
  }, [])

  const onConfirm = useCallback(async () => {
    if (!pending) return
    setBusy(true)
    setDialogError(undefined)
    try {
      await Deployments.setCurrent(namespace, series, pending)
      setPending(null)
      await mutate()
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.status === 501
            ? 'Backend does not yet implement set-current (501).'
            : e.message
          : e instanceof Error
            ? e.message
            : String(e)
      setDialogError(msg)
    } finally {
      setBusy(false)
    }
  }, [pending, namespace, series, mutate])

  const onCancel = useCallback(() => {
    if (busy) return
    setPending(null)
    setDialogError(undefined)
  }, [busy])

  const onUnsetCurrent = useCallback(async () => {
    if (!data?.defaultBuildId) return
    if (
      !confirm(
        `Clear current build "${data.defaultBuildId}" for ${series}? Routing falls back to the worker's default until you set another current.`,
      )
    )
      return
    setBusy(true)
    try {
      await Deployments.unsetCurrent(namespace, series)
      await mutate()
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.status === 501
            ? 'Engine does not implement set-current yet (cannot clear).'
            : e.message
          : e instanceof Error
            ? e.message
            : String(e)
      setDialogError(msg)
    } finally {
      setBusy(false)
    }
  }, [data?.defaultBuildId, namespace, series, mutate])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const buildIds = data.buildIds ?? []
  const ramping = buildIds.find((b) => String(b.state).includes('RAMPING') || String(b.state) === 'Ramping')
  const latest = buildIds.length > 0 ? buildIds[buildIds.length - 1] : undefined
  const drift = latest && data.defaultBuildId && latest.buildId !== data.defaultBuildId

  return (
    <YStack gap="$5">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}/deployments`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">deployments</Text>
        </XStack>
      </Link>

      <YStack gap="$1">
        <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
          DEPLOYMENT
        </Text>
        <XStack items="center" gap="$3" flexWrap="wrap">
          <H1 size="$7" color="$color" fontWeight="600">{data.seriesName}</H1>
          {ramping ? <Badge variant="warning">ramping</Badge> : null}
          {drift ? <Badge variant="info">drift</Badge> : null}
        </XStack>
        {data.createTime ? (
          <Text fontSize="$1" color="$placeholderColor">
            created {formatTimestamp(new Date(data.createTime))}
          </Text>
        ) : null}
      </YStack>

      <XStack gap="$3" flexWrap="wrap">
        <SummaryCard label="Versions" value={buildIds.length} />
        <SummaryCard
          label="Current"
          value={data.defaultBuildId ? 1 : 0}
          accent={data.defaultBuildId ? 'success' : 'muted'}
        />
        <SummaryCard label="Ramping" value={ramping ? 1 : 0} accent={ramping ? 'success' : 'muted'} />
        <SummaryCard label="Task queues" value={impactedQueues.length} accent="default" />
      </XStack>

      <Section title={`Versions (${buildIds.length})`}>
        {buildIds.length === 0 ? (
          <Empty
            title="No build IDs registered"
            hint="A build ID lands when a worker connects with that series + version."
          />
        ) : (
          <VersionTable
            buildIds={buildIds}
            defaultBuildId={data.defaultBuildId}
            onSetCurrent={onSetCurrent}
            onUnsetCurrent={data.defaultBuildId ? onUnsetCurrent : undefined}
            busy={busy}
          />
        )}
      </Section>

      {drift ? (
        <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1} gap="$1">
          <Text fontSize="$2" color="$color">
            Latest build differs from current.
          </Text>
          <Text fontSize="$1" color="$placeholderColor">
            current{' '}
            <Text fontFamily={'ui-monospace, SFMono-Regular, monospace' as never} color="$color">
              {data.defaultBuildId}
            </Text>{' '}
            ↔ latest{' '}
            <Text fontFamily={'ui-monospace, SFMono-Regular, monospace' as never} color="$color">
              {latest!.buildId}
            </Text>
          </Text>
        </Card>
      ) : null}

      <Section title={`Impacted task queues (${impactedQueues.length})`}>
        {impactedQueues.length === 0 ? (
          <Empty
            title="No task queues attached"
            hint="A task queue is impacted when a poller registers under this series."
          />
        ) : (
          <YStack gap="$2">
            {impactedQueues.map((q) => (
              <Link
                key={q}
                to={`/namespaces/${encodeURIComponent(namespace)}/task-queues/${encodeURIComponent(q)}`}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  p="$3"
                  bg="$background"
                  borderColor="$borderColor"
                  borderWidth={1}
                  hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
                >
                  <Text fontSize="$2" color={'#86efac' as never}>{q}</Text>
                </Card>
              </Link>
            ))}
          </YStack>
        )}
      </Section>

      <SetCurrentDialog
        deploymentName={data.seriesName}
        currentBuildId={data.defaultBuildId}
        proposedBuildId={pending ?? ''}
        impactedTaskQueues={impactedQueues}
        open={pending !== null}
        busy={busy}
        error={dialogError}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
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
