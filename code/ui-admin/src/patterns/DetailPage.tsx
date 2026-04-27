// DetailPage — back link, eyebrow + title, optional summary cards
// row, and a body slot. Same shape used on namespace detail, workflow
// detail, task queue detail, secret detail, etc.

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { H1, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2'

export interface DetailPageProps {
  // Back-link target + label. If absent the back row is hidden.
  back?: { to: string; label: string }
  // Eyebrow text shown above the title (e.g. "TASK QUEUE", "SECRET").
  eyebrow?: string
  title: string
  // Summary stat cards row — pass <SummaryCard /> instances.
  summary?: ReactNode
  // Right-aligned actions slot adjacent to the title row.
  actions?: ReactNode
  children?: ReactNode
}

export function DetailPage({ back, eyebrow, title, summary, actions, children }: DetailPageProps) {
  return (
    <YStack gap="$5">
      {back ? (
        <Link to={back.to} style={{ textDecoration: 'none', color: 'inherit' }}>
          <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
            <ChevronLeft size={14} color="#7e8794" />
            <Text fontSize="$2" color="$placeholderColor">
              {back.label}
            </Text>
          </XStack>
        </Link>
      ) : null}

      <XStack items="flex-end" justify="space-between" gap="$3">
        <YStack gap="$1">
          {eyebrow ? (
            <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
              {eyebrow}
            </Text>
          ) : null}
          <H1 size="$7" color="$color" fontWeight="600">
            {title}
          </H1>
        </YStack>
        {actions ? <XStack gap="$2">{actions}</XStack> : null}
      </XStack>

      {summary ? (
        <XStack gap="$3" flexWrap="wrap">
          {summary}
        </XStack>
      ) : null}

      {children}
    </YStack>
  )
}
