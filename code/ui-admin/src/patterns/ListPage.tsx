// ListPage — header + count + body. Body resolution:
//   - error  →  ErrorState
//   - loading→  LoadingState
//   - empty  →  Empty
//   - else   →  children
//
// Use this when a route is a "list of N things, click to drill in".
// For pages that need filter bands, custom header CTAs, or table
// chrome, bypass this and lay out the page directly. Don't fight
// the abstraction.

import type { ReactNode } from 'react'
import { H2, Text, XStack, YStack } from 'hanzogui'
import { Empty, ErrorState, LoadingState } from '../primitives/Empty'

export interface ListPageProps {
  title: string
  // Total count shown in muted text after the title.
  count?: number
  // Right-aligned slot for CTAs (e.g. "Start Workflow").
  actions?: ReactNode
  error?: Error
  isLoading?: boolean
  // True when `data.length === 0`. The Empty card renders if both
  // emptyTitle is provided and isEmpty is true.
  isEmpty?: boolean
  emptyTitle?: string
  emptyHint?: string
  emptyAction?: ReactNode
  children?: ReactNode
}

export function ListPage({
  title,
  count,
  actions,
  error,
  isLoading,
  isEmpty,
  emptyTitle,
  emptyHint,
  emptyAction,
  children,
}: ListPageProps) {
  return (
    <YStack gap="$4">
      <XStack items="baseline" justify="space-between">
        <H2 size="$7" color="$color">
          {title}
          {typeof count === 'number' ? (
            <>
              {' '}
              <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
                ({count})
              </Text>
            </>
          ) : null}
        </H2>
        {actions ? <XStack gap="$2">{actions}</XStack> : null}
      </XStack>
      {error ? (
        <ErrorState error={error} />
      ) : isLoading ? (
        <LoadingState />
      ) : isEmpty && emptyTitle ? (
        <Empty title={emptyTitle} hint={emptyHint} action={emptyAction} />
      ) : (
        children
      )}
    </YStack>
  )
}
