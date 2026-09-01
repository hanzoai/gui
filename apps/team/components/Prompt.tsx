import { Link } from 'one'
import { SizableText, XStack, YStack } from '@hanzo/gui'

// The signed-out state, one place for every screen that has one: what the screen
// is, and the single way in. Screens differ only in the words.
export function Prompt({
  title,
  caption,
}: {
  title: string
  caption: string
}): React.ReactElement {
  return (
    <YStack p="$4" gap="$3" maxW={560} width="100%" self="center">
      <SizableText size="$6" fontWeight="600">
        {title}
      </SizableText>
      <SizableText size="$3" color="$color10">
        {caption}
      </SizableText>
      <Link href="/login" asChild>
        <XStack
          bg="$color"
          rounded="$10"
          px="$4"
          py="$2.5"
          self="flex-start"
          cursor="pointer"
          pressStyle={{ opacity: 0.8 }}
        >
          <SizableText size="$3" fontWeight="600" color="$background">
            Sign in
          </SizableText>
        </XStack>
      </Link>
    </YStack>
  )
}
