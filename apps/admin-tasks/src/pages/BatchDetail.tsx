// BatchDetail — header (kind + state + identity + reason), progress
// bar, terminate button (when running), per-execution table. Polls
// the describe endpoint every 5s while progress < 100%, matching the
// upstream Svelte page. The matched-executions list is fetched via
// the workflows visibility query saved on the batch record.

import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, H1, H4, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Square } from '@hanzogui/lucide-icons-2/icons/Square'
import { Alert, Badge, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { ApiError, Batches, Workflows } from '../lib/api'
import type { BatchOperation, WorkflowExecution } from '../lib/api'
import { BatchKindIcon, batchKindLabel } from '../components/batch/BatchKindIcon'
import { BatchProgress } from '../components/batch/BatchProgress'
import { BatchExecutionsTable } from '../components/batch/BatchExecutionsTable'

const POLL_MS = 5000

export function BatchDetailPage() {
  const { ns, batchId } = useParams()
  const namespace = ns!
  const id = batchId!
  const url = `/v1/tasks/namespaces/${encodeURIComponent(namespace)}/batches/${encodeURIComponent(id)}`
  const { data, error, isLoading, mutate } = useFetch<BatchOperation>(url)

  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [execErr, setExecErr] = useState<string | null>(null)
  const [terminating, setTerminating] = useState(false)
  const [termErr, setTermErr] = useState<string | null>(null)

  const total = Number(data?.totalOperationCount ?? 0)
  const done = Number(data?.completeOperationCount ?? 0)
  const failed = Number(data?.failureOperationCount ?? 0)
  const pct = total === 0 ? 0 : ((done + failed) / total) * 100
  const isRunning = data?.state === 'Running' || String(data?.state).endsWith('RUNNING')

  // 5s polling while progress < 100%.
  useEffect(() => {
    if (!data || !isRunning || pct >= 100) return
    const t = window.setInterval(() => {
      void mutate()
    }, POLL_MS)
    return () => window.clearInterval(t)
  }, [data, isRunning, pct, mutate])

  // Load matched executions via the saved query. Shaped same as
  // Workflows list — no separate visibility endpoint for batches.
  useEffect(() => {
    if (!data?.query) return
    let cancelled = false
    ;(async () => {
      try {
        const cursor = await Workflows.list(namespace, { query: data.query, pageSize: 50 })
        if (cancelled) return
        setExecutions(cursor.data.executions ?? [])
        setExecErr(null)
      } catch (e) {
        if (cancelled) return
        setExecErr(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [namespace, data?.query])

  const onTerminate = useCallback(async () => {
    if (
      !confirm(
        `Terminate batch ${id}? In-flight per-execution operations finish; queued operations are dropped.`,
      )
    )
      return
    setTerminating(true)
    setTermErr(null)
    try {
      await Batches.terminate(namespace, id, 'terminated from console')
      await mutate()
    } catch (e) {
      if (e instanceof ApiError) {
        setTermErr(`${e.status === 501 ? 'Not yet implemented in native server' : 'Failed'}: ${e.message}`)
      } else {
        setTermErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setTerminating(false)
    }
  }, [namespace, id, mutate])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <Link
          to={`/namespaces/${encodeURIComponent(namespace)}/batches`}
          style={{ textDecoration: 'none' }}
        >
          <XStack items="center" gap="$1">
            <ChevronLeft size={14} color="#7e8794" />
            <Text fontSize="$2" color="$placeholderColor">
              Batches
            </Text>
          </XStack>
        </Link>
        {isRunning ? (
          <Button
            size="$3"
            onPress={onTerminate}
            disabled={terminating}
            bg={'#7f1d1d' as never}
            hoverStyle={{ background: '#991b1b' as never }}
          >
            <XStack items="center" gap="$1.5">
              {terminating ? <Spinner size="small" /> : <Square size={14} color="#fff" />}
              <Text fontSize="$2" fontWeight="500" color={'#fff' as never}>
                {terminating ? 'Terminating…' : 'Terminate batch'}
              </Text>
            </XStack>
          </Button>
        ) : null}
      </XStack>

      <YStack gap="$2">
        <XStack items="center" gap="$2">
          <BatchKindIcon kind={data.operation || data.operationType || ''} size={20} />
          <H1 size="$8" color="$color">
            {batchKindLabel(data.operation || data.operationType || '')} batch
          </H1>
          <Badge variant={isRunning ? 'info' : data.state === 'Failed' ? 'destructive' : 'success'}>
            {String(data.state).replace(/^BATCH_OPERATION_STATE_/, '').toLowerCase()}
          </Badge>
        </XStack>
        <Text
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$2"
          color="$placeholderColor"
        >
          {data.batchId || data.jobId}
        </Text>
      </YStack>

      {termErr ? (
        <Alert variant="destructive" title="Could not terminate batch">
          {termErr}
        </Alert>
      ) : null}

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <H4 size="$3" color="$color">
            Progress
          </H4>
          <BatchProgress total={total} completed={done} failed={failed} height={10} />
        </YStack>
      </Card>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Details
          </H4>
          <Row label="Identity" value={data.identity || '—'} mono />
          <Row label="Reason" value={data.reason || '—'} />
          <Row label="Visibility query" value={data.query || '—'} mono />
          <Row
            label="Started"
            value={data.startTime ? new Date(data.startTime).toLocaleString() : '—'}
          />
          <Row
            label="Closed"
            value={data.closeTime ? new Date(data.closeTime).toLocaleString() : '—'}
          />
        </YStack>
      </Card>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <H4 size="$3" color="$color">
            Impacted executions
          </H4>
          {execErr ? (
            <Alert variant="destructive" title="Could not load executions">
              {execErr}
            </Alert>
          ) : null}
          <BatchExecutionsTable
            ns={namespace}
            rows={executions}
            emptyTitle="No executions match this batch's visibility query"
          />
        </YStack>
      </Card>
    </YStack>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <XStack gap="$3" py="$1" borderBottomWidth={1} borderBottomColor="$borderColor">
      <YStack flex={1.2}>
        <Text fontSize="$1" color="$placeholderColor" fontWeight="500">
          {label}
        </Text>
      </YStack>
      <YStack flex={4}>
        <Text
          fontSize="$2"
          color="$color"
          fontFamily={mono ? ('ui-monospace, SFMono-Regular, monospace' as never) : undefined}
        >
          {value}
        </Text>
      </YStack>
    </XStack>
  )
}
