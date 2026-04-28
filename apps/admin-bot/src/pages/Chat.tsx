// Chat — interactive conversation surface with the bot's primary
// agent. The legacy Lit view streams ACP events; the React port will
// reuse the same /v1/bot/chat WebSocket once the wire shape stabilizes.

import { H2, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'

export function ChatPage() {
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">Chat</H2>
      <Empty
        title="Chat surface in migration"
        hint="The streaming Lit chat is being ported to React. Until then, talk to the bot through any configured channel."
      />
    </YStack>
  )
}
