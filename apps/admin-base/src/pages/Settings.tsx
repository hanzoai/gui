// Settings layout — left rail with sub-nav, right pane renders the
// matched child route via <Outlet />. Sub-pages cover the slice the
// admin actually exposes today: SMTP, Rate limits, Token options.

import { NavLink, Outlet } from 'react-router-dom'
import { H2, Text, XStack, YStack } from 'hanzogui'

interface NavItem {
  to: string
  label: string
}

const navItems: NavItem[] = [
  { to: '/settings/smtp', label: 'SMTP' },
  { to: '/settings/rate-limits', label: 'Rate limits' },
  { to: '/settings/tokens', label: 'Token options' },
]

export function Settings() {
  return (
    <XStack gap="$6" flex={1} items="flex-start">
      <YStack width={180} gap="$2">
        <H2 size="$6" color="$color">
          Settings
        </H2>
        <YStack gap="$1" mt="$2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <XStack
                  px="$3"
                  py="$2"
                  rounded="$2"
                  bg={isActive ? ('rgba(255,255,255,0.06)' as never) : 'transparent'}
                  hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
                >
                  <Text
                    fontSize="$3"
                    color={isActive ? '$color' : '$placeholderColor'}
                  >
                    {item.label}
                  </Text>
                </XStack>
              )}
            </NavLink>
          ))}
        </YStack>
      </YStack>
      <YStack flex={1} minWidth={0}>
        <Outlet />
      </YStack>
    </XStack>
  )
}
