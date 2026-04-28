// Instances — running bot processes (gateway + worker nodes).

import { H2, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'

export function InstancesPage() {
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">Instances</H2>
      <Empty
        title="Instances list pending"
        hint="Wire /v1/bot/instances once the gateway exposes per-process status."
      />
    </YStack>
  )
}
