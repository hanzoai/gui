// Activity detail — five tabs, one shell. Header carries the activity
// id, status pill, and the action menu. The route enumerates each tab
// as its own URL so deep links work and tab switches are navigations,
// not state. Mirrors WorkflowDetail down to the badge counts so the
// two pages read uniformly.

import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  H1,
  Tabs,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Badge, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Activities } from '../lib/api'
import type { Activity } from '../lib/api'
import { ActivityActionMenu } from '../components/activity/ActivityActionMenu'
import { ActivityHistoryPane } from '../components/activity/ActivityHistoryPane'
import { ActivityStatusPill } from '../components/activity/ActivityStatusPill'
import { ActivitySummaryCard } from '../components/activity/ActivitySummaryCard'
import { JsonPane } from './workflow-tabs/JsonPane'
import { WorkersPane } from './workflow-tabs/WorkersPane'

export type ActivityTab =
  | 'summary'
  | 'history'
  | 'workers'
  | 'search-attributes'
  | 'user-metadata'

interface DescribeResp {
  activityInfo?: Activity
  activity?: Activity
}

interface TabSpec {
  value: ActivityTab
  label: string
  count?: (a: Activity) => number | undefined
}

const TABS: TabSpec[] = [
  { value: 'summary', label: 'Summary' },
  { value: 'history', label: 'History', count: (a) => a.attempts?.length ?? a.attempt ?? undefined },
  { value: 'workers', label: 'Workers' },
  { value: 'search-attributes', label: 'Search attributes' },
  { value: 'user-metadata', label: 'User metadata' },
]

export function ActivityDetailPage({ tab = 'summary' }: { tab?: ActivityTab } = {}) {
  const { ns, activityId, runId } = useParams()
  const navigate = useNavigate()
  const namespace = ns!
  const aid = activityId!
  const rid = runId!

  const url = Activities.describeUrl(namespace, aid, rid)
  const { data, error, isLoading, mutate } = useFetch<DescribeResp>(url)

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const activity = data.activityInfo ?? data.activity
  if (!activity) return <ErrorState error={new Error('activity not found')} />

  const taskQueue = typeof activity.taskQueue === 'string' ? activity.taskQueue : activity.taskQueue?.name
  const baseHref = `/namespaces/${encodeURIComponent(namespace)}/activities/${encodeURIComponent(aid)}/${encodeURIComponent(rid)}`

  const onTabChange = (v: string) => {
    const next = v as ActivityTab
    const path = next === 'summary' ? baseHref : `${baseHref}/${next}`
    navigate(path, { replace: false })
  }

  return (
    <YStack gap="$5">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}/activities`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            activities
          </Text>
        </XStack>
      </Link>

      <XStack items="flex-start" justify="space-between" gap="$3">
        <YStack gap="$1" flex={1}>
          <XStack items="center" gap="$3" flexWrap="wrap">
            <H1 size="$7" color="$color" fontWeight="600">
              {activity.activityId}
            </H1>
            <ActivityStatusPill status={String(activity.status)} />
          </XStack>
          <Text
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$2"
            color="$placeholderColor"
          >
            {activity.runId}
          </Text>
        </YStack>
        <ActivityActionMenu
          ns={namespace}
          activityId={activity.activityId}
          runId={activity.runId}
          status={String(activity.status)}
          onChanged={() => void mutate()}
        />
      </XStack>

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
              count={t.count ? t.count(activity) : undefined}
            >
              {t.label}
            </TabTrigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="summary" mt="$4">
          <ActivitySummaryCard ns={namespace} activity={activity} />
        </Tabs.Content>

        <Tabs.Content value="history" mt="$4">
          <ActivityHistoryPane ns={namespace} activityId={aid} runId={rid} />
        </Tabs.Content>

        <Tabs.Content value="workers" mt="$4">
          <WorkersPane ns={namespace} taskQueue={taskQueue} />
        </Tabs.Content>

        <Tabs.Content value="search-attributes" mt="$4">
          <JsonPane
            data={(activity.searchAttrs ?? null) as Record<string, unknown> | null}
            emptyTitle="No search attributes"
            emptyHint="Search attributes attached at Start appear here once the engine indexes them."
          />
        </Tabs.Content>

        <Tabs.Content value="user-metadata" mt="$4">
          <JsonPane
            data={(activity.userMetadata ?? null) as Record<string, unknown> | null}
            emptyTitle="No user metadata"
            emptyHint="Workers can attach a short summary and longer details blob to an activity."
          />
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
        {count !== undefined ? <Badge variant="muted">{count}</Badge> : null}
      </XStack>
    </Tabs.Tab>
  )
}

// Button is referenced indirectly through other components; keep import
// minimal so ts-prune doesn't flag the page. (Suspense via lazy import.)
export const _kept = Button
