// Pre-built EmptyState variants. Upstream `temporal/ui`
// `empty-states/no-query-results.svelte` is one of two variants over a
// single `Empty` shell — we already have a generic `Empty` primitive,
// so the variants here are thin wrappers that supply icon + title +
// hint. Each takes only the props that vary at the call site (search
// query, retry handler, etc.) so pages don't restate the boilerplate.

import type { ReactNode } from 'react'
import { Card, H3, Paragraph, XStack, YStack } from 'hanzogui'
import { Layers } from '@hanzogui/lucide-icons-2/icons/Layers'
import { Search } from '@hanzogui/lucide-icons-2/icons/Search'
import { Inbox } from '@hanzogui/lucide-icons-2/icons/Inbox'
import { WifiOff } from '@hanzogui/lucide-icons-2/icons/WifiOff'

interface ShellProps {
  icon: ReactNode
  title: string
  hint?: string
  action?: ReactNode
  testID?: string
}

function Shell({ icon, title, hint, action, testID }: ShellProps) {
  return (
    <Card
      p="$6"
      bg="$background"
      borderColor="$borderColor"
      borderWidth={1}
      {...(testID ? { 'data-testid': testID } : {})}
    >
      <YStack gap="$3" items="center">
        <XStack
          width={48}
          height={48}
          rounded={9999}
          items="center"
          justify="center"
          bg={'rgba(255,255,255,0.04)' as never}
        >
          {icon}
        </XStack>
        <H3 size="$6" color="$color">
          {title}
        </H3>
        {hint ? (
          <Paragraph color="$placeholderColor" maxW={520} text="center">
            {hint}
          </Paragraph>
        ) : null}
        {action ? <YStack mt="$2">{action}</YStack> : null}
      </YStack>
    </Card>
  )
}

export interface NoNamespacesProps {
  action?: ReactNode
}

export function NoNamespaces({ action }: NoNamespacesProps) {
  return (
    <Shell
      icon={<Layers size={20} color="#7e8794" />}
      title="No namespaces"
      hint="Create a namespace through the Tasks CLI or `tasksd operator namespace create`."
      action={action}
      testID="empty-no-namespaces"
    />
  )
}

export interface NoSearchResultsProps {
  query?: string
  action?: ReactNode
}

export function NoSearchResults({ query, action }: NoSearchResultsProps) {
  const hint = query
    ? `No matches for "${query}". Try a broader query or clear the filter.`
    : 'No matches. Try a broader query or clear the filter.'
  return (
    <Shell
      icon={<Search size={20} color="#7e8794" />}
      title="No results"
      hint={hint}
      action={action}
      testID="empty-no-search-results"
    />
  )
}

export interface NoDataProps {
  resource?: string
  action?: ReactNode
}

export function NoData({ resource = 'data', action }: NoDataProps) {
  return (
    <Shell
      icon={<Inbox size={20} color="#7e8794" />}
      title={`No ${resource}`}
      hint="Nothing has been recorded yet."
      action={action}
      testID="empty-no-data"
    />
  )
}

export interface NetworkErrorProps {
  onRetry?: () => void
  message?: string
}

export function NetworkError({ onRetry, message }: NetworkErrorProps) {
  // The retry button is rendered via XStack + onPress to stay framework-
  // free here — pages that need a labeled button can pass `action` to
  // `Empty` directly. We keep this variant minimal: a click-anywhere
  // hint when `onRetry` is wired.
  return (
    <Card
      p="$6"
      bg="$background"
      borderColor={'#7f1d1d' as never}
      borderWidth={1}
      {...(onRetry ? { onPress: onRetry, cursor: 'pointer' } : {})}
      data-testid="empty-network-error"
    >
      <YStack gap="$3" items="center">
        <XStack
          width={48}
          height={48}
          rounded={9999}
          items="center"
          justify="center"
          bg={'rgba(127,29,29,0.18)' as never}
        >
          <WifiOff size={20} color="#fca5a5" />
        </XStack>
        <H3 size="$6" color={'#fca5a5' as never}>
          Network error
        </H3>
        <Paragraph color="$placeholderColor" maxW={520} text="center">
          {message ?? 'Could not reach the server. Check your connection and try again.'}
        </Paragraph>
        {onRetry ? (
          <Paragraph color="$placeholderColor" fontSize="$1" opacity={0.8}>
            Click to retry
          </Paragraph>
        ) : null}
      </YStack>
    </Card>
  )
}
