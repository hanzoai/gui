// Config — read-only view of the resolved bot configuration.

import { Card, H2, Paragraph, YStack } from 'hanzogui'
import { Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'

export function ConfigPage() {
  const { data, error, isLoading } = useFetch<{ config: unknown }>('/v1/bot/config')
  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  if (!data?.config) {
    return <Empty title="No config" hint="The gateway hasn't published a config snapshot." />
  }
  return (
    <YStack gap="$4">
      <H2 size="$7" color="$color">Config</H2>
      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <Paragraph fontSize="$2" whiteSpace="pre-wrap">
          {JSON.stringify(data.config, null, 2)}
        </Paragraph>
      </Card>
    </YStack>
  )
}
