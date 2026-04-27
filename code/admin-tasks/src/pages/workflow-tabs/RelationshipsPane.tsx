// Relationships pane — parent + root + children. The native engine
// can carry parent/root execution refs forward (the Start opcode
// already accepts them in principle) but does not yet emit them in
// describe responses, so we render whatever ships and otherwise an
// honest empty state.

import { Link } from 'react-router-dom'
import { Card, Text, XStack, YStack } from 'hanzogui'
import { ArrowUpRight } from '@hanzogui/lucide-icons-2/icons/ArrowUpRight'
import { Alert, Empty } from '@hanzogui/admin'
import type { ExecutionRef, WorkflowExecution } from '../../lib/api'

export function RelationshipsPane({
  ns,
  wf,
}: {
  ns: string
  wf: WorkflowExecution
}) {
  const parent = wf.parentExecution ?? null
  const root = wf.rootExecution ?? null
  const hasParent = !!parent
  const hasRoot =
    !!root &&
    !(root.workflowId === wf.execution.workflowId && root.runId === wf.execution.runId)

  if (!hasParent && !hasRoot) {
    return (
      <YStack gap="$3">
        <Alert title="Workflow tree not yet tracked">
          The native engine will start carrying parent / root execution refs
          once the worker SDK records them on Start. Children require the
          history grouper, which lands with the worker runtime. Until then
          this view is empty by design.
        </Alert>
        <Empty
          title="No related workflows"
          hint="A workflow's parent is recorded when it is started by another workflow's CallChild opcode; children are derived from history."
        />
      </YStack>
    )
  }

  return (
    <YStack gap="$3">
      {hasRoot ? <RefRow ns={ns} label="Root" ref={root!} /> : null}
      {hasParent ? <RefRow ns={ns} label="Parent" ref={parent!} /> : null}
      <Alert title="Children not yet tracked">
        Child workflow links land with the worker SDK runtime. Until then only
        ancestor refs are surfaced.
      </Alert>
    </YStack>
  )
}

function RefRow({ ns, label, ref }: { ns: string; label: string; ref: ExecutionRef }) {
  const href = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(ref.workflowId)}?runId=${encodeURIComponent(ref.runId)}`
  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack items="center" gap="$3" justify="space-between">
        <YStack flex={1} gap="$0.5">
          <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
            {label.toUpperCase()}
          </Text>
          <Link to={href} style={{ textDecoration: 'none' }}>
            <Text fontSize="$3" color={'#86efac' as never}>
              {ref.workflowId}
            </Text>
          </Link>
          <Text
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$1"
            color="$placeholderColor"
          >
            {ref.runId}
          </Text>
        </YStack>
        <Link to={href} style={{ textDecoration: 'none' }}>
          <ArrowUpRight size={16} color="#7e8794" />
        </Link>
      </XStack>
    </Card>
  )
}
