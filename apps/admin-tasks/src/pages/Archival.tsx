// Archival — readonly visibility query view scoped to archived
// executions. Same query parser surface as the workflow list, routed
// to /v1/tasks/namespaces/:ns/archival. Until the persistence layer
// ships separate cold storage, the backend may 501; the page renders
// the matching executions when results come back, and an honest
// alert + empty state otherwise.

import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, H1, Spinner, Text, XStack, YStack } from 'hanzogui'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import {
  Alert,
  Badge,
  ErrorState,
  formatTimestamp,
} from '@hanzogui/admin'
import { ApiError, archivalUrls, shortStatus, statusVariant } from '../lib/api'
import type { WorkflowExecution } from '../lib/api'
import { useCursorPager, type PageResult } from '../stores/pagination-cursor'
import type { ListWorkflowExecutionsResponse, NextPageToken } from '../lib/types'
import { WorkflowSearchBar } from '../components/workflow/WorkflowSearchBar'
import { WorkflowTable } from '../components/workflow/WorkflowTable'

const PAGE_SIZE = 50

interface ArchivalListResp extends ListWorkflowExecutionsResponse {
  archived?: WorkflowExecution[]
}

async function fetchArchival(url: string): Promise<ArchivalListResp> {
  const r = await fetch(url, { credentials: 'same-origin' })
  if (!r.ok) {
    const text = await r.text().catch(() => '')
    throw new ApiError(r.status, text, text || r.statusText)
  }
  return (await r.json()) as ArchivalListResp
}

export function ArchivalPage() {
  const { ns } = useParams()
  const namespace = ns!
  const [draft, setDraft] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [fetchedAt, setFetchedAt] = useState<Date>(new Date())
  const [unsupported, setUnsupported] = useState<string | null>(null)

  const fetchPage = useCallback(
    async (token: NextPageToken): Promise<PageResult<WorkflowExecution>> => {
      const url = archivalUrls.query(namespace, {
        query: submitted,
        pageSize: PAGE_SIZE,
        nextPageToken: token ?? undefined,
      })
      try {
        const body = await fetchArchival(url)
        setUnsupported(null)
        setFetchedAt(new Date())
        const items = body.executions ?? body.archived ?? []
        return { items, nextPageToken: body.nextPageToken ?? null }
      } catch (e) {
        if (e instanceof ApiError && e.status === 501) {
          setUnsupported(
            "The native engine doesn't expose a separate archival query yet. " +
              'Closed workflows still inside their retention window appear on the Workflows page.',
          )
          return { items: [], nextPageToken: null }
        }
        throw e
      }
    },
    [namespace, submitted],
  )

  const pager = useCursorPager<WorkflowExecution>(fetchPage, [namespace, submitted])

  const onSubmitQuery = useCallback((q: string) => setSubmitted(q), [])
  const onChangeQuery = useCallback((q: string) => setDraft(q), [])

  const count = pager.items.length

  return (
    <YStack flex={1} bg="$background" minH="100%">
      <XStack
        px="$6"
        py="$5"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        justify="space-between"
        items="center"
      >
        <XStack items="baseline" gap="$3">
          <H1 size="$9" fontWeight="600" color="$color">
            {count}
            {pager.hasMore ? '+' : ''} Archived
          </H1>
          <Badge variant="muted">Archived</Badge>
          <Button
            size="$2"
            chromeless
            onPress={() => void pager.refresh()}
            disabled={pager.loading}
            aria-label="Refresh"
          >
            {pager.loading ? <Spinner size="small" /> : <RefreshCw size={14} color="#7e8794" />}
          </Button>
          <Text fontSize="$1" color="$placeholderColor">
            {formatTimestamp(fetchedAt)}
          </Text>
        </XStack>
      </XStack>

      <XStack
        px="$6"
        py="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        gap="$3"
        items="center"
      >
        <WorkflowSearchBar value={draft} onChange={onChangeQuery} onSubmit={onSubmitQuery} />
      </XStack>

      <YStack flex={1} p="$6" gap="$4">
        {unsupported ? <Alert title="Archival query not yet wired">{unsupported}</Alert> : null}

        {pager.error ? (
          <ErrorState error={pager.error} />
        ) : (
          <>
            <ArchivedTableShim ns={namespace} rows={pager.items} />
            {pager.hasMore ? (
              <XStack justify="center">
                <Button
                  size="$3"
                  onPress={() => void pager.loadMore()}
                  disabled={pager.loading}
                >
                  <XStack items="center" gap="$1.5">
                    {pager.loading ? <Spinner size="small" /> : null}
                    <Text fontSize="$2">{pager.loading ? 'Loading…' : 'Load more'}</Text>
                  </XStack>
                </Button>
              </XStack>
            ) : null}
          </>
        )}
      </YStack>
    </YStack>
  )
}

// ArchivedTableShim — wraps WorkflowTable in a readonly badge frame.
// The archival page never offers row actions; the only navigation is
// to the (read-only) workflow detail page when the engine eventually
// allows describing archived executions.
function ArchivedTableShim({
  ns,
  rows,
}: {
  ns: string
  rows: WorkflowExecution[]
}) {
  // ack the wire-status helpers via a noop — keeps shortStatus +
  // statusVariant tree-shake friendly without leaking imports.
  void shortStatus
  void statusVariant
  return (
    <WorkflowTable
      ns={ns}
      rows={rows}
      emptyState={{
        title: 'No archived workflows match this query',
        hint: 'Workflows still inside their retention window are visible on the Workflows page. Anything beyond it is gone for good in the embedded build.',
      }}
    />
  )
}
