// Saved views rail — left rail of clickable presets for a list view.
// Each preset has a label + opaque query string. The rail is purely
// presentational: it renders the items, highlights the active one,
// and calls onSelect when a row is clicked.
//
// Reusable across admin apps — Workflows uses it for workflow query
// presets, KMS could mount it for saved searches, etc. The shape of
// the query string is opaque to the rail; the page owns it.

import type { ComponentType } from 'react'
import { Text, XStack, YStack } from 'hanzogui'

export type SavedViewIcon = ComponentType<{ size?: number; color?: string }>

export interface SavedView {
  id: string
  label: string
  query: string
  icon?: SavedViewIcon
}

export interface SavedViewsRailProps {
  views: SavedView[]
  activeId: string | null
  onSelect: (view: SavedView) => void
  // Optional heading copy for the rail. Defaults to "Saved views".
  heading?: string
  // Optional override for rail width (default 200px).
  width?: number
}

export function SavedViewsRail({
  views,
  activeId,
  onSelect,
  heading = 'Saved views',
  width = 200,
}: SavedViewsRailProps) {
  return (
    <YStack
      width={width}
      borderRightWidth={1}
      borderRightColor="$borderColor"
      bg={'rgba(7,11,19,0.4)' as never}
      py="$3"
      gap="$1"
    >
      <Text
        px="$4"
        pb="$2"
        fontSize="$1"
        color="$placeholderColor"
        fontWeight="600"
        letterSpacing={0.4}
        textTransform={'uppercase' as any}
      >
        {heading}
      </Text>
      {views.map((view) => {
        const isActive = view.id === activeId
        const Icon = view.icon
        return (
          <XStack
            key={view.id}
            mx="$2"
            px="$2.5"
            py="$2"
            rounded="$3"
            items="center"
            gap="$2"
            cursor="pointer"
            bg={isActive ? ('rgba(255,255,255,0.06)' as never) : 'transparent'}
            hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
            onPress={() => onSelect(view)}
          >
            {Icon ? (
              <Icon size={14} color={isActive ? '#f2f2f2' : '#7e8794'} />
            ) : null}
            <Text fontSize="$2" color={isActive ? '$color' : '$placeholderColor'}>
              {view.label}
            </Text>
          </XStack>
        )
      })}
    </YStack>
  )
}
