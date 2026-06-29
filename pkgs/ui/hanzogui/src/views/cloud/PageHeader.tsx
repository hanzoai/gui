/**
 * PageHeader — section title + optional subtitle and right-aligned actions.
 *
 * A cloud-console layout primitive: the heading row every admin/data surface
 * opens with. Built on the Gui stack + text primitives (shorthand style props),
 * so it adapts across web and native and inherits the active theme.
 */
import type { ReactNode } from 'react'
import { XStack, YStack } from '@hanzogui/stacks'
import { Text } from '../Text'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <XStack justify="space-between" items="flex-start" gap="$4">
      <YStack gap="$1">
        <Text fontSize="$7" fontWeight="800">
          {title}
        </Text>
        {subtitle ? (
          <Text fontSize="$3" color="$color11">
            {subtitle}
          </Text>
        ) : null}
      </YStack>
      {actions ? <XStack gap="$2">{actions}</XStack> : null}
    </XStack>
  )
}
