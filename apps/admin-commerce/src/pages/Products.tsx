// Products list — replaces app/admin/.../products/page.tsx (Next.js
// + @tanstack/react-table + @hanzo/commerce-ui Badge + DataTableShell).
// In Hanzo GUI v7, we render the table inline with XStack/YStack rows.

import { Badge, Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Card, H1, Text, XStack, YStack } from 'hanzogui'
import { formatMoney, statusVariant, type Product, type ListResponse } from '../lib/api'

export function ProductsPage() {
  const { data, error, isLoading } = useFetch<ListResponse<Product>>(
    '/v1/commerce/product?page=1&display=50',
  )

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const rows = data?.models ?? []
  if (rows.length === 0) {
    return <Empty title="No products yet" hint="Create one with POST /v1/commerce/product." />
  }

  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <H1 size="$8" color="$color">
          Products{' '}
          <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
            ({data?.count ?? 0})
          </Text>
        </H1>
        <Text fontSize="$3" color="$placeholderColor">
          Manage your product catalog.
        </Text>
      </YStack>
      <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <XStack
          bg={'rgba(255,255,255,0.03)' as never}
          px="$4"
          py="$2.5"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <HeaderCell flex={3}>Name</HeaderCell>
          <HeaderCell flex={2}>Slug</HeaderCell>
          <HeaderCell flex={1.5}>Price</HeaderCell>
          <HeaderCell flex={1.5}>Status</HeaderCell>
          <HeaderCell flex={1.5}>Created</HeaderCell>
        </XStack>
        {rows.map((p, i) => (
          <XStack
            key={p.id}
            px="$4"
            py="$3"
            borderBottomWidth={i === rows.length - 1 ? 0 : 1}
            borderBottomColor="$borderColor"
            hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
            items="center"
          >
            <YStack flex={3} px="$2">
              <Text fontSize="$2" fontWeight="500" color="$color">
                {p.name}
              </Text>
            </YStack>
            <YStack flex={2} px="$2">
              <Text fontSize="$2" color="$placeholderColor" numberOfLines={1}>
                {p.slug ?? '—'}
              </Text>
            </YStack>
            <YStack flex={1.5} px="$2">
              <Text fontSize="$2" color="$color">
                {formatMoney(p.price, p.currency)}
              </Text>
            </YStack>
            <YStack flex={1.5} px="$2">
              <Badge variant={statusVariant(p.status)}>{p.status ?? 'draft'}</Badge>
            </YStack>
            <YStack flex={1.5} px="$2">
              <Text fontSize="$2" color="$placeholderColor">
                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
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
