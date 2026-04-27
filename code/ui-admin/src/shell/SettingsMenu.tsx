// SettingsMenu — gear-icon dropdown for app-wide settings. Hanzo GUI port
// of `temporal/ui` bottom-nav-settings.svelte plus the upstream
// settings dropdown (codec server, data converter, theme, sign out).
//
// Items are passed declaratively. We don't ship a fixed roster because
// admin surfaces differ: tasks needs codec-server toggles, kms needs
// rotation defaults, commerce needs payment gateway. Each app wires
// its own list, gets the same gear chrome.

import { useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { Button, Popover, Text, XStack, YStack } from 'hanzogui'
import { Settings } from '@hanzogui/lucide-icons-2/icons/Settings'

// Loose typing intentional: matches `IconComponent` in Sidebar.tsx.
// Hanzo GUI icon types use theme-token colors, plain SVG components don't —
// the shell only forwards `size` + `color` so widening here costs nothing.
export type SettingIcon = ComponentType<any>

export interface SettingItem {
  // Stable key — used as React key and `data-testid`.
  id: string
  label: string
  icon?: SettingIcon
  // Optional subtitle (e.g. "configured · localhost:5577").
  subtitle?: string
  onSelect: () => void
  // Render the row in a destructive state (red text, used for "Sign out").
  destructive?: boolean
}

export interface SettingsMenuProps {
  items: SettingItem[]
  // Optional header above the items ("Settings" by default).
  groupLabel?: string
  // Optional trigger element override — defaults to a gear icon.
  trigger?: ReactNode
  // Optional `aria-label` for the default trigger button.
  triggerLabel?: string
}

export function SettingsMenu({
  items,
  groupLabel = 'Settings',
  trigger,
  triggerLabel = 'Settings',
}: SettingsMenuProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen} placement="bottom-end">
      <Popover.Trigger asChild>
        {trigger ?? (
          <Button
            size="$2"
            chromeless
            borderWidth={1}
            borderColor="$borderColor"
            bg={'rgba(255,255,255,0.02)' as never}
            aria-label={triggerLabel}
            data-testid="settings-menu-trigger"
          >
            <Settings size={14} color="#7e8794" />
          </Button>
        )}
      </Popover.Trigger>
      <Popover.Content
        bg="$background"
        borderWidth={1}
        borderColor="$borderColor"
        p="$2"
        minW={220}
        elevate
      >
        <YStack gap="$1">
          <Text px="$2" py="$1" fontSize="$1" color="$placeholderColor" fontWeight="500">
            {groupLabel}
          </Text>
          <YStack borderBottomWidth={1} borderBottomColor="$borderColor" my="$1" />
          {items.length === 0 ? (
            <Text px="$2" py="$1.5" fontSize="$2" color="$placeholderColor" opacity={0.6}>
              No settings available
            </Text>
          ) : (
            items.map((item) => {
              const Icon = item.icon
              const labelColor = item.destructive ? '#fca5a5' : '$color'
              return (
                <XStack
                  key={item.id}
                  px="$2"
                  py="$1.5"
                  rounded="$2"
                  hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
                  cursor="pointer"
                  onPress={() => {
                    setOpen(false)
                    item.onSelect()
                  }}
                  data-testid={`settings-menu-item-${item.id}`}
                >
                  <XStack items="center" gap="$2" flex={1}>
                    {Icon ? <Icon size={14} color="#7e8794" /> : null}
                    <YStack flex={1}>
                      <Text fontSize="$2" color={labelColor as never}>
                        {item.label}
                      </Text>
                      {item.subtitle ? (
                        <Text fontSize="$1" color="$placeholderColor" opacity={0.7}>
                          {item.subtitle}
                        </Text>
                      ) : null}
                    </YStack>
                  </XStack>
                </XStack>
              )
            })
          )}
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
