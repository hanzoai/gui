import React from 'react'
import { Text, Wrap, XStack, YStack } from '@hanzo/gui'

const Block = (props: React.ComponentProps<typeof YStack>) => (
  <YStack bg="$color" rounded="$3" p="$2" {...props} />
)

/**
 * Tracks and Wrap: the stack sizes its children, so none of them carries a
 * flex prop. A column of header, body and footer; a row of rail and page; and
 * the content-sized run of tags that wraps.
 */
export function TracksDemo() {
  return (
    <YStack width={280} self="center" gap="$3">
      <XStack tracks="1fr 1fr" gap="$3" height={150}>
        <YStack
          tracks="auto 1fr auto"
          gap="$2"
          p="$2"
          borderWidth={2}
          borderColor="$color"
          rounded="$4"
        >
          <Block />
          <Block opacity={0.4} />
          <Block />
        </YStack>

        <XStack
          tracks="20px 1fr"
          gap="$2"
          p="$2"
          borderWidth={2}
          borderColor="$color"
          rounded="$4"
        >
          <Block />
          <Block opacity={0.4} />
        </XStack>
      </XStack>

      <Wrap gap="$2">
        {['tracks', 'rows', 'columns', 'wrap', 'gap', 'grid'].map((tag) => (
          <YStack
            key={tag}
            borderWidth={1}
            borderColor="$color"
            rounded="$10"
            px="$2.5"
            py="$1"
          >
            <Text fontSize="$2">{tag}</Text>
          </YStack>
        ))}
      </Wrap>
    </YStack>
  )
}
