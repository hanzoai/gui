import { Link } from 'one'
import { SizableText, XStack, YStack } from 'hanzogui'

const views = [
  { href: '/login', title: 'Login', caption: 'hanzo.id single sign-on' },
  { href: '/wallet', title: 'Wallet', caption: 'Balance and AI usage' },
] as const

export default function Home() {
  return (
    <YStack p="$4" gap="$4" maxW={560} width="100%" self="center">
      <YStack gap="$1">
        <SizableText size="$7" fontWeight="600">
          Team
        </SizableText>
        <SizableText size="$3" color="$color10">
          Chat, projects, and planning for your org — one native app for mobile and
          desktop.
        </SizableText>
      </YStack>

      {views.map((view) => (
        <Link key={view.href} href={view.href} asChild>
          <XStack
            bg="$color1"
            borderWidth={1}
            borderColor="$borderColor"
            rounded="$6"
            p="$4"
            items="center"
            justify="space-between"
            cursor="pointer"
            pressStyle={{ opacity: 0.7 }}
          >
            <YStack gap="$1">
              <SizableText size="$4" fontWeight="600">
                {view.title}
              </SizableText>
              <SizableText size="$2" color="$color10">
                {view.caption}
              </SizableText>
            </YStack>
            <SizableText size="$4" color="$color10">
              →
            </SizableText>
          </XStack>
        </Link>
      ))}
    </YStack>
  )
}
