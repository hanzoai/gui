// Relationships pane — parent, root (when distinct), and child list.
// Children come from the visibility query
//   ParentWorkflowId = "<id>" AND ParentRunId = "<run>"
// paginated through the cursor pager. Each ref is clickable.

import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ArrowUpRight } from '@hanzogui/lucide-icons-2/icons/ArrowUpRight'
import { Empty } from '@hanzogui/admin'
import { useCursorPager } from '../../stores/pagination-cursor'
import {
  Workflows,
  type ExecutionRef,
  type WorkflowExecution,
} from '../../lib/api'
import { WorkflowStatusPill } from '../../components/workflow/WorkflowStatusPill'

export function RelationshipsPane({
  ns,
  wf,
}: {
  ns: string
  wf: WorkflowExecution
}) {
  const parent = wf.parentExecution ?? null
  const root = wf.rootExecution ?? null
  const sameAsParent =
    !!root && !!parent && root.workflowId === parent.workflowId && root.runId === parent.runId
  const sameAsSelf =
    !!root &&
    root.workflowId === wf.execution.workflowId &&
    root.runId === wf.execution.runId
  const showRoot = !!root && !sameAsParent && !sameAsSelf
  const showParent = !!parent

  return (
    <YStack gap="$3">
      {showRoot ? <RefRow ns={ns} label="Root" execution={root!} /> : null}
      {showParent ? <RefRow ns={ns} label="Parent" execution={parent!} /> : null}
      {!showRoot && !showParent ? (
        <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <Text fontSize="$2" color="$placeholderColor">
            This workflow has no parent. It was started directly by a client.
          </Text>
        </Card>
      ) : null}
      <ChildrenSection ns={ns} parent={wf.execution} />
    </YStack>
  )
}

function RefRow({
  ns,
  label,
  execution,
}: {
  ns: string
  label: string
  execution: ExecutionRef
}) {
  const href = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(execution.workflowId)}?runId=${encodeURIComponent(execution.runId)}`
  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack items="center" gap="$3" justify="space-between">
        <YStack flex={1} gap="$0.5">
          <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
            {label.toUpperCase()}
          </Text>
          <Link to={href} style={{ textDecoration: 'none' }}>
            <Text fontSize="$3" color={'#86efac' as never}>
              {execution.workflowId}
            </Text>
          </Link>
          <Text
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$1"
            color="$placeholderColor"
          >
            {execution.runId}
          </Text>
        </YStack>
        <Link to={href} style={{ textDecoration: 'none' }}>
          <ArrowUpRight size={16} color="#7e8794" />
        </Link>
      </XStack>
    </Card>
  )
}

function ChildrenSection({ ns, parent }: { ns: string; parent: ExecutionRef }) {
  // Build the visibility query once. Wrap values in double quotes per
  // the Temporal SQL-like grammar.
  const query = useMemo(
    () =>
      `ParentWorkflowId = "${parent.workflowId}" AND ParentRunId = "${parent.runId}"`,
    [parent.workflowId, parent.runId],
  )

  const fetchPage = useCallback(
    async (token: string | null) => {
      const cursor = await Workflows.list(ns, {
        query,
        pageSize: 50,
        nextPageToken: token ?? undefined,
      })
      return {
        items: cursor.data.executions ?? [],
        nextPageToken: cursor.nextPageToken ?? cursor.data.nextPageToken ?? null,
      }
    },
    [ns, query],
  )

  const { items, loading, error, hasMore, loadMore } = useCursorPager<WorkflowExecution>(
    fetchPage,
    [ns, query],
  )

  return (
    <YStack gap="$2">
      <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
        CHILDREN ({items.length}
        {hasMore ? '+' : ''})
      </Text>
      {error ? (
        <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <Text fontSize="$2" color="$placeholderColor">
            Could not list children: {error.message}
          </Text>
        </Card>
      ) : items.length === 0 && !loading ? (
        <Empty
          title="No child workflows"
          hint="Children are workflows started by this workflow's CallChild opcode."
        />
      ) : (
        <YStack gap="$2">
          {items.map((c) => (
            <ChildRow key={`${c.execution.workflowId}/${c.execution.runId}`} ns={ns} child={c} />
          ))}
          {hasMore ? (
            <XStack justify="center">
              <Button size="$2" chromeless disabled={loading} onPress={() => void loadMore()}>
                <XStack items="center" gap="$1.5">
                  {loading ? <Spinner size="small" /> : null}
                  <Text fontSize="$2">Load more</Text>
                </XStack>
              </Button>
            </XStack>
          ) : null}
        </YStack>
      )}
    </YStack>
  )
}

function ChildRow({ ns, child }: { ns: string; child: WorkflowExecution }) {
  const href = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(child.execution.workflowId)}?runId=${encodeURIComponent(child.execution.runId)}`
  return (
    <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack items="center" gap="$3" justify="space-between">
        <YStack flex={1} gap="$0.5">
          <XStack items="center" gap="$2">
            <Link to={href} style={{ textDecoration: 'none' }}>
              <Text fontSize="$2" color={'#86efac' as never}>
                {child.execution.workflowId}
              </Text>
            </Link>
            <WorkflowStatusPill status={String(child.status)} />
          </XStack>
          <Text fontSize="$1" color="$placeholderColor">
            {child.type?.name ?? 'workflow'} · {child.execution.runId}
          </Text>
        </YStack>
        <Link to={href} style={{ textDecoration: 'none' }}>
          <ArrowUpRight size={14} color="#7e8794" />
        </Link>
      </XStack>
    </Card>
  )
}
