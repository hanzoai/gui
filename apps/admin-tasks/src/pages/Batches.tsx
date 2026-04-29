// Batches — list of bulk operations across workflow executions.
// Replaces the foundation placeholder. Each row shows the kind icon,
// state badge, started-by identity, and a progress bar measuring
// completed/total. Create flow lives on a dedicated /batches/create
// page (BatchCreate); the list page only links to it.

import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, H2, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import {
  Badge,
  DataTable,
  ErrorState,
  LoadingState,
  useFetch,
} from '@hanzogui/admin'
import type { BatchOperation } from '../lib/api'
import { useTaskEvents } from '../lib/events'
import { BatchKindIcon, batchKindLabel } from '../components/batch/BatchKindIcon'
import { BatchProgress } from '../components/batch/BatchProgress'

interface ListResp {
  batches?: BatchOperation[]
  operationInfo?: BatchOperation[]
}

const COLUMNS = [
  { key: 'kind', label: 'Kind', flex: 1.4 },
  { key: 'state', label: 'State', flex: 1 },
  { key: 'job', label: 'Batch ID', flex: 2.5 },
  { key: 'progress', label: 'Progress', flex: 2 },
  { key: 'identity', label: 'Started by', flex: 1.6 },
  { key: 'start', label: 'Started', flex: 1.6 },
]

function stateVariant(state: string): 'success' | 'info' | 'destructive' | 'muted' {
  const norm = state.replace(/^BATCH_OPERATION_STATE_/, '').toUpperCase()
  if (norm.startsWith('COMPLETE')) return 'success'
  if (norm.startsWith('RUN')) return 'info'
  if (norm.startsWith('FAIL')) return 'destructive'
  return 'muted'
}

function shortState(state: string): string {
  return state.replace(/^BATCH_OPERATION_STATE_/, '').toLowerCase()
}

export function BatchesPage() {
  const { ns } = useParams()
  const namespace = ns!
  const url = `/v1/tasks/namespaces/${encodeURIComponent(namespace)}/batches`
  const { data, error, isLoading, mutate } = useFetch<ListResp>(url)

  const onEvent = useCallback(() => {
    void mutate()
  }, [mutate])

  useTaskEvents(namespace, onEvent, ['batch.started'])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />

  const rows = data?.batches ?? data?.operationInfo ?? []

  return (
    <YStack gap="$4">
      <XStack items="baseline" justify="space-between">
        <H2 size="$7" color="$color">
          Batches{' '}
          <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
            ({rows.length})
          </Text>
        </H2>
        <Link
          to={`/namespaces/${encodeURIComponent(namespace)}/batches/create`}
          style={{ textDecoration: 'none' }}
        >
          <Button size="$3" bg={'#f2f2f2' as never} hoverStyle={{ background: '#ffffff' as never }}>
            <XStack items="center" gap="$1.5">
              <Plus size={14} color="#070b13" />
              <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
                Start Batch
              </Text>
            </XStack>
          </Button>
        </Link>
      </XStack>

      <DataTable
        columns={COLUMNS}
        rows={rows}
        rowKey={(b) => b.batchId || b.jobId || ''}
        renderRow={(b) => {
          const total = Number(b.totalOperationCount ?? 0)
          const done = Number(b.completeOperationCount ?? 0)
          const failed = Number(b.failureOperationCount ?? 0)
          const id = b.batchId || b.jobId || ''
          return [
            <XStack key="k" items="center" gap="$1.5">
              <BatchKindIcon kind={b.operation || b.operationType || ''} />
              <Text fontSize="$2" color="$color">
                {batchKindLabel(b.operation || b.operationType || '')}
              </Text>
            </XStack>,
            <Badge key="s" variant={stateVariant(String(b.state))}>
              {shortState(String(b.state))}
            </Badge>,
            <Link
              key="id"
              to={`/namespaces/${encodeURIComponent(namespace)}/batches/${encodeURIComponent(id)}`}
              style={{ textDecoration: 'none' }}
            >
              <Text
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
                color="$color"
                numberOfLines={1}
              >
                {id}
              </Text>
            </Link>,
            <BatchProgress key="p" total={total} completed={done} failed={failed} />,
            <Text key="i" fontSize="$2" color="$placeholderColor" numberOfLines={1}>
              {b.identity || '—'}
            </Text>,
            <Text key="t" fontSize="$2" color="$placeholderColor">
              {b.startTime ? new Date(b.startTime).toLocaleString() : '—'}
            </Text>,
          ]
        }}
        emptyState={{
          title: `No batch operations in ${namespace}`,
          hint: 'Bulk terminate / cancel / signal / reset across many workflow executions.',
        }}
      />
    </YStack>
  )
}
