// Empty / loading / error placeholders shared across every list page.
// Each is a tiny block of Tamagui primitives; nothing is special-cased
// per app.

import type { ReactNode } from 'react'
import { Card, H3, Paragraph, Spinner, XStack, YStack } from 'hanzogui'

export interface EmptyProps {
  title: string
  hint?: string
  action?: ReactNode
}

export function Empty({ title, hint, action }: EmptyProps) {
  return (
    <Card p="$6" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$2" items="center">
        <H3 size="$6" color="$color">
          {title}
        </H3>
        {hint ? (
          <Paragraph color="$placeholderColor" maxW={520} text="center">
            {hint}
          </Paragraph>
        ) : null}
        {action ? <YStack mt="$3">{action}</YStack> : null}
      </YStack>
    </Card>
  )
}

export interface ErrorStateProps {
  error: Error
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <Card p="$5" bg="$background" borderColor="#7f1d1d" borderWidth={1}>
      <YStack gap="$2">
        <H3 size="$5" color="#fca5a5">
          Could not load
        </H3>
        <Paragraph
          color="$placeholderColor"
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$2"
        >
          {error.message}
        </Paragraph>
      </YStack>
    </Card>
  )
}

export interface LoadingStateProps {
  rows?: number
}

export function LoadingState({ rows = 3 }: LoadingStateProps) {
  return (
    <YStack gap="$3">
      <YStack height={28} bg="$borderColor" rounded="$2" opacity={0.5} width={200} />
      {Array.from({ length: rows }, (_, i) => (
        <YStack key={i} height={56} bg="$borderColor" rounded="$2" opacity={0.3} />
      ))}
    </YStack>
  )
}

export interface LoadingProps {
  label?: string
}

export function Loading({ label }: LoadingProps) {
  return (
    <XStack gap="$2" items="center" p="$5" justify="center">
      <Spinner size="small" />
      {label ? (
        <Paragraph color="$placeholderColor" fontSize="$2">
          {label}
        </Paragraph>
      ) : null}
    </XStack>
  )
}
