// StackTracePane — runs the worker's __stack_trace query and renders
// the parsed goroutine / call stack blocks. The native engine returns
// 501 for queries today; this UI surfaces that as a polite hint rather
// than a wall of red text.

import { useCallback, useEffect, useState } from 'react'
import { Button, Card, Spinner, Text, XStack, YStack } from 'hanzogui'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Alert } from '@hanzogui/admin'
import { ApiError, Workflows } from '../../lib/api'
import { decodePayloadAsString, parseStackTrace, type ParsedStack } from '../../lib/stack-trace'

export interface StackTracePaneProps {
  ns: string
  workflowId: string
  runId: string
  running: boolean
  // When true, fires the query on mount. Default true so the tab feels
  // live like upstream.
  auto?: boolean
}

export function StackTracePane({
  ns,
  workflowId,
  runId,
  running,
  auto = true,
}: StackTracePaneProps) {
  const [text, setText] = useState<string | null>(null)
  const [err, setErr] = useState<{ status: number; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [capturedAt, setCapturedAt] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setErr(null)
    try {
      const resp = await Workflows.query(ns, workflowId, runId, '__stack_trace')
      const decoded = decodePayloadAsString(resp?.result)
      setText(decoded)
      setCapturedAt(new Date().toISOString())
    } catch (e) {
      if (e instanceof ApiError) setErr({ status: e.status, message: e.message })
      else setErr({ status: 0, message: e instanceof Error ? e.message : String(e) })
    } finally {
      setLoading(false)
    }
  }, [ns, workflowId, runId])

  useEffect(() => {
    if (running && auto && text === null && err === null) void load()
  }, [running, auto, text, err, load])

  if (!running) {
    return (
      <Alert title="Stack trace requires a running workflow">
        This workflow is not running, so there is no live stack trace to query.
        Re-open while the workflow is in progress to capture a snapshot.
      </Alert>
    )
  }

  const parsed = text !== null ? parseStackTrace(text) : null

  return (
    <YStack gap="$3">
      <XStack items="center" justify="space-between">
        <Text fontSize="$2" color="$placeholderColor">
          Calls QueryWorkflow(__stack_trace) on the worker.
          {capturedAt ? ` Captured ${capturedAt}.` : ''}
        </Text>
        <Button size="$2" chromeless onPress={load} disabled={loading}>
          <XStack items="center" gap="$1.5">
            {loading ? <Spinner size="small" /> : <RefreshCw size={14} color="#7e8794" />}
            <Text fontSize="$2">{loading ? 'Querying…' : capturedAt ? 'Refresh' : 'Capture stack'}</Text>
          </XStack>
        </Button>
      </XStack>

      {err ? (
        err.status === 501 ? (
          <Alert title="Worker SDK runtime not yet shipped">
            Stack-trace queries land when the worker SDK runtime ships. Until then
            the engine returns 501 — that's the honest answer rather than a
            fabricated frame.
          </Alert>
        ) : (
          <Alert variant="destructive" title={`Query failed (${err.status || 'network'})`}>
            {err.message}
          </Alert>
        )
      ) : parsed ? (
        parsed.stacks.length === 0 ? (
          <Alert title="Empty stack">
            The worker returned an empty stack — the workflow may be parked
            between activities.
          </Alert>
        ) : (
          <YStack gap="$3">
            {parsed.stacks.map((s, i) => (
              <StackBlock key={i} stack={s} />
            ))}
          </YStack>
        )
      ) : (
        <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <Text fontSize="$2" color="$placeholderColor">
            {loading ? 'Capturing stack…' : 'Click Capture stack to query the worker.'}
          </Text>
        </Card>
      )}
    </YStack>
  )
}

function StackBlock({ stack }: { stack: ParsedStack }) {
  return (
    <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1} gap="$2">
      {stack.header ? (
        <Text fontSize="$2" color="$color" fontWeight="500">
          {stack.header}
        </Text>
      ) : null}
      <YStack gap="$1">
        {stack.frames.map((f, i) => (
          <YStack key={i} gap={2}>
            {f.functionName ? (
              <Text
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
                color="$color"
              >
                {f.functionName}
              </Text>
            ) : null}
            <Text
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              fontSize="$1"
              color="$placeholderColor"
            >
              {f.filePath ? `${f.filePath}${f.line ? `:${f.line}` : ''}${f.column ? `:${f.column}` : ''}` : f.raw}
            </Text>
          </YStack>
        ))}
      </YStack>
    </Card>
  )
}
