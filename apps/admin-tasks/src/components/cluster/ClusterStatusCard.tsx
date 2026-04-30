// ClusterStatusCard — top-of-page summary. Three facts at a glance:
//   replicator type (quasar = replicated, local = single-node fallback),
//   validator count, and whether the local node is in quorum. The
//   in-quorum bool comes from `/v1/tasks/cluster/health` (200 = yes,
//   503 = no); the parent fetches it once per refresh tick.

import { Card, Text, XStack, YStack } from 'hanzogui'
import { Badge } from '@hanzogui/admin'
import type { ClusterStatus } from '../../lib/api'

export interface ClusterStatusCardProps {
  status: ClusterStatus
  inQuorum: boolean
}

export function ClusterStatusCard({ status, inQuorum }: ClusterStatusCardProps) {
  const replicatorVariant = status.replicator === 'quasar' ? 'success' : 'muted'
  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$3">
        <XStack gap="$4" flexWrap="wrap">
          <Stat label="Replicator">
            <Badge variant={replicatorVariant as never}>{status.replicator}</Badge>
          </Stat>
          <Stat label="Node">
            <Text fontSize="$3" color="$color" numberOfLines={1}>
              {status.nodeId}
            </Text>
          </Stat>
          <Stat label="Validators">
            <Text fontSize="$5" fontWeight="600" color="$color">
              {status.validators.length}
            </Text>
          </Stat>
          <Stat label="Quorum">
            <Badge variant={(inQuorum ? 'success' : 'destructive') as never}>
              {inQuorum ? 'in-quorum' : 'out-of-quorum'}
            </Badge>
          </Stat>
          <Stat label="Replication lag">
            <Text fontSize="$5" fontWeight="600" color="$color">
              {Math.max(0, Math.round(status.replicationLag))}
              <Text fontSize="$2" color="$placeholderColor">
                {' '}
                ms
              </Text>
            </Text>
          </Stat>
          <Stat label="Shards">
            <Text fontSize="$5" fontWeight="600" color="$color">
              {status.openShards}
              <Text fontSize="$2" color="$placeholderColor">
                {' '}
                / {status.shardCount} open
              </Text>
            </Text>
          </Stat>
        </XStack>
      </YStack>
    </Card>
  )
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack gap="$1" minW={140}>
      <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
        {label.toUpperCase()}
      </Text>
      {children}
    </YStack>
  )
}
