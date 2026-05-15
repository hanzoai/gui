import type { ReactNode } from 'react'
import { Button, Stack, Text, XStack, YStack } from '@hanzo/gui'

export type DashboardNavItem = {
  label: string
  active?: boolean
  onPress: () => void
}

export type DashboardShellProps = {
  brand?: ReactNode
  navItems: DashboardNavItem[]
  topBar?: ReactNode
  children: ReactNode
}

export function DashboardShell({
  brand = <Text fontWeight="800">Hanzo</Text>,
  navItems,
  topBar,
  children,
}: DashboardShellProps) {
  return (
    <XStack flex={1} minHeight="100vh">
      <YStack
        width={240}
        padding="$3"
        gap="$2"
        borderRightWidth={1}
        borderColor="$gray6"
        backgroundColor="$gray2"
      >
        <Stack paddingY="$3">{brand}</Stack>
        {navItems.map((item) => (
          <Button
            key={item.label}
            onPress={item.onPress}
            backgroundColor={item.active ? '$gray5' : 'transparent'}
            justifyContent="flex-start"
          >
            {item.label}
          </Button>
        ))}
      </YStack>
      <YStack flex={1}>
        <XStack
          height={56}
          paddingX="$4"
          alignItems="center"
          borderBottomWidth={1}
          borderColor="$gray6"
        >
          {topBar}
        </XStack>
        <Stack flex={1} padding="$4">
          {children}
        </Stack>
      </YStack>
    </XStack>
  )
}
