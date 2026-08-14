import { useState } from 'react'
import { Linking } from 'react-native'
import { useRouter } from 'one'
import { ChevronDown } from '@hanzogui/lucide-icons-2'
import { ScrollView, SizableText, XStack, YStack } from '@hanzo/gui'
import { Mark } from './Mark'
import { SchemeToggle } from './Scheme'
import { SURFACES } from '~/src/surfaces'
import { useSession } from '~/src/session'

// app frame: AppHeader (mark · org switcher · seven-surface switcher · auth) over content
export const Shell = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { session, signOut } = useSession()
  const [orgOpen, setOrgOpen] = useState(false)
  const [activeOrg, setActiveOrg] = useState<string | undefined>(undefined)

  const orgs = session?.user?.orgs ?? []
  const currentOrg = activeOrg ?? orgs[0] ?? 'Hanzo'
  const signedIn = session != null

  return (
    <YStack flex={1} minH="100%" bg="$background">
      <YStack
        borderBottomWidth={1}
        borderColor="$borderColor"
        px="$4"
        pt="$3"
        pb="$2"
        gap="$2"
      >
        <XStack items="center" gap="$3">
          <Mark size={22} />

          <YStack position="relative">
            <XStack
              items="center"
              gap="$2"
              rounded="$4"
              px="$2"
              py="$1"
              cursor="pointer"
              pressStyle={{ bg: '$color1' }}
              onPress={() => setOrgOpen((v) => (orgs.length > 1 ? !v : v))}
            >
              <YStack
                width={20}
                height={20}
                rounded={999}
                bg="$color"
                items="center"
                justify="center"
              >
                <SizableText size="$1" fontWeight="700" color="$background">
                  {currentOrg.charAt(0).toUpperCase()}
                </SizableText>
              </YStack>
              <SizableText size="$3" fontWeight="600">
                {currentOrg}
              </SizableText>
              {orgs.length > 1 ? <ChevronDown size={14} color="$color10" /> : null}
            </XStack>

            {orgOpen && orgs.length > 1 ? (
              <YStack
                position="absolute"
                t={38}
                l={0}
                minW={180}
                bg="$background"
                borderWidth={1}
                borderColor="$borderColor"
                rounded="$4"
                py="$1"
                z={100}
              >
                {orgs.map((org) => (
                  <XStack
                    key={org}
                    px="$3"
                    py="$2"
                    cursor="pointer"
                    pressStyle={{ bg: '$color1' }}
                    onPress={() => {
                      setActiveOrg(org)
                      setOrgOpen(false)
                    }}
                  >
                    <SizableText
                      size="$3"
                      color={org === currentOrg ? '$color' : '$color10'}
                    >
                      {org}
                    </SizableText>
                  </XStack>
                ))}
              </YStack>
            ) : null}
          </YStack>

          <XStack flex={1} />

          {signedIn ? (
            <XStack
              rounded="$10"
              px="$3"
              py="$1.5"
              borderWidth={1}
              borderColor="$borderColor"
              cursor="pointer"
              pressStyle={{ opacity: 0.6 }}
              onPress={() => void signOut()}
            >
              <SizableText size="$2" color="$color10">
                Sign out
              </SizableText>
            </XStack>
          ) : (
            <XStack
              rounded="$10"
              px="$3"
              py="$1.5"
              bg="$color"
              cursor="pointer"
              pressStyle={{ opacity: 0.8 }}
              onPress={() => router.push('/login')}
            >
              <SizableText size="$2" color="$background" fontWeight="600">
                Sign in
              </SizableText>
            </XStack>
          )}

          <SchemeToggle />
        </XStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$2">
            {SURFACES.map((surface) => {
              const active = surface.id === 'team'
              return (
                <XStack
                  key={surface.id}
                  rounded="$10"
                  px="$3"
                  py="$1.5"
                  borderWidth={1}
                  borderColor={active ? '$borderColor' : 'transparent'}
                  bg={active ? '$color1' : 'transparent'}
                  cursor="pointer"
                  pressStyle={{ opacity: 0.6 }}
                  onPress={() => {
                    if (!active) void Linking.openURL(surface.href)
                  }}
                >
                  <SizableText size="$2" color={active ? '$color' : '$color10'}>
                    {surface.label}
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
}
