// Status pill — paints a small rounded chip in one of five variants.
// Reused on every list table for the status column.

import type { ReactNode } from 'react'
import { Text, XStack } from 'hanzogui'
import { badgeColors, type StatusVariant } from '../data/format'

export interface BadgeProps {
  variant?: StatusVariant
  children: ReactNode
}

export function Badge({ variant = 'muted', children }: BadgeProps) {
  const c = badgeColors(variant)
  return (
    <XStack
      px="$2"
      py="$1"
      rounded="$2"
      bg={c.bg as never}
      self="flex-start"
      items="center"
    >
      <Text fontSize="$1" color={c.fg as never} fontWeight="500">
        {children}
      </Text>
    </XStack>
  )
}
