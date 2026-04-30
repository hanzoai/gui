// Workers — namespace-wide poller list. The matching service exposes
// pollers per task queue; the namespace-level endpoint flattens them.
// Backend currently returns `{ workers: [] }` until the worker SDK
// runtime is wired.

import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, H1, Spinner, Text, XStack, YStack } from 'hanzogui'
import { Layers } from '@hanzogui/lucide-icons-2/icons/Layers'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import {
  Badge,
  Empty,
  ErrorState,
  formatTimestamp,
} from '@hanzogui/admin'
import { Workers, type Worker } from '../lib/api'
import type { NextPageToken } from '../lib/types'
import { useCursorPager, type PageResult } from '../stores/pagination-cursor'
import { useSettings, workerHeartbeatsEnabled } from '../stores/settings'

const PAGE_SIZE = 200

export function WorkersPage() {
  const { ns } = useParams()
  const namespace = ns!

  const fetchPage = useCallback(
    async (_token: NextPageToken): Promise<PageResult<Worker>> => {
      const res = await fetch(Workers.listUrl(namespace), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const body = (await res.json()) as { workers?: Worker[]; nextPageToken?: NextPageToken }
      return { items: body.workers ?? [], nextPageToken: body.nextPageToken ?? null }
    },
    [namespace],
  )

  const pager = useCursorPager<Worker>(fetchPage, [namespace])
  const { settings } = useSettings()
  const heartbeatsOn = workerHeartbeatsEnabled(settings)

  if (pager.error) return <ErrorState error={pager.error} />

  return (
    <YStack flex={1} bg="$background" minH="100%" gap="$4">
      <XStack px="$6" py="$5" justify="space-between" items="center">
        <XStack items="baseline" gap="$3">
          <H1 size="$8" fontWeight="600" color="$color">
            {pager.items.length}
            {pager.hasMore ? '+' : ''} Worker{pager.items.length === 1 ? '' : 's'}
          </H1>
          <Button
            size="$2"
            chromeless
            onPress={() => void pager.refresh()}
            disabled={pager.loading}
            aria-label="Refresh"
          >
            {pager.loading ? <Spinner size="small" /> : <RefreshCw size={14} color="#7e8794" />}
          </Button>
        </XStack>
      </XStack>

      <YStack px="$6" pb="$6" gap="$3">
        {pager.items.length === 0 ? (
          heartbeatsOn ? (
            <Empty
              title={`No workers polling ${namespace}`}
              hint="Worker heartbeats land with the worker SDK runtime (pkg/sdk/worker). Once a worker registers, its identity, build ID, and last poll will appear here."
            />
          ) : (
            <Empty
              title="Heartbeats disabled"
              hint="The engine has worker heartbeats disabled in settings; live poller status is unavailable. Re-enable on the server to populate this view."
            />
          )
        ) : (
          <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
            <XStack
              bg={'rgba(255,255,255,0.03)' as never}
              px="$4"
              py="$2.5"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <HeaderCell flex={3}>Identity</HeaderCell>
              <HeaderCell flex={2}>Task queue</HeaderCell>
              <HeaderCell flex={2}>Build ID</HeaderCell>
              <HeaderCell flex={1}>Kind</HeaderCell>
              <HeaderCell flex={2}>Last poll</HeaderCell>
            </XStack>
            {pager.items.map((wkr, i) => (
              <XStack
                key={`${wkr.identity}-${i}`}
                px="$4"
                py="$2.5"
                borderBottomWidth={i === pager.items.length - 1 ? 0 : 1}
                borderBottomColor="$borderColor"
                items="center"
                hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
              >
                <YStack flex={3} px="$2">
                  <Link
                    to={`/namespaces/${encodeURIComponent(namespace)}/workers/${encodeURIComponent(wkr.identity)}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Text
                      fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                      fontSize="$2"
                      color={'#86efac' as never}
                      numberOfLines={1}
                    >
                      {wkr.identity || '—'}
                    </Text>
                  </Link>
                </YStack>
                <YStack flex={2} px="$2">
                  {wkr.taskQueue ? (
                    <Link
                      to={`/namespaces/${encodeURIComponent(namespace)}/task-queues/${encodeURIComponent(wkr.taskQueue)}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <XStack items="center" gap="$1.5">
                        <Layers size={12} color="#86efac" />
                        <Text fontSize="$2" color={'#86efac' as never} numberOfLines={1}>
                          {wkr.taskQueue}
                        </Text>
                      </XStack>
                    </Link>
                  ) : (
                    <Text fontSize="$2" color="$placeholderColor">—</Text>
                  )}
                </YStack>
                <YStack flex={2} px="$2">
                  <Text
                    fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                    fontSize="$2"
                    color="$color"
                    numberOfLines={1}
                  >
                    {wkr.buildId || '—'}
                  </Text>
                </YStack>
                <YStack flex={1} px="$2">
                  {wkr.pollerKind ? (
                    <Badge variant="info">{wkr.pollerKind}</Badge>
                  ) : (
                    <Text fontSize="$2" color="$placeholderColor">—</Text>
                  )}
                </YStack>
                <YStack flex={2} px="$2">
                  <Text fontSize="$2" color="$placeholderColor">
                    {wkr.lastAccessTime ? formatTimestamp(new Date(wkr.lastAccessTime)) : '—'}
                  </Text>
                </YStack>
              </XStack>
            ))}
          </Card>
        )}

        {pager.hasMore ? (
          <XStack justify="center" py="$3">
            <Button size="$2" onPress={() => void pager.loadMore()} disabled={pager.loading}>
              {pager.loading ? <Spinner size="small" /> : <Text fontSize="$2">Load more</Text>}
            </Button>
          </XStack>
        ) : null}
      </YStack>
    </YStack>
  )
}

void PAGE_SIZE

function HeaderCell({ children, flex }: { children: React.ReactNode; flex: number }) {
  return (
    <YStack flex={flex} px="$2">
      <Text fontSize="$1" fontWeight="500" color="$placeholderColor">
        {children}
      </Text>
    </YStack>
  )
}
