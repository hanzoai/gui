/**
 * Loader — a centered loading state with an optional label.
 *
 * Brand-agnostic on purpose: the shared Gui is white-labeled across brands, so
 * this uses the neutral Gui Spinner (not a brand mark). Apps that want a branded
 * full-screen loader compose their own mark over this layout.
 */
import type { ReactNode } from 'react'
import { Spinner } from '@hanzogui/spinner'
import { YStack } from '@hanzogui/stacks'
import { Text } from '../Text'

export function Loader({
  label,
  size = 'large',
}: {
  label?: ReactNode
  size?: 'small' | 'large'
}) {
  return (
    <YStack flex={1} minH={240} items="center" justify="center" gap="$3">
      <Spinner size={size} color="$color11" />
      {label ? (
        <Text fontSize="$3" color="$color11">
          {label}
        </Text>
      ) : null}
    </YStack>
  )
}
