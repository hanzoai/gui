// Cron — scheduled jobs registered with the bot gateway.

import { H2, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'

export function CronPage() {
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">Cron</H2>
      <Empty
        title="No scheduled jobs"
        hint="Define cron entries in bot config or via the gateway RPC."
      />
    </YStack>
  )
}
