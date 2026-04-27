// ErrorBoundary — class component (the only place we use one). Hanzo GUI
// port of `temporal/ui` `holocene/error-boundary.svelte`. React still
// requires class components for error boundaries; everything else is
// hooks. The fallback is a small Card matching `ErrorState` so a
// crashed page looks like a failed fetch.

import React, { type ReactNode } from 'react'
import { Card, H3, Paragraph, YStack } from 'hanzogui'

export interface ErrorBoundaryProps {
  children: ReactNode
  // Optional custom fallback. Receives the error so the caller can
  // surface a contextual message ("Workflow detail crashed") rather
  // than the generic "Something went wrong".
  fallback?: (err: Error) => ReactNode
  // Optional sink for telemetry (Sentry, etc.). Called once per
  // distinct error captured.
  onError?: (err: Error, info: React.ErrorInfo) => void
}

interface State {
  err: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  state: State = { err: null }

  static getDerivedStateFromError(err: Error): State {
    return { err }
  }

  componentDidCatch(err: Error, info: React.ErrorInfo): void {
    this.props.onError?.(err, info)
  }

  reset = (): void => {
    this.setState({ err: null })
  }

  render(): ReactNode {
    if (!this.state.err) return this.props.children
    if (this.props.fallback) return this.props.fallback(this.state.err)
    return (
      <Card
        p="$5"
        bg="$background"
        borderColor={'#7f1d1d' as never}
        borderWidth={1}
        data-testid="error-boundary"
      >
        <YStack gap="$2">
          <H3 size="$5" color={'#fca5a5' as never}>
            Something went wrong
          </H3>
          <Paragraph
            color="$placeholderColor"
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$2"
          >
            {this.state.err.message}
          </Paragraph>
        </YStack>
      </Card>
    )
  }
}
