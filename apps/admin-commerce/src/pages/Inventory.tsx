// Inventory list.

import { Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Card, H1, Text, XStack, YStack } from 'hanzogui'
import type { InventoryItem, ListResponse } from '../lib/api'

export function InventoryPage() {
  const { data, error, isLoading } = useFetch<ListResponse<InventoryItem>>(
    '/v1/commerce/stocklocation?page=1&display=50',
  )

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const rows = data?.models ?? []
  if (rows.length === 0) {
    return <Empty title="No stock locations" hint="Add a stock location to start tracking inventory." />
  }

  return (
    <YStack gap="$4">
      <H1 size="$8" color="$color">
        Inventory{' '}
        <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
          ({data?.count ?? 0})
        </Text>
      </H1>
      <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <XStack
          bg={'rgba(255,255,255,0.03)' as never}
          px="$4"
          py="$2.5"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <HeaderCell flex={2}>SKU</HeaderCell>
          <HeaderCell flex={2}>Location</HeaderCell>
          <HeaderCell flex={1}>Quantity</HeaderCell>
          <HeaderCell flex={1}>Reserved</HeaderCell>
          <HeaderCell flex={1.5}>Updated</HeaderCell>
        </XStack>
        {rows.map((it, i) => (
          <XStack
            key={it.id}
            px="$4"
            py="$3"
            borderBottomWidth={i === rows.length - 1 ? 0 : 1}
            borderBottomColor="$borderColor"
            items="center"
          >
            <YStack flex={2} px="$2">
              <Text fontSize="$2" fontWeight="500" color="$color">
                {it.sku ?? it.variantId ?? it.id}
              </Text>
            </YStack>
            <YStack flex={2} px="$2">
              <Text fontSize="$2" color="$placeholderColor">
                {it.location ?? '—'}
              </Text>
            </YStack>
            <YStack flex={1} px="$2">
              <Text fontSize="$2" color="$color">
                {it.quantity}
              </Text>
            </YStack>
            <YStack flex={1} px="$2">
              <Text fontSize="$2" color="$placeholderColor">
                {it.reserved ?? 0}
              </Text>
            </YStack>
            <YStack flex={1.5} px="$2">
              <Text fontSize="$2" color="$placeholderColor">
                {it.updatedAt ? new Date(it.updatedAt).toLocaleString() : '—'}
              </Text>
            </YStack>
          </XStack>
        ))}
      </Card>
    </YStack>
  )
}

function HeaderCell({ children, flex }: { children: React.ReactNode; flex: number }) {
  return (
    <YStack flex={flex} px="$2">
      <Text fontSize="$1" fontWeight="500" color="$placeholderColor">
        {children}
      </Text>
    </YStack>
  )
}
