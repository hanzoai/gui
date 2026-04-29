// WorkflowSearchBar — visibility-query input. Validates input via
// parseSearchQuery before emitting; bad input is shown inline so the
// page doesn't fire a guaranteed-error fetch.

import { useCallback, useState } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { Search } from '@hanzogui/lucide-icons-2/icons/Search'
import { parseSearchQuery, QueryParseError } from '../../lib/format'

export interface WorkflowSearchBarProps {
  value: string
  onChange: (next: string) => void
  onSubmit: (validated: string) => void
  placeholder?: string
}

export function WorkflowSearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'WorkflowType="MyWorkflow" OR WorkflowId STARTS_WITH "abc"',
}: WorkflowSearchBarProps) {
  const [err, setErr] = useState<string | null>(null)

  const submit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed) {
      setErr(null)
      onSubmit('')
      return
    }
    try {
      parseSearchQuery(trimmed)
      setErr(null)
      onSubmit(trimmed)
    } catch (e) {
      if (e instanceof QueryParseError) setErr(e.message)
      else setErr(e instanceof Error ? e.message : String(e))
    }
  }, [value, onSubmit])

  return (
    <YStack gap="$1.5" flex={1} maxW={720}>
      <XStack gap="$2" items="center">
        <Input
          size="$3"
          flex={1}
          placeholder={placeholder}
          value={value}
          onChangeText={(v: string) => {
            onChange(v)
            if (err) setErr(null)
          }}
          onSubmitEditing={submit}
        />
        <Button size="$3" onPress={submit} aria-label="Submit query">
          <XStack items="center" gap="$1.5">
            <Search size={14} color="#cbd5e1" />
            <Text fontSize="$2">Search</Text>
          </XStack>
        </Button>
      </XStack>
      {err ? (
        <Text fontSize="$1" color={'#fca5a5' as never}>
          {err}
        </Text>
      ) : null}
    </YStack>
  )
}
