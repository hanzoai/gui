// Skills — the registered skill catalog the bot's agents can invoke.

import { H2, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'

export function SkillsPage() {
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">Skills</H2>
      <Empty
        title="Skills catalog pending"
        hint="Wire /v1/bot/skills once the catalog endpoint stabilizes."
      />
    </YStack>
  )
}
