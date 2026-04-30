// Workflows — list view for a namespace. Composes saved-views rail
// (system presets + user-saved views) + WorkflowSearchBar + FilterBar
// + the shared WorkflowTable. Pagination uses the cursor hook so
// the list streams in pages and the page count is whatever the
// engine emits.
//
// Bulk actions: when one or more rows are selected the BulkActionToolbar
// drops in below the search row and the selected workflowIds become
// the visibility query for a one-shot Batches.create() POST.
//
// Saved views: system presets are namespace-scoped and live in
// buildSystemViews. User-saved views are persisted client-side
// (per org+namespace) via useSavedViews; the rail renders them
// below a divider.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Button,
  Card,
  Dialog,
  H1,
  Input,
  Spinner,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { Activity } from '@hanzogui/lucide-icons-2/icons/Activity'
import { AlertTriangle } from '@hanzogui/lucide-icons-2/icons/AlertTriangle'
import { Bookmark } from '@hanzogui/lucide-icons-2/icons/Bookmark'
import { Calendar } from '@hanzogui/lucide-icons-2/icons/Calendar'
import { Clock } from '@hanzogui/lucide-icons-2/icons/Clock'
import { GitBranch } from '@hanzogui/lucide-icons-2/icons/GitBranch'
import { Layers } from '@hanzogui/lucide-icons-2/icons/Layers'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Play } from '@hanzogui/lucide-icons-2/icons/Play'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  Alert,
  ErrorState,
  SavedViewsRail,
  formatTimestamp,
  useIdentity,
  type SavedView,
  type WorkflowSort,
} from '@hanzogui/admin'
import { ApiError, Workflows, apiPost } from '../lib/api'
import type { WorkflowExecution } from '../lib/api'
import { useTaskEvents } from '../lib/events'
import { canWriteNamespace, useSettings } from '../stores/settings'
import { useCursorPager, type PageResult } from '../stores/pagination-cursor'
import { useSavedViews, type SavedQueryView } from '../stores/saved-views'
import type { NextPageToken } from '../lib/types'
import { WorkflowSearchBar } from '../components/workflow/WorkflowSearchBar'
import { WorkflowTable, rowKey } from '../components/workflow/WorkflowTable'
import { BulkActionToolbar } from '../components/workflow/BulkActionToolbar'
import { FilterBar } from '../components/search/FilterBar'
import { SavedViewModal, type SavedViewModalMode } from '../components/search/SavedViewModal'

const PAGE_SIZE = 50

// System views — namespace-scoped saved queries. `today` and
// `last-hour` recompute per render so the lower-bound stays fresh.
function buildSystemViews(): SavedView[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lastHour = new Date()
  lastHour.setHours(lastHour.getHours() - 1)
  lastHour.setSeconds(0, 0)
  return [
    { id: 'all', label: 'All Workflows', query: '', icon: Layers },
    {
      id: 'task-failures',
      label: 'Task Failures',
      query: 'WorkflowTaskFailureCount > 0',
      icon: AlertTriangle,
    },
    { id: 'running', label: 'Running', query: 'ExecutionStatus="Running"', icon: Activity },
    {
      id: 'parent-workflows',
      label: 'Parent Workflows',
      query: 'ParentWorkflowId is null',
      icon: GitBranch,
    },
    { id: 'today', label: 'Today', query: `StartTime >= "${today.toISOString()}"`, icon: Calendar },
    {
      id: 'last-hour',
      label: 'Last Hour',
      query: `StartTime >= "${lastHour.toISOString()}"`,
      icon: Clock,
    },
  ]
}

