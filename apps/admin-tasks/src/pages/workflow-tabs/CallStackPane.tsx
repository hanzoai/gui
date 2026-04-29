// CallStackPane — renders the structured __enhanced_stack_trace query.
// Worker SDKs that support it emit JSON; we render frames in tabular
// form. Falls back to the raw string parse when the response is plain
// text (older Go SDK).

import { useCallback, useEffect, useState } from 'react'
import { Button, Card, Spinner, Text, XStack, YStack } from 'hanzogui'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Alert, Badge } from '@hanzogui/admin'
import { ApiError, Workflows } from '../../lib/api'
import {
  decodePayloadAsString,
  parseEnhancedStackTrace,
  parseStackTrace,
  type EnhancedStack,
  type ParsedStack,
} from '../../lib/stack-trace'

export interface CallStackPaneProps {
  ns: string
  workflowId: string
  runId: string
  running: boolean
  auto?: boolean
}

type View =
  | { kind: 'enhanced'; sdk: string; stacks: EnhancedStack[] }
  | { kind: 'plain'; sdk: string; stacks: ParsedStack[] }
  | { kind: 'empty' }

function viewFromText(text: string): View {
  if (!text) return { kind: 'empty' }
  const trimmed = text.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const e = parseEnhancedStackTrace(trimmed)
    if (e.stacks.length > 0) return { kind: 'enhanced', sdk: e.sdk, stacks: e.stacks }
  }
  const p = parseStackTrace(text)
  return p.stacks.length > 0
    ? { kind: 'plain', sdk: p.sdk, stacks: p.stacks }
    : { kind: 'empty' }
}

export function CallStackPane({
  ns,
  workflowId,
  runId,
  running,
  auto = true,
}: CallStackPaneProps) {
  const [view, setView] = useState<View | null>(null)
  const [err, setErr] = useState<{ status: number; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [capturedAt, setCapturedAt] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setErr(null)
    try {
      const resp = await Workflows.query(ns, workflowId, runId, '__enhanced_stack_trace')
      const text = decodePayloadAsString(resp?.result)
      setView(viewFromText(text))
      setCapturedAt(new Date().toISOString())
    } catch (e) {
      if (e instanceof ApiError) setErr({ status: e.status, message: e.message })
      else setErr({ status: 0, message: e instanceof Error ? e.message : String(e) })
    } finally {
      setLoading(false)
    }
  }, [ns, workflowId, runId])

  useEffect(() => {
    if (running && auto && view === null && err === null) void load()
  }, [running, auto, view, err, load])

  if (!running) {
    return (
      <Alert title="Call stack requires a running workflow">
        This workflow is not running, so there is no live call stack to query.
      </Alert>
    )
  }

  return (
    <YStack gap="$3">
      <XStack items="center" justify="space-between">
        <Text fontSize="$2" color="$placeholderColor">
          Calls QueryWorkflow(__enhanced_stack_trace) on the worker.
          {capturedAt ? ` Captured ${capturedAt}.` : ''}
        </Text>
        <Button size="$2" chromeless onPress={load} disabled={loading}>
          <XStack items="center" gap="$1.5">
            {loading ? <Spinner size="small" /> : <RefreshCw size={14} color="#7e8794" />}
            <Text fontSize="$2">{loading ? 'Querying…' : capturedAt ? 'Refresh' : 'Capture'}</Text>
          </XStack>
        </Button>
      </XStack>

      {err ? (
        err.status === 501 ? (
          <Alert title="Worker SDK runtime not yet shipped">
            Enhanced call stack lands when the worker SDK runtime ships. Until
            then the engine returns 501.
          </Alert>
        ) : (
          <Alert variant="destructive" title={`Query failed (${err.status || 'network'})`}>
            {err.message}
          </Alert>
        )
      ) : view === null ? (
        <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <Text fontSize="$2" color="$placeholderColor">
            {loading ? 'Capturing call stack…' : 'Click Capture to query the worker.'}
          </Text>
        </Card>
      ) : view.kind === 'empty' ? (
        <Alert title="Empty call stack">
          The worker returned no frames — the workflow may be parked between
          activities.
        </Alert>
      ) : view.kind === 'enhanced' ? (
        <YStack gap="$3">
          <XStack items="center" gap="$2">
            <Badge>SDK: {view.sdk}</Badge>
            <Text fontSize="$1" color="$placeholderColor">
              {view.stacks.length} stack{view.stacks.length === 1 ? '' : 's'}
            </Text>
          </XStack>
          {view.stacks.map((s, i) => (
            <Card key={i} p="$3" bg="$background" borderColor="$borderColor" borderWidth={1} gap="$2">
              <Text fontSize="$2" color="$color" fontWeight="500">
                {s.name || `stack ${i + 1}`}
              </Text>
              <YStack gap="$1">
                {s.frames.map((f, j) => (
                  <YStack key={j} gap={2}>
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
                      {f.filePath ?? '(unknown)'}
                      {f.line ? `:${f.line}` : ''}
                      {f.column ? `:${f.column}` : ''}
                    </Text>
                  </YStack>
                ))}
              </YStack>
            </Card>
          ))}
        </YStack>
      ) : (
        <YStack gap="$3">
          <XStack items="center" gap="$2">
            <Badge>SDK: {view.sdk}</Badge>
            <Text fontSize="$1" color="$placeholderColor">
              {view.stacks.length} stack{view.stacks.length === 1 ? '' : 's'} (plain-text fallback)
            </Text>
          </XStack>
          {view.stacks.map((s, i) => (
            <Card key={i} p="$3" bg="$background" borderColor="$borderColor" borderWidth={1} gap="$2">
              {s.header ? (
                <Text fontSize="$2" color="$color" fontWeight="500">
                  {s.header}
                </Text>
              ) : null}
              <YStack gap="$1">
                {s.frames.map((f, j) => (
                  <Text
                    key={j}
                    fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                    fontSize="$1"
                    color="$color"
                  >
                    {f.functionName ? `${f.functionName}\n  ` : ''}
                    {f.filePath ? `${f.filePath}${f.line ? `:${f.line}` : ''}` : f.raw}
                  </Text>
                ))}
              </YStack>
            </Card>
          ))}
        </YStack>
      )}
    </YStack>
  )
}
