import { ExternalLink } from '@hanzogui/lucide-icons-2'
import { Anchor, H2, Paragraph, XStack, YStack } from '@hanzo/gui'
import { ToastControl } from 'components/CurrentToast'

export default function TabOneScreen() {
  return (
    <YStack flex={1} items="center" gap="$8" px="$10" pt="$5" bg="$background">
      <H2>Gui + Expo</H2>

      <ToastControl />

      <XStack
        items="center"
        justify="center"
        flexWrap="wrap"
        gap="$1.5"
        position="absolute"
        b="$8"
      >
        <Paragraph fontSize="$5">Add</Paragraph>

        <Paragraph fontSize="$5" px="$2" py="$1" color="$blue10" bg="$blue5">
          gui.config.ts
        </Paragraph>

        <Paragraph fontSize="$5">to root and follow the</Paragraph>

        <XStack
          items="center"
          gap="$1.5"
          px="$2"
          py="$1"
          rounded="$3"
          bg="$green5"
          hoverStyle={{ bg: '$green6' }}
          pressStyle={{ bg: '$green4' }}
        >
          <Anchor
            href="https://gui.hanzo.ai/docs/core/configuration"
            textDecorationLine="none"
            color="$green10"
            fontSize="$5"
          >
            Configuration guide
          </Anchor>
          <ExternalLink size="$1" color="$green10" />
        </XStack>

        <Paragraph fontSize="$5" text="center">
          to configure your themes and tokens.
        </Paragraph>
      </XStack>
    </YStack>
  )
}
