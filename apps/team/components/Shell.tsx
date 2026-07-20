import { ChevronDown } from '@hanzogui/lucide-icons-2'
import { Linking } from 'react-native'
import { ScrollView, SizableText, XStack, YStack } from 'hanzogui'
import { Mark } from './Mark'
import { SchemeToggle } from './Scheme'

const surfaces = [
  { name: 'AI', url: 'https://hanzo.ai' },
  { name: 'Cloud', url: 'https://cloud.hanzo.ai' },
  { name: 'Console', url: 'https://console.hanzo.ai' },
  { name: 'App', url: 'https://hanzo.app' },
  { name: 'Team', url: '' },
] as const

// app frame: AppHeader (mark · org row · five-surface switcher) over content
export const Shell = ({ children }: { children: React.ReactNode }) => (
  <YStack flex={1} minH="100%" bg="$background">
    <YStack borderBottomWidth={1} borderColor="$borderColor" px="$4" pt="$3" pb="$2" gap="$2">
      <XStack items="center" gap="$3">
        <Mark size={22} />

        <XStack
          items="center"
          gap="$2"
          rounded="$4"
          px="$2"
          py="$1"
          cursor="pointer"
          pressStyle={{ bg: '$color1' }}
        >
          <YStack width={20} height={20} rounded={999} bg="$color" items="center" justify="center">
            <SizableText size="$1" fontWeight="700" color="$background">
              H
            </SizableText>
          </YStack>
          <SizableText size="$3" fontWeight="600">
            Hanzo
          </SizableText>
          <ChevronDown size={14} color="$color10" />
        </XStack>

        <XStack flex={1} />
        <SchemeToggle />
      </XStack>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$2">
          {surfaces.map((surface) => {
            const active = surface.name === 'Team'
            return (
              <XStack
                key={surface.name}
                rounded="$10"
                px="$3"
                py="$1.5"
                borderWidth={1}
                borderColor={active ? '$borderColor' : 'transparent'}
                bg={active ? '$color1' : 'transparent'}
                cursor="pointer"
                pressStyle={{ opacity: 0.6 }}
                onPress={() => {
                  if (surface.url) Linking.openURL(surface.url)
                }}
              >
                <SizableText size="$2" color={active ? '$color' : '$color10'}>
                  {surface.name}
                </SizableText>
              </XStack>
            )
          })}
        </XStack>
      </ScrollView>
    </YStack>

    {children}
  </YStack>
)
