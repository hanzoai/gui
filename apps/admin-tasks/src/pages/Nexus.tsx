// Nexus — list of cross-namespace operation bridges. Cursor-paginated
// against /v1/tasks/(namespaces/:ns/)?nexus. The page is the same
// component for both top-level and namespace-scoped routes; ns?: from
// useParams discriminates.

import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, H2, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Empty, ErrorState, LoadingState } from '@hanzogui/admin'
import type { ListNexusEndpointsResponse, NexusEndpoint } from '../lib/api'
import { Nexus } from '../lib/api'
import { useCursorPager, type PageResult } from '../stores/pagination-cursor'
import { NexusEndpointCard } from '../components/nexus/NexusEndpointCard'

export function NexusPage() {
  const { ns } = useParams()
  const namespace = ns
  const baseUrl = Nexus.listUrl(namespace)
  const createHref = namespace
    ? `/namespaces/${encodeURIComponent(namespace)}/nexus/create`
    : '/nexus/create'

  const fetchPage = useCallback(
    async (token: string | null): Promise<PageResult<NexusEndpoint>> => {
      const url = token ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}nextPageToken=${encodeURIComponent(token)}` : baseUrl
      const res = await fetch(url, { credentials: 'same-origin' })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const body = (await res.json()) as ListNexusEndpointsResponse
      return { items: body.endpoints ?? [], nextPageToken: body.nextPageToken ?? null }
    },
    [baseUrl],
  )

  const { items, loading, error, hasMore, loadMore } = useCursorPager<NexusEndpoint>(fetchPage, [baseUrl])

  if (error && items.length === 0) return <ErrorState error={error} />
  if (loading && items.length === 0) return <LoadingState />

  function detailHref(e: NexusEndpoint): string {
    const id = e.asyncOperationId || e.name
    if (namespace) return `/namespaces/${encodeURIComponent(namespace)}/nexus/${encodeURIComponent(id)}`
    return `/nexus/${encodeURIComponent(id)}`
  }

  return (
    <YStack gap="$4">
      <XStack items="baseline" justify="space-between">
        <H2 size="$7" color="$color">
          Nexus{' '}
          <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
            ({items.length}
            {hasMore ? '+' : ''})
          </Text>
        </H2>
        <Link to={createHref} style={{ textDecoration: 'none' }}>
          <Button size="$2" bg={'#f2f2f2' as never}>
            <XStack items="center" gap="$1.5">
              <Plus size={14} color="#070b13" />
              <Text fontSize="$2" color={'#070b13' as never} fontWeight="500">
                Create endpoint
              </Text>
            </XStack>
          </Button>
        </Link>
      </XStack>

      {items.length === 0 ? (
        <Empty
          title={namespace ? `No Nexus endpoints in ${namespace}` : 'No Nexus endpoints'}
          hint="Cross-namespace operation bridges. A workflow in this namespace calls a handler in another."
        />
      ) : (
        <YStack gap="$2">
          {items.map((e) => (
            <NexusEndpointCard key={`${e.namespace}/${e.name}`} endpoint={e} detailHref={detailHref(e)} />
          ))}
          {hasMore ? (
            <Button size="$2" chromeless onPress={() => void loadMore()} disabled={loading}>
              <Text fontSize="$2" color="$placeholderColor">
                {loading ? 'Loading…' : 'Load more'}
              </Text>
            </Button>
          ) : null}
        </YStack>
      )}
    </YStack>
  )
}
