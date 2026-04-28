// Logs — server logs viewer. Replaces ui-react/pages/Logs.tsx with
// @hanzogui/admin primitives. Uses /api/logs with server-side filter.

import { useCallback, useState } from 'react'
import { Button, H1, Input, Text, XStack, YStack } from 'hanzogui'
import {
  Empty,
  ErrorState,
  LoadingState,
  useFetch,
} from '@hanzogui/admin'
import { authedFetcher, type ListResult, type LogModel } from '../lib/api'

const PER_PAGE = 50

function levelColor(level: string): string {
  if (level === 'ERROR') return '#fca5a5'
  if (level === 'WARN') return '#fcd34d'
  return '#cbd5e1'
}

export function Logs() {
  const [filter, setFilter] = useState('')
  const [filterInput, setFilterInput] = useState('')
  const [page, setPage] = useState(1)

  const url = `/api/logs?page=${page}&perPage=${PER_PAGE}&sort=-created${
    filter ? `&filter=${encodeURIComponent(`message ~ "${filter.replace(/"/g, '\\"')}"`)}` : ''
  }`
  const { data, error, isLoading } = useFetch<ListResult<LogModel>>(url, {
    fetcher: authedFetcher as never,
  })

  const onSubmit = useCallback(() => {
    setFilter(filterInput)
    setPage(1)
  }, [filterInput])

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error as Error} />

  const items = data?.items ?? []

  return (
    <YStack gap="$4" flex={1}>
      <H1 size="$9" fontWeight="600" color="$color">
        Logs
      </H1>

      <XStack gap="$2" items="center">
        <Input
          flex={1}
          maxW={520}
          size="$3"
          value={filterInput}
          onChangeText={setFilterInput}
          placeholder="Filter message…"
          onSubmitEditing={onSubmit}
        />
        <Button size="$3" onPress={onSubmit}>
          <Text fontSize="$2">Filter</Text>
        </Button>
      </XStack>

      {items.length === 0 ? (
        <Empty title="No logs" hint={filter ? 'Nothing matches the filter.' : 'Logs will appear here as the server runs.'} />
      ) : (
        <YStack gap="$1">
          {items.map((l) => (
            <XStack key={l.id} gap="$3" items="baseline">
              <Text
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
                color="$placeholderColor"
                width={210}
                numberOfLines={1}
              >
                {l.created}
              </Text>
              <Text
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
                width={64}
                color={levelColor(l.level) as never}
              >
                {l.level}
              </Text>
              <Text
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
                color="$color"
                flex={1}
                numberOfLines={1}
              >
                {l.message}
              </Text>
            </XStack>
          ))}
        </YStack>
      )}

      <XStack gap="$2" items="center" justify="center" pt="$2">
        <Button size="$2" disabled={page === 1} onPress={() => setPage((p) => Math.max(1, p - 1))}>
          <Text fontSize="$2">Prev</Text>
        </Button>
        <Text fontSize="$2" color="$placeholderColor">
          Page {page}
        </Text>
        <Button
          size="$2"
          disabled={!data || items.length < PER_PAGE}
          onPress={() => setPage((p) => p + 1)}
        >
          <Text fontSize="$2">Next</Text>
        </Button>
      </XStack>
    </YStack>
  )
}
