// Collections list.

import { Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Card, H1, Text, XStack, YStack } from 'hanzogui'
import type { Collection, ListResponse } from '../lib/api'

export function CollectionsPage() {
  const { data, error, isLoading } = useFetch<ListResponse<Collection>>(
    '/v1/commerce/collection?page=1&display=50',
  )

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const rows = data?.models ?? []
  if (rows.length === 0) {
    return <Empty title="No collections" hint="Group products under collections to organize the storefront." />
  }

  return (
    <YStack gap="$4">
      <H1 size="$8" color="$color">
        Collections{' '}
        <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
          ({data?.count ?? 0})
        </Text>
      </H1>
      <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
        {rows.map((col, i) => (
          <XStack
            key={col.id}
            px="$4"
            py="$3"
            borderBottomWidth={i === rows.length - 1 ? 0 : 1}
            borderBottomColor="$borderColor"
            items="center"
            hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
          >
            <YStack flex={3}>
              <Text fontSize="$2" fontWeight="500" color="$color">
                {col.name}
              </Text>
              <Text fontSize="$1" color="$placeholderColor">
                {col.slug ?? col.id}
              </Text>
            </YStack>
            <YStack flex={1} items="flex-end">
              <Text fontSize="$2" color="$placeholderColor">
                {col.productCount ?? 0} products
              </Text>
            </YStack>
          </XStack>
        ))}
      </Card>
    </YStack>
  )
}
