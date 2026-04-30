// Activities — namespace-scoped list of standalone activities. Mirrors
// the Workflows list shape: header with refresh + Start button, search
// bar that re-uses the workflow query parser, and a cursor-paginated
// table. The table click navigates to the Activity detail.

import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Button,
  H1,
  Spinner,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { ErrorState, formatTimestamp } from '@hanzogui/admin'
import { Activities } from '../lib/api'
import type { Activity, NextPageToken } from '../lib/api'
import { canWriteNamespace, useSettings } from '../stores/settings'
import { useCursorPager, type PageResult } from '../stores/pagination-cursor'
import { ActivityTable } from '../components/activity/ActivityTable'
import { WorkflowSearchBar } from '../components/workflow/WorkflowSearchBar'

const PAGE_SIZE = 50

export function ActivitiesPage() {
  const { ns } = useParams()
  const namespace = ns!
  const { settings } = useSettings()
  const writable = canWriteNamespace(settings)

  const [draft, setDraft] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [fetchedAt, setFetchedAt] = useState<Date>(new Date())

  const fetchPage = useCallback(
    async (token: NextPageToken): Promise<PageResult<Activity>> => {
      const cursor = await Activities.list(namespace, {
        query: submitted || undefined,
        pageSize: PAGE_SIZE,
        nextPageToken: token ?? undefined,
      })
      setFetchedAt(new Date())
      return {
        items: cursor.data.activities ?? [],
        nextPageToken: cursor.nextPageToken ?? null,
      }
    },
    [namespace, submitted],
  )

  const pager = useCursorPager<Activity>(fetchPage, [namespace, submitted])
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
            {pager.hasMore ? '+' : ''} Activit{count === 1 ? 'y' : 'ies'}
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
          <Text fontSize="$1" color="$placeholderColor">
            {formatTimestamp(fetchedAt)}
          </Text>
        </XStack>
        <Link
          to={`/namespaces/${encodeURIComponent(namespace)}/activities/start`}
          style={{ textDecoration: 'none', pointerEvents: writable ? 'auto' : 'none' }}
        >
          <Button
            size="$3"
            disabled={!writable}
            opacity={writable ? 1 : 0.5}
            bg={'#f2f2f2' as never}
            hoverStyle={{ background: '#ffffff' as never }}
            aria-label={writable ? 'Start Activity' : 'Namespace write actions are disabled'}
          >
            <XStack items="center" gap="$1.5">
              <Plus size={14} color="#070b13" />
              <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
                Start Activity
              </Text>
            </XStack>
          </Button>
        </Link>
      </XStack>

      <XStack
        px="$6"
        py="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        gap="$3"
        items="center"
      >
        <WorkflowSearchBar
          value={draft}
          onChange={setDraft}
          onSubmit={(q) => setSubmitted(q)}
        />
      </XStack>

      <YStack flex={1} p="$6" gap="$4">
        {pager.error ? (
          <ErrorState error={pager.error} />
        ) : (
          <>
            <ActivityTable
              ns={namespace}
              rows={pager.items}
              emptyState={{
                title: `No activities in ${namespace}`,
                hint: 'Start one with the button above, or run a worker that registers an activity type.',
              }}
            />
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
