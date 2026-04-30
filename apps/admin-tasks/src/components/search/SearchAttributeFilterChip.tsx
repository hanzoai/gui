// SearchAttributeFilterChip — keyspace-aware filter on a single
// custom or system search attribute. The chip lets the user pick
// the attribute name from the live schema, then renders a value
// editor whose shape matches the attribute's type:
//
//   Keyword / Text   → string Input
//   Int / Double     → numeric Input
//   Bool             → on/off toggle
//   Datetime         → ISO datetime Input
//   KeywordList      → comma-separated string → IN(…)
//
// Disabled (with a tooltip-style label) when advanced visibility
// is off — the namespace cannot answer the query.

import { useEffect, useMemo, useState } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { useFetch } from '@hanzogui/admin'
import { Search, type SearchAttributesResponse } from '../../lib/api'
import {
  SEARCH_ATTRIBUTE_TYPE,
  type SearchAttributesSchema,
  type SearchAttributeType,
} from '../../lib/types'
import { SearchAttributePicker } from './SearchAttributePicker'
import { FilterChip } from './FilterChip'
import type { QueryClause, QueryOp } from '../../lib/format'

export interface SearchAttributeFilterChipProps {
  namespace: string
  // Existing clause (when editing) or null/undefined (when adding a
  // fresh chip).
  initial?: QueryClause | null
  onChange: (next: QueryClause | null) => void
  onRemove?: () => void
  // When false the chip renders disabled — used to gate on
  // advancedVisibilityEnabled.
  enabled?: boolean
}

function defaultOp(t: SearchAttributeType | undefined): QueryOp {
  if (t === SEARCH_ATTRIBUTE_TYPE.KEYWORDLIST) return 'IN'
  return '='
}

function valueToString(v: QueryClause['value']): string {
  if (Array.isArray(v)) return v.map(String).join(', ')
  return String(v)
}

export function SearchAttributeFilterChip({
  namespace,
  initial,
  onChange,
  onRemove,
  enabled = true,
}: SearchAttributeFilterChipProps) {
  const [open, setOpen] = useState(false)
  const [field, setField] = useState(initial?.field ?? '')
  const [value, setValue] = useState<string>(
    initial ? valueToString(initial.value) : '',
  )

  const { data } = useFetch<SearchAttributesResponse>(Search.attributesUrl(namespace))
  const schema = useMemo<SearchAttributesSchema>(() => {
    if (!data) return {}
    return { ...(data.systemAttributes ?? {}), ...(data.customAttributes ?? {}) }
  }, [data])

  const type = field ? schema[field] : undefined

  // Keep local state in sync with the parent when a fresh
  // `initial` is passed (e.g. switching to edit a different chip).
  useEffect(() => {
    setField(initial?.field ?? '')
    setValue(initial ? valueToString(initial.value) : '')
  }, [initial?.field, initial])

  function emit(nextField: string, nextValue: string) {
    if (!nextField || nextValue.trim() === '') {
      onChange(null)
      return
    }
    const op = defaultOp(schema[nextField])
    let parsed: QueryClause['value']
    if (op === 'IN') {
      parsed = nextValue
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    } else if (
      schema[nextField] === SEARCH_ATTRIBUTE_TYPE.INT ||
      schema[nextField] === SEARCH_ATTRIBUTE_TYPE.DOUBLE
    ) {
      const n = Number(nextValue)
      parsed = Number.isFinite(n) ? n : nextValue
    } else if (schema[nextField] === SEARCH_ATTRIBUTE_TYPE.BOOL) {
      parsed = nextValue === 'true' ? 'true' : 'false'
    } else {
      parsed = nextValue
    }
    onChange({ type: 'clause', field: nextField, op, value: parsed })
  }

  const summary = field
    ? `${field} ${defaultOp(type)} ${value || '…'}`
    : 'Pick attribute'

  return (
    <YStack position="relative">
      <FilterChip
        label="Attribute"
        value={
          <XStack items="center" gap="$1">
            <Text fontSize="$2" color="$color" numberOfLines={1}>
              {summary}
            </Text>
            <ChevronDown size={11} color="#7e8794" />
          </XStack>
        }
        onClick={() => enabled && setOpen((v) => !v)}
        onRemove={onRemove}
        disabled={!enabled}
        testId="filter-chip-attribute"
      />
      {open && enabled ? (
        <YStack
          position="absolute"
          t={32}
          l={0}
          minW={360}
          bg="$background"
          borderWidth={1}
          borderColor="$borderColor"
          rounded="$3"
          z={20}
          p="$2"
          gap="$2"
        >
          <SearchAttributePicker
            schema={schema}
            value={field}
            onChange={(v: string) => {
              setField(v)
              emit(v, value)
            }}
          />
          <ValueEditor
            type={type}
            value={value}
            onChange={(v: string) => {
              setValue(v)
              emit(field, v)
            }}
          />
          <XStack justify="flex-end">
            <Button size="$1" chromeless onPress={() => setOpen(false)}>
              <Text fontSize="$1" color="$placeholderColor">
                Done
              </Text>
            </Button>
          </XStack>
        </YStack>
      ) : null}
    </YStack>
  )
}

function ValueEditor({
  type,
  value,
  onChange,
}: {
  type: SearchAttributeType | undefined
  value: string
  onChange: (next: string) => void
}) {
  if (type === SEARCH_ATTRIBUTE_TYPE.BOOL) {
    return (
      <XStack gap="$1.5" items="center">
        <Button
          size="$2"
          chromeless
          borderWidth={1}
          borderColor={value === 'true' ? ('#86efac' as never) : '$borderColor'}
          onPress={() => onChange('true')}
        >
          <Text fontSize="$2">true</Text>
        </Button>
        <Button
          size="$2"
          chromeless
          borderWidth={1}
          borderColor={value === 'false' ? ('#fca5a5' as never) : '$borderColor'}
          onPress={() => onChange('false')}
        >
          <Text fontSize="$2">false</Text>
        </Button>
      </XStack>
    )
  }
  if (type === SEARCH_ATTRIBUTE_TYPE.DATETIME) {
    return (
      <Input
        size="$2"
        placeholder="2026-01-01T00:00:00Z"
        value={value}
        onChangeText={onChange}
      />
    )
  }
  if (type === SEARCH_ATTRIBUTE_TYPE.INT || type === SEARCH_ATTRIBUTE_TYPE.DOUBLE) {
    return (
      <Input
        size="$2"
        placeholder="0"
        value={value}
        onChangeText={onChange}
        keyboardType={'numeric' as never}
      />
    )
  }
  if (type === SEARCH_ATTRIBUTE_TYPE.KEYWORDLIST) {
    return (
      <Input
        size="$2"
        placeholder="value-a, value-b"
        value={value}
        onChangeText={onChange}
      />
    )
  }
  // Default: keyword / text.
  return (
    <Input size="$2" placeholder="value" value={value} onChangeText={onChange} />
  )
}
