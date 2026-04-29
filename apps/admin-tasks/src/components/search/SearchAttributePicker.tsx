// SearchAttributePicker — typeahead over the namespace's known
// attribute schema. Shared by SearchBuilder and the batch creator.

import { useMemo, useState } from 'react'
import { Input, Text, YStack } from 'hanzogui'
import { Badge } from '@hanzogui/admin'
import type { SearchAttributesSchema } from '../../lib/types'

export interface SearchAttributePickerProps {
  schema: SearchAttributesSchema
  value: string
  onChange: (next: string) => void
  placeholder?: string
}

export function SearchAttributePicker({
  schema,
  value,
  onChange,
  placeholder = 'Attribute name',
}: SearchAttributePickerProps) {
  const [focus, setFocus] = useState(false)
  const matches = useMemo(() => {
    const q = value.toLowerCase()
    const all = Object.entries(schema)
    if (!q) return all.slice(0, 8)
    return all.filter(([k]) => k.toLowerCase().includes(q)).slice(0, 8)
  }, [schema, value])

  return (
    <YStack position="relative" flex={1}>
      <Input
        size="$3"
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocus(true)}
        // 150ms grace lets a click on a suggestion register before blur
        // collapses the popover.
        onBlur={() => setTimeout(() => setFocus(false), 150)}
      />
      {focus && matches.length > 0 ? (
        <YStack
          position="absolute"
          t={42}
          l={0}
          r={0}
          bg="$background"
          borderWidth={1}
          borderColor="$borderColor"
          rounded="$2"
          z={10}
          overflow="hidden"
        >
          {matches.map(([k, t], i) => (
            <YStack
              key={k}
              px="$3"
              py="$2"
              borderTopWidth={i === 0 ? 0 : 1}
              borderTopColor="$borderColor"
              cursor={'pointer' as never}
              hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
              onPress={() => onChange(k)}
            >
              <YStack gap="$1">
                <Text fontSize="$2" color="$color">
                  {k}
                </Text>
                <Badge variant="muted">{t}</Badge>
              </YStack>
            </YStack>
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}
