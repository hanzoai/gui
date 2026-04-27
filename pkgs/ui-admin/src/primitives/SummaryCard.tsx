// Summary stat card — used on detail pages to surface a count
// (Total / Running / Closed). Same shape across tasks queues, kms
// secrets, commerce orders, etc.

import { Card, H2, Text, YStack } from 'hanzogui'

export interface SummaryCardProps {
  label: string
  value: number | string
  // Accent colour token for the value text. 'success' is green, 'muted'
  // is neutral grey, default is foreground.
  accent?: 'success' | 'muted' | 'default'
}

export function SummaryCard({ label, value, accent = 'default' }: SummaryCardProps) {
  const color =
    accent === 'success' ? '#86efac' : accent === 'muted' ? '#7e8794' : '#f2f2f2'
  return (
    <Card
      p="$4"
      bg="$background"
      borderColor="$borderColor"
      borderWidth={1}
      flexBasis={200}
      flexGrow={1}
    >
      <YStack gap="$1">
        <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
          {label.toUpperCase()}
        </Text>
        <H2 size="$8" fontWeight="600" color={color as never}>
          {value}
        </H2>
      </YStack>
    </Card>
  )
}
