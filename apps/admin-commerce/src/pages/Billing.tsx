// Billing — read-only catalog from /v1/commerce/billing/plans, then a
// balance card pulled from /v1/commerce/billing/balance/all.

import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Card, H1, H3, Text, XStack, YStack } from 'hanzogui'
import { formatMoney, type BillingPlan } from '../lib/api'

interface PlansResp {
  plans?: BillingPlan[]
}

interface BalanceResp {
  balances?: Array<{ currency: string; cents: number }>
}

export function BillingPage() {
  const plans = useFetch<PlansResp>('/v1/commerce/billing/plans')
  const balances = useFetch<BalanceResp>('/v1/commerce/billing/balance/all')

  if (plans.error && balances.error) return <ErrorState error={plans.error as Error} />
  const isLoading = plans.isLoading || balances.isLoading

  return (
    <YStack gap="$5">
      <YStack gap="$2">
        <H1 size="$8" color="$color">
          Billing
        </H1>
        <Text fontSize="$3" color="$placeholderColor">
          Org balances + available subscription plans.
        </Text>
      </YStack>

      <YStack gap="$3">
        <H3 size="$5" color="$color">
          Balances
        </H3>
        {isLoading ? (
          <LoadingState />
        ) : (balances.data?.balances ?? []).length === 0 ? (
          <Text fontSize="$2" color="$placeholderColor">
            No balance records.
          </Text>
        ) : (
          <XStack gap="$3" flexWrap="wrap">
            {(balances.data?.balances ?? []).map((b) => (
              <Card
                key={b.currency}
                p="$4"
                minW={200}
                bg="$background"
                borderColor="$borderColor"
                borderWidth={1}
              >
                <Text fontSize="$1" color="$placeholderColor" textTransform="uppercase">
                  {b.currency}
                </Text>
                <Text fontSize="$7" fontWeight="600" color="$color">
                  {formatMoney(b.cents, b.currency)}
                </Text>
              </Card>
            ))}
          </XStack>
        )}
      </YStack>

      <YStack gap="$3">
        <H3 size="$5" color="$color">
          Plans
        </H3>
        {isLoading ? (
          <LoadingState />
        ) : (
          <XStack gap="$3" flexWrap="wrap">
            {(plans.data?.plans ?? []).map((p) => (
              <Card
                key={p.slug}
                p="$4"
                minW={260}
                bg="$background"
                borderColor="$borderColor"
                borderWidth={1}
              >
                <YStack gap="$2">
                  <Text fontSize="$1" color="$placeholderColor" textTransform="uppercase">
                    {p.category ?? 'Plan'}
                  </Text>
                  <Text fontSize="$5" fontWeight="600" color="$color">
                    {p.name}
                  </Text>
                  {p.description ? (
                    <Text fontSize="$2" color="$placeholderColor">
                      {p.description}
                    </Text>
                  ) : null}
                  <Text fontSize="$4" color="$color" mt="$2">
                    {formatMoney(p.priceMonth, p.currency)} / mo
                  </Text>
                </YStack>
              </Card>
            ))}
          </XStack>
        )}
      </YStack>
    </YStack>
  )
}
