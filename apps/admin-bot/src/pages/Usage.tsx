// Usage — model token / billing usage broken down by agent and channel.

import { H2, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'

export function UsagePage() {
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">Usage</H2>
      <Empty
        title="Usage telemetry pending"
        hint="The legacy Lit usage tab renders billing totals; React port pending /v1/bot/usage shape."
      />
    </YStack>
  )
}
