// Orders list — replaces app/admin/.../orders/page.tsx.

import { Badge, Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Card, H1, Text, XStack, YStack } from 'hanzogui'
import { formatMoney, statusVariant, type Order, type ListResponse } from '../lib/api'

export function OrdersPage() {
  const { data, error, isLoading } = useFetch<ListResponse<Order>>(
    '/v1/commerce/order?page=1&display=50',
  )

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const rows = data?.models ?? []
  if (rows.length === 0) {
    return <Empty title="No orders yet" hint="Customers will appear here after their first checkout." />
  }

  return (
    <YStack gap="$4">
      <H1 size="$8" color="$color">
        Orders{' '}
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
          <HeaderCell flex={1.5}>Order</HeaderCell>
          <HeaderCell flex={2.5}>Customer</HeaderCell>
          <HeaderCell flex={1.5}>Total</HeaderCell>
          <HeaderCell flex={1.2}>Status</HeaderCell>
          <HeaderCell flex={1.2}>Payment</HeaderCell>
          <HeaderCell flex={1.5}>Date</HeaderCell>
        </XStack>
        {rows.map((o, i) => (
          <XStack
            key={o.id}
            px="$4"
            py="$3"
            borderBottomWidth={i === rows.length - 1 ? 0 : 1}
            borderBottomColor="$borderColor"
            hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
            items="center"
          >
            <YStack flex={1.5} px="$2">
              <Text fontSize="$2" fontWeight="500" color="$color">
                #{o.number ?? o.id.slice(-6)}
              </Text>
            </YStack>
            <YStack flex={2.5} px="$2">
              <Text fontSize="$2" color="$placeholderColor" numberOfLines={1}>
                {o.email ?? '—'}
              </Text>
            </YStack>
            <YStack flex={1.5} px="$2">
              <Text fontSize="$2" color="$color">
                {formatMoney(o.total, o.currency)}
              </Text>
            </YStack>
            <YStack flex={1.2} px="$2">
              <Badge variant={statusVariant(o.status)}>{o.status ?? 'pending'}</Badge>
            </YStack>
            <YStack flex={1.2} px="$2">
              {o.paymentStatus ? (
                <Badge variant={statusVariant(o.paymentStatus)}>{o.paymentStatus}</Badge>
              ) : (
                <Text fontSize="$2" color="$placeholderColor">
                  —
                </Text>
              )}
            </YStack>
            <YStack flex={1.5} px="$2">
              <Text fontSize="$2" color="$placeholderColor">
                {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
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
