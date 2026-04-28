// Customers list — replaces app/admin/.../customers/page.tsx.

import { Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Card, H1, Text, XStack, YStack } from 'hanzogui'
import { formatMoney, type Customer, type ListResponse } from '../lib/api'

export function CustomersPage() {
  const { data, error, isLoading } = useFetch<ListResponse<Customer>>(
    '/v1/commerce/c/user?page=1&display=50',
  )

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const rows = data?.models ?? []
  if (rows.length === 0) {
    return <Empty title="No customers yet" hint="Customers register at first purchase." />
  }

  return (
    <YStack gap="$4">
      <H1 size="$8" color="$color">
        Customers{' '}
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
          <HeaderCell flex={3}>Email</HeaderCell>
          <HeaderCell flex={2}>Name</HeaderCell>
          <HeaderCell flex={1.2}>Orders</HeaderCell>
          <HeaderCell flex={1.5}>Total Spend</HeaderCell>
          <HeaderCell flex={1.5}>Joined</HeaderCell>
        </XStack>
        {rows.map((c, i) => (
          <XStack
            key={c.id}
            px="$4"
            py="$3"
            borderBottomWidth={i === rows.length - 1 ? 0 : 1}
            borderBottomColor="$borderColor"
            hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
            items="center"
          >
            <YStack flex={3} px="$2">
              <Text fontSize="$2" fontWeight="500" color="$color">
                {c.email}
              </Text>
            </YStack>
            <YStack flex={2} px="$2">
              <Text fontSize="$2" color="$placeholderColor">
                {c.name ?? '—'}
              </Text>
            </YStack>
            <YStack flex={1.2} px="$2">
              <Text fontSize="$2" color="$color">
                {c.ordersCount ?? 0}
              </Text>
            </YStack>
            <YStack flex={1.5} px="$2">
              <Text fontSize="$2" color="$color">
                {c.totalSpend != null ? formatMoney(c.totalSpend) : '—'}
              </Text>
            </YStack>
            <YStack flex={1.5} px="$2">
              <Text fontSize="$2" color="$placeholderColor">
                {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
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
