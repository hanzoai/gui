// Overview — counts of products, orders, customers, collections.
// Replaces app/admin/src/app/(dashboard)/overview/page.tsx (Next.js
// + tailwind grids + @hanzo/commerce-ui Heading/Text/Container).

import { Card, H1, H3, Text, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Boxes } from '@hanzogui/lucide-icons-2/icons/Boxes'
import { Package } from '@hanzogui/lucide-icons-2/icons/Package'
import { ShoppingBag } from '@hanzogui/lucide-icons-2/icons/ShoppingBag'
import { Users } from '@hanzogui/lucide-icons-2/icons/Users'

interface CountResp {
  count: number
}

function StatCard({
  label,
  count,
  loading,
  Icon,
}: {
  label: string
  count?: number
  loading: boolean
  Icon: React.ComponentType<{ size?: number; color?: string }>
}) {
  return (
    <Card p="$5" bg="$background" borderColor="$borderColor" borderWidth={1} flex={1} minW={220}>
      <XStack items="center" gap="$3">
        <YStack
          width={36}
          height={36}
          rounded="$3"
          bg={'rgba(255,255,255,0.04)' as never}
          items="center"
          justify="center"
        >
          <Icon size={18} color="#7e8794" />
        </YStack>
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor" textTransform="uppercase">
            {label}
          </Text>
          {loading ? (
            <YStack height={26} width={64} bg="$borderColor" rounded="$2" opacity={0.5} />
          ) : (
            <Text fontSize="$7" fontWeight="600" color="$color">
              {(count ?? 0).toLocaleString()}
            </Text>
          )}
        </YStack>
      </XStack>
    </Card>
  )
}

export function OverviewPage() {
  const products = useFetch<CountResp>('/v1/commerce/product?page=1&display=1')
  const orders = useFetch<CountResp>('/v1/commerce/order?page=1&display=1')
  const customers = useFetch<CountResp>('/v1/commerce/c/user?page=1&display=1')
  const collections = useFetch<CountResp>('/v1/commerce/collection?page=1&display=1')

  const errors = [products.error, orders.error, customers.error, collections.error].filter(Boolean)
  if (errors.length === 4) return <ErrorState error={errors[0] as Error} />

  return (
    <YStack gap="$5">
      <YStack gap="$2">
        <H1 size="$8" color="$color">
          Overview
        </H1>
        <Text fontSize="$3" color="$placeholderColor">
          Live counts from the embedded SQLite shard for this org.
        </Text>
      </YStack>
      <XStack gap="$4" flexWrap="wrap">
        <StatCard label="Products" count={products.data?.count} loading={products.isLoading} Icon={Package} />
        <StatCard label="Orders" count={orders.data?.count} loading={orders.isLoading} Icon={ShoppingBag} />
        <StatCard label="Customers" count={customers.data?.count} loading={customers.isLoading} Icon={Users} />
        <StatCard
          label="Collections"
          count={collections.data?.count}
          loading={collections.isLoading}
          Icon={Boxes}
        />
      </XStack>
      <XStack gap="$4" flexWrap="wrap">
        <RecentSection title="Recent Orders" loading={orders.isLoading} count={orders.data?.count} />
        <RecentSection title="Top Products" loading={products.isLoading} count={products.data?.count} />
      </XStack>
    </YStack>
  )
}

function RecentSection({
  title,
  loading,
  count,
}: {
  title: string
  loading: boolean
  count?: number
}) {
  return (
    <Card p="$5" bg="$background" borderColor="$borderColor" borderWidth={1} flex={1} minW={320}>
      <H3 size="$5" color="$color">
        {title}
      </H3>
      {loading ? (
        <LoadingState />
      ) : (
        <YStack mt="$3" py="$6" items="center">
          <Text fontSize="$2" color="$placeholderColor">
            {count ? `${count} total` : 'No data yet'}
          </Text>
        </YStack>
      )}
    </Card>
  )
}
