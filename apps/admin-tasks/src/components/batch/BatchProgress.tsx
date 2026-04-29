// BatchProgress — split progress bar showing succeeded vs failed
// fraction of the total batch. Numeric counters in the JSON envelope
// arrive as plain numbers in the React port (typed `number`).

import { Text, XStack, YStack } from 'hanzogui'

export interface BatchProgressProps {
  total: number
  completed: number
  failed?: number
  height?: number
}

export function BatchProgress({ total, completed, failed = 0, height = 6 }: BatchProgressProps) {
  const safeTotal = Math.max(0, total)
  const safeCompleted = Math.max(0, Math.min(safeTotal, completed))
  const safeFailed = Math.max(0, Math.min(safeTotal - safeCompleted, failed))
  const successPct = safeTotal === 0 ? 0 : (safeCompleted / safeTotal) * 100
  const failPct = safeTotal === 0 ? 0 : (safeFailed / safeTotal) * 100
  const donePct = Math.min(100, successPct + failPct)

  return (
    <YStack gap="$1.5" flex={1}>
      <XStack
        height={height}
        bg={'rgba(255,255,255,0.06)' as never}
        rounded={9999}
        overflow="hidden"
      >
        <YStack
          width={`${successPct}%` as never}
          height={height}
          bg={'#22c55e' as never}
        />
        <YStack
          width={`${failPct}%` as never}
          height={height}
          bg={'#ef4444' as never}
        />
      </XStack>
      <XStack justify="space-between">
        <Text fontSize="$1" color="$placeholderColor">
          {safeCompleted.toLocaleString()} / {safeTotal.toLocaleString()}
          {safeFailed > 0 ? ` (${safeFailed.toLocaleString()} failed)` : ''}
        </Text>
        <Text fontSize="$1" color="$placeholderColor">
          {donePct.toFixed(donePct >= 99.95 || donePct === 0 ? 0 : 1)}%
        </Text>
      </XStack>
    </YStack>
  )
}
