// Debug — runtime introspection: build info, feature flags, env scan.

import { Card, H2, Paragraph, YStack } from 'hanzogui'
import { Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'

export function DebugPage() {
  const { data, error, isLoading } = useFetch<{ info: Record<string, unknown> }>('/v1/bot/debug')
  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  if (!data?.info) {
    return <Empty title="No debug info" hint="The gateway hasn't published debug info." />
  }
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">Debug</H2>
      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <Paragraph fontSize="$2" whiteSpace="pre-wrap">
          {JSON.stringify(data.info, null, 2)}
        </Paragraph>
      </Card>
    </YStack>
  )
}