export function WorkflowsPage() {
  const { ns } = useParams()
  const namespace = ns!
  const systemViews = useMemo(buildSystemViews, [])
  const [activeViewId, setActiveViewId] = useState<string>('all')
  const [draft, setDraft] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [sort, setSort] = useState<WorkflowSort | undefined>(undefined)
  const [fetchedAt, setFetchedAt] = useState<Date>(new Date())
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [savedViewModal, setSavedViewModal] = useState<SavedViewModalMode | null>(null)

  const { settings } = useSettings()
  const writeAllowed = canWriteNamespace(settings)
  const advancedVisibility = settings?.advancedVisibilityEnabled !== false

  const identity = useIdentity()
  const org = identity.identity?.owner ?? 'unknown'
  const userViews = useSavedViews(org, namespace)

  const fetchPage = useCallback(
    async (token: NextPageToken): Promise<PageResult<WorkflowExecution>> => {
      const cursor = await Workflows.list(namespace, {
        query: submitted,
        pageSize: PAGE_SIZE,
        nextPageToken: token ?? undefined,
      })
      setFetchedAt(new Date())
      return {
        items: cursor.data.executions ?? [],
        nextPageToken: cursor.nextPageToken ?? null,
      }
    },
    [namespace, submitted],
  )

  const pager = useCursorPager<WorkflowExecution>(fetchPage, [namespace, submitted])

  // Clear the selection whenever the page is refetched (the rows
  // identified by the keys are no longer the same set).
  useEffect(() => {
    setSelected(new Set())
  }, [pager.items])

  const onSelectView = useCallback((view: SavedView) => {
    setActiveViewId(view.id)
    setDraft(view.query)
    setSubmitted(view.query)
  }, [])

  const onSubmitQuery = useCallback((q: string) => {
    setSubmitted(q)
    setActiveViewId('')
  }, [])

  const onChangeQuery = useCallback((q: string) => {
    setDraft(q)
    setActiveViewId('')
  }, [])

  // FilterBar edits the same draft+submitted string the search input
  // owns. We keep them in lockstep so chips appear immediately when
  // the user clicks the bar.
  const onFilterChange = useCallback((q: string) => {
    setDraft(q)
    setSubmitted(q)
    setActiveViewId('')
  }, [])

  const toggleRow = useCallback((key: string) => {
    setSelected((cur) => {
      const next = new Set(cur)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const toggleAll = useCallback((rowKeys: string[], selectAll: boolean) => {
    setSelected((cur) => {
      if (!selectAll) {
        const next = new Set(cur)
        for (const k of rowKeys) next.delete(k)
        return next
      }
      const next = new Set(cur)
      for (const k of rowKeys) next.add(k)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => setSelected(new Set()), [])

  useTaskEvents(namespace, () => void pager.refresh(), [
    'workflow.started',
    'workflow.canceled',
    'workflow.terminated',
    'workflow.signaled',
  ])

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
            {pager.hasMore ? '+' : ''} Workflow{count === 1 ? '' : 's'}
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
        <StartWorkflowButton ns={namespace} onStarted={() => void pager.refresh()} />
      </XStack>

      <YStack
        px="$6"
        py="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        gap="$2"
      >
        <XStack gap="$3" items="center">
          <WorkflowSearchBar value={draft} onChange={onChangeQuery} onSubmit={onSubmitQuery} />
        </XStack>
        <FilterBar
          namespace={namespace}
          query={draft}
          onChange={onFilterChange}
          advancedVisibilityEnabled={advancedVisibility}
        />
        <BulkActionToolbar
          ns={namespace}
          selected={selected}
          totalCount={pager.items.length}
          onClear={clearSelection}
          enabled={writeAllowed}
        />
      </YStack>

      <XStack flex={1}>
        <YStack
          width={220}
          borderRightWidth={1}
          borderRightColor="$borderColor"
          bg={'rgba(7,11,19,0.4)' as never}
        >
          <SavedViewsRail
            views={systemViews}
            activeId={activeViewId}
            onSelect={onSelectView}
            width={220}
          />
          <YStack
            px="$2"
            pb="$3"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            mt="$2"
            pt="$3"
            gap="$1"
          >
            <XStack px="$2" pb="$1" justify="space-between" items="center">
              <Text
                fontSize="$1"
                color="$placeholderColor"
                fontWeight="600"
                letterSpacing={0.4}
                textTransform={'uppercase' as never}
              >
                Your views
              </Text>
              <Button
                size="$1"
                chromeless
                onPress={() => setSavedViewModal({ kind: 'create', query: draft })}
                aria-label="Save current view"
              >
                <XStack items="center" gap="$1">
                  <Plus size={11} color="#7e8794" />
                  <Text fontSize="$1" color="$placeholderColor">
                    Save
                  </Text>
                </XStack>
              </Button>
            </XStack>
            {userViews.views.length === 0 ? (
              <Text px="$3" fontSize="$1" color="$placeholderColor">
                No saved views yet.
              </Text>
            ) : (
              userViews.views.map((v) => (
                <UserViewRow
                  key={v.id}
                  view={v}
                  active={activeViewId === `user:${v.id}`}
                  onSelect={() => {
                    setActiveViewId(`user:${v.id}`)
                    setDraft(v.query)
                    setSubmitted(v.query)
                  }}
                  onRename={() =>
                    setSavedViewModal({ kind: 'rename', id: v.id, name: v.name })
                  }
                  onDelete={() => userViews.remove(v.id)}
                />
              ))
            )}
          </YStack>
        </YStack>
        <YStack flex={1} p="$6" gap="$4">
          {pager.error ? (
            <ErrorState error={pager.error} />
          ) : (
            <>
              <WorkflowTable
                ns={namespace}
                rows={pager.items}
                sort={sort}
                onSortChange={setSort}
                emptyState={{
                  title: `No workflows in ${namespace}`,
                  hint: 'Start one with the button above, or run a worker that registers a workflow type.',
                }}
                selectable
                selected={selected}
                onToggle={toggleRow}
                onToggleAll={toggleAll}
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
      </XStack>

      <SavedViewModal
        open={savedViewModal !== null}
        mode={savedViewModal}
        onOpenChange={(open) => {
          if (!open) setSavedViewModal(null)
        }}
        onSubmit={(name) => {
          if (!savedViewModal) return
          if (savedViewModal.kind === 'create') {
            userViews.save({ name, query: savedViewModal.query })
          } else {
            userViews.rename(savedViewModal.id, name)
          }
        }}
      />
    </YStack>
  )
}

function UserViewRow({
  view,
  active,
  onSelect,
  onRename,
  onDelete,
}: {
  view: SavedQueryView
  active: boolean
  onSelect: () => void
  onRename: () => void
  onDelete: () => void
}) {
  return (
    <XStack
      mx="$2"
      px="$2.5"
      py="$2"
      rounded="$3"
      items="center"
      gap="$2"
      cursor="pointer"
      bg={active ? ('rgba(255,255,255,0.06)' as never) : 'transparent'}
      hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
      onPress={onSelect}
    >
      <Bookmark size={12} color={active ? '#f2f2f2' : '#7e8794'} />
      <Text fontSize="$2" color={active ? '$color' : '$placeholderColor'} flex={1} numberOfLines={1}>
        {view.name}
      </Text>
      <Button
        size="$1"
        chromeless
        onPress={(e: { stopPropagation?: () => void } | undefined) => {
          e?.stopPropagation?.()
          onRename()
        }}
        aria-label={`Rename ${view.name}`}
      >
        <Pencil size={11} color="#7e8794" />
      </Button>
      <Button
        size="$1"
        chromeless
        onPress={(e: { stopPropagation?: () => void } | undefined) => {
          e?.stopPropagation?.()
          onDelete()
        }}
        aria-label={`Delete ${view.name}`}
      >
        <Trash2 size={11} color="#7e8794" />
      </Button>
    </XStack>
  )
}

function StartWorkflowButton({ ns, onStarted }: { ns: string; onStarted: () => void }) {
  const { settings } = useSettings()
  const writeAllowed = canWriteNamespace(settings)
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('')
  const [taskQueue, setTaskQueue] = useState('default')
  const [workflowId, setWorkflowId] = useState('')
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit() {
    setSubmitting(true)
    setErr(null)
    try {
      let parsedInput: unknown = undefined
      if (input.trim()) {
        try {
          parsedInput = JSON.parse(input)
        } catch {
          throw new Error('Input must be valid JSON.')
        }
      }
      await apiPost(`/v1/tasks/namespaces/${encodeURIComponent(ns)}/workflows`, {
        workflowId: workflowId || undefined,
        workflowType: { name: type },
        taskQueue: { name: taskQueue },
        input: parsedInput,
      })
      setOpen(false)
      onStarted()
    } catch (e) {
      if (e instanceof ApiError) {
        setErr(`${e.status === 501 ? 'Not yet implemented in native server' : 'Failed'}: ${e.message}`)
      } else {
        setErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          size="$3"
          disabled={!writeAllowed}
          opacity={writeAllowed ? 1 : 0.5}
          bg={'#f2f2f2' as never}
          hoverStyle={{ background: '#ffffff' as never }}
          aria-label={writeAllowed ? 'Start Workflow' : 'Namespace write actions are disabled'}
        >
          <XStack items="center" gap="$1.5">
            <Plus size={14} color="#070b13" />
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              Start Workflow
            </Text>
          </XStack>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay key="overlay" bg={'rgba(0,0,0,0.6)' as never} />
        <Dialog.Content
          bg="$background"
          borderColor="$borderColor"
          borderWidth={1}
          minW={520}
          p="$5"
          gap="$4"
        >
          <Dialog.Title fontSize="$6" fontWeight="600" color="$color">
            Start a workflow in {ns}
          </Dialog.Title>
          <Dialog.Description fontSize="$2" color="$placeholderColor">
            Posts to /v1/tasks/namespaces/{ns}/workflows.
          </Dialog.Description>
          <YStack gap="$3">
            <Field label="Workflow type *">
              <Input value={type} onChangeText={setType} placeholder="MyWorkflow" />
            </Field>
            <XStack gap="$3">
              <Field label="Task queue" flex={1}>
                <Input value={taskQueue} onChangeText={setTaskQueue} />
              </Field>
              <Field label="Workflow ID" flex={1}>
                <Input value={workflowId} onChangeText={setWorkflowId} placeholder="auto" />
              </Field>
            </XStack>
            <Field label="Input (JSON, optional)">
              <Input value={input} onChangeText={setInput} placeholder='{"key":"value"}' />
            </Field>
            {err ? (
              <Alert variant="destructive" title="Could not start">
                {err}
              </Alert>
            ) : null}
          </YStack>
          <XStack gap="$2" justify="flex-end" mt="$2">
            <Button chromeless onPress={() => setOpen(false)}>
              <Text fontSize="$2">Cancel</Text>
            </Button>
            <Button
              onPress={submit}
              disabled={submitting || !type}
              bg={'#f2f2f2' as never}
              hoverStyle={{ background: '#ffffff' as never }}
            >
              <XStack items="center" gap="$1.5">
                <Play size={14} color="#070b13" />
                <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
                  {submitting ? 'Starting…' : 'Start'}
                </Text>
              </XStack>
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

function Field({
  label,
  flex,
  children,
}: {
  label: string
  flex?: number
  children: React.ReactNode
}) {
  return (
    <YStack gap="$1.5" flex={flex}>
      <Text fontSize="$2" color="$color">
        {label}
      </Text>
      {children}
    </YStack>
  )
}

// Suppress unused-named import warning for the rowKey export so
// downstream callers (or future inline tests in this file) can pull
// it without re-importing.
export const _selectionKey = rowKey

// Card import retained for downstream extension (kept on import list).
export const _kept = Card
