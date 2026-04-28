// SearchInput — port of upstream temporalio/ui search.svelte fused
// with the advanced-visibility-guard. Single-line query box that
// auto-detects Temporal-SQL syntax (key = "value", AND, OR, BETWEEN,
// STARTS_WITH, IS NULL/NOT NULL) and surfaces a syntax help popover
// when SQL is detected. Falls back to a plain text-search hint
// otherwise.
//
// The detection runs locally against the input; no server round-trip.
// Callers receive the raw query — interpretation is the API's job.

import { useMemo, useState } from 'react'
import { Input, Popover, Text, XStack, YStack } from 'hanzogui'
import { HelpCircle } from '@hanzogui/lucide-icons-2/icons/HelpCircle'
import { Search } from '@hanzogui/lucide-icons-2/icons/Search'

export interface SearchInputProps {
  value: string
  onChange: (next: string) => void
  // When the form is submitted (Enter key). Receives the current
  // value. Optional — controlled-input parents can react on
  // onChange instead.
  onSubmit?: (value: string) => void
  placeholder?: string
  // Called by upstream "advanced-visibility-guard" — when false,
  // SQL hints stay hidden and the icon collapses to plain Search.
  // Defaults to true (most servers enable advanced visibility).
  advancedVisibility?: boolean
}

// Heuristic SQL detection. Matches anything that looks like a
// Temporal visibility filter:
//   • a key="value" / key='value' / key=value pair
//   • AND / OR / BETWEEN keywords (whitespace-bounded)
//   • STARTS_WITH / IS NULL / IS NOT NULL operators
// One match flips the input into "advanced" mode. False positives
// (a free-text search containing the literal word "AND") are
// acceptable — users see a help popover, not a parser error.
const SQL_PATTERN =
  /(?:[A-Za-z][\w]*\s*(?:=|!=|>=?|<=?)\s*["'])|(?:\s+(?:AND|OR|BETWEEN)\s+)|(?:\bSTARTS_WITH\b)|(?:\bIS\s+(?:NOT\s+)?NULL\b)/i

export function isAdvancedQuery(s: string): boolean {
  return SQL_PATTERN.test(s)
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search…',
  advancedVisibility = true,
}: SearchInputProps) {
  const [helpOpen, setHelpOpen] = useState(false)
  const advanced = useMemo(
    () => advancedVisibility && isAdvancedQuery(value),
    [advancedVisibility, value],
  )

  return (
    <XStack flex={1} items="center" gap="$2">
      <XStack
        flex={1}
        items="center"
        position="relative"
        // Visually nest the search icon inside the Input. Hanzogui v7
        // dropped per-prop padding overrides on Input; we wrap the
        // input in an absolute-positioned XStack and use the wrapper's
        // padding so the input still gets keyboard hit-testing across
        // the full row.
        pl="$8"
      >
        <XStack
          position="absolute"
          l="$3"
          z={1}
          items="center"
          pointerEvents={'none' as never}
        >
          <Search size={14} color="#7e8794" />
        </XStack>
        <Input
          flex={1}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={() => onSubmit?.(value)}
          aria-label="Search"
          // ARIA "search" role requires role="searchbox" not "search"
          // on the actual input element. Hanzo GUI passes through.
          role={'searchbox' as never}
        />
      </XStack>
      {advanced ? (
        <Popover open={helpOpen} onOpenChange={setHelpOpen} placement="bottom-end">
          <Popover.Trigger asChild>
            <XStack
              role={'button' as never}
              aria-label="Query syntax help"
              cursor={'help' as never}
              p="$2"
              rounded="$2"
              hoverStyle={{ background: 'rgba(255,255,255,0.06)' as never }}
              onPress={() => setHelpOpen((v) => !v)}
            >
              <HelpCircle size={16} color="#93c5fd" />
            </XStack>
          </Popover.Trigger>
          <Popover.Content
            bg="$background"
            borderColor="$borderColor"
            borderWidth={1}
            p="$4"
            maxW={420}
          >
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$color">
                Advanced query syntax
              </Text>
              <Text fontSize="$2" color="$placeholderColor">
                Filter workflows with SQL-like predicates. Supported operators:
                <Text fontFamily={'ui-monospace, monospace' as never}>
                  {' '}= != &gt; &lt; &gt;= &lt;= AND OR BETWEEN STARTS_WITH IS NULL
                </Text>
                .
              </Text>
              <YStack
                bg={'rgba(255,255,255,0.04)' as never}
                p="$2"
                rounded="$2"
                gap="$1"
              >
                <Hint code='ExecutionStatus="Running"' />
                <Hint code='WorkflowType STARTS_WITH "Order"' />
                <Hint code='StartTime BETWEEN "2026-01-01" AND "2026-02-01"' />
                <Hint code='ParentWorkflowId IS NULL' />
              </YStack>
            </YStack>
          </Popover.Content>
        </Popover>
      ) : null}
    </XStack>
  )
}

function Hint({ code }: { code: string }) {
  return (
    <Text
      fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
      fontSize="$1"
      color={'#86efac' as never}
    >
      {code}
    </Text>
  )
}
