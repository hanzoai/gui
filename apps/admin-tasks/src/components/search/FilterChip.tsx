// FilterChip — one rounded badge in the FilterBar. Renders the
// label, an optional value, and an "x" button that calls onRemove.
// Click on the body opens an editor (parent-controlled — the chip
// only fires onClick).

import type { ReactNode } from 'react'
import { Button, Text, XStack } from 'hanzogui'
import { X } from '@hanzogui/lucide-icons-2/icons/X'

export interface FilterChipProps {
  label: string
  value?: ReactNode
  onClick?: () => void
  onRemove?: () => void
  // Disables interaction; rendered with reduced opacity.
  disabled?: boolean
  testId?: string
}

export function FilterChip({
  label,
  value,
  onClick,
  onRemove,
  disabled = false,
  testId,
}: FilterChipProps) {
  return (
    <XStack
      data-testid={testId}
      px="$2"
      py="$1"
      gap="$1.5"
      items="center"
      borderWidth={1}
      borderColor={'$borderColor'}
      bg={'rgba(255,255,255,0.03)' as never}
      rounded="$3"
      opacity={disabled ? 0.5 : 1}
      hoverStyle={disabled ? undefined : { background: 'rgba(255,255,255,0.06)' as never }}
      cursor={onClick && !disabled ? ('pointer' as never) : undefined}
      onPress={onClick && !disabled ? onClick : undefined}
    >
      <Text fontSize="$1" fontWeight="500" color="$placeholderColor" letterSpacing={0.2}>
        {label}
      </Text>
      {value !== undefined ? (
        <Text fontSize="$2" color="$color" numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {onRemove ? (
        <Button
          size="$1"
          chromeless
          onPress={(e: { stopPropagation?: () => void } | undefined) => {
            e?.stopPropagation?.()
            onRemove()
          }}
          aria-label={`Remove ${label} filter`}
        >
          <X size={11} color="#7e8794" />
        </Button>
      ) : null}
    </XStack>
  )
}
