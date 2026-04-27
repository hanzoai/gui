// JSON pane — shared rendering for Memo, Search attributes. Both are
// key/value bags on the workflow start; if the engine has them we
// pretty-print, otherwise we surface the equivalent of upstream's
// "empty memo attributes" copy.

import { Card, Text, YStack } from 'hanzogui'
import { Empty } from '@hanzogui/admin'

export function JsonPane({
  data,
  emptyTitle,
  emptyHint,
}: {
  data: Record<string, unknown> | null | undefined
  emptyTitle: string
  emptyHint: string
}) {
  const present =
    data && typeof data === 'object' && Object.keys(data).length > 0

  if (!present) {
    return <Empty title={emptyTitle} hint={emptyHint} />
  }

  return (
    <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack>
        <Text
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$1"
          color="$color"
        >
          {JSON.stringify(data, null, 2)}
        </Text>
      </YStack>
    </Card>
  )
}
