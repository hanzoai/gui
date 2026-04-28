// Nodes — worker / sandbox nodes connected to the gateway.

import { H2, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'

export function NodesPage() {
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">Nodes</H2>
      <Empty
        title="No nodes connected"
        hint="Worker / sandbox nodes register over WebSocket."
      />
    </YStack>
  )
}
