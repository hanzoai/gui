// LabelRow — the labelled-row layout shared by every IAM edit page
// in this bucket. Upstream Casdoor used a `grid-cols-[160px_1fr]`
// pattern for ~50 rows per page; we collapse that into one
// primitive so the LDAP/Syncer/Webhook/Invitation pages compose
// rows with the same gutter, label width, and alignment.
//
// Distinct from `iam/identity/Field` (which wraps a typed scalar
// input + label + error stack). This is purely a 2-column layout
// shell; the caller decides what control sits in the right column.

import type { ReactNode } from 'react'
import { Text, XStack, YStack } from 'hanzogui'

export interface LabelRowProps {
  label: ReactNode
  // When `align="start"` the label sits at the top of the row,
  // matching how upstream rendered tables / editors / textareas.
  align?: 'center' | 'start'
  children: ReactNode
}

const LABEL_WIDTH = 160

export function LabelRow({ label, align = 'center', children }: LabelRowProps) {
  // Hanzogui v7's `items` maps to React Native's FlexAlignType
  // ("flex-start" | "flex-end" | ...). We expose the simpler
  // start/center vocabulary on this primitive — translate at the
  // boundary so callers don't need to think in RN flex names.
  const itemsValue = align === 'start' ? 'flex-start' : 'center'
  return (
    <XStack gap="$4" items={itemsValue}>
      <YStack width={LABEL_WIDTH} pt={align === 'start' ? '$2' : 0}>
        <Text fontSize="$2" color="$placeholderColor">
          {label}
        </Text>
      </YStack>
      <YStack flex={1}>{children}</YStack>
    </XStack>
  )
}
