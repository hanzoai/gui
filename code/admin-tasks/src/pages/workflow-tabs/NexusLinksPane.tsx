// Nexus links pane — outbound nexus operations called by this
// workflow plus inbound calls into this workflow. The engine doesn't
// yet record either edge (nexus opcodes are stubbed at 501), so this
// pane stays empty rather than fabricating cross-namespace links.

import { Link } from 'react-router-dom'
import { Text, XStack, YStack } from 'hanzogui'
import { Network } from '@hanzogui/lucide-icons-2/icons/Network'
import { Alert, Empty } from '@hanzo/admin'
import type { PendingNexusOperation, WorkflowExecution } from '../../lib/api'

export function NexusLinksPane({
  ns,
  wf,
}: {
  ns: string
  wf: WorkflowExecution
}) {
  const outbound: PendingNexusOperation[] = wf.pendingNexusOperations ?? []

  if (outbound.length === 0) {
    return (
      <YStack gap="$3">
        <Alert title="Nexus links not yet tracked">
          Nexus opcodes are reserved on the wire (Schedule, Cancel, Complete)
          but the engine returns 501 until cross-namespace handlers ship. Once
          they do, every outbound call from this workflow will appear here
          alongside the handler workflow it routes to.
        </Alert>
        <Empty
          title="No nexus operations"
          hint="Nexus is the cross-namespace bridge: a workflow in one namespace calls a handler in another. Endpoints are configured at namespaces/:ns/nexus."
          action={
            <Link
              to={`/namespaces/${encodeURIComponent(ns)}/nexus`}
              style={{ textDecoration: 'none' }}
            >
              <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
                <Network size={14} color="#86efac" />
                <Text fontSize="$2" color={'#86efac' as never}>
                  Open nexus endpoints
                </Text>
              </XStack>
            </Link>
          }
        />
      </YStack>
    )
  }

  return (
    <YStack gap="$3">
      <Text fontSize="$3" color="$color" fontWeight="500">
        Outbound{' '}
        <Text fontSize="$2" color="$placeholderColor" fontWeight="400">
          ({outbound.length})
        </Text>
      </Text>
      {outbound.map((op, i) => (
        <XStack
          key={`${op.endpoint}-${op.service}-${op.operation}-${i}`}
          items="center"
          gap="$3"
          px="$4"
          py="$3"
          borderWidth={1}
          borderColor="$borderColor"
          rounded="$2"
        >
          <Network size={16} color="#7e8794" />
          <YStack flex={1}>
            <Text fontSize="$2" fontWeight="500" color="$color">
              {op.service}.{op.operation}
            </Text>
            <Text fontSize="$1" color="$placeholderColor">
              endpoint {op.endpoint}
            </Text>
          </YStack>
          {op.state ? (
            <Text fontSize="$1" color="$placeholderColor">
              {op.state.replace(/^PENDING_NEXUS_OPERATION_STATE_/, '').toLowerCase()}
            </Text>
          ) : null}
        </XStack>
      ))}
    </YStack>
  )
}
