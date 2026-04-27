// Queries pane — interactive query runner. The user types a queryType
// (e.g. "currentState"), optional JSON args, and POSTs to the same
// /query endpoint the call-stack tab uses. The engine returns 501 for
// every queryType except __stack_trace today; we surface that 501 as
// the same "worker SDK runtime not yet shipped" hint instead of a
// generic error wall.

import { useState } from 'react'
import { Button, Card, Input, Spinner, Text, TextArea, XStack, YStack } from 'hanzogui'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Alert } from '@hanzo/admin'
import { ApiError, apiPost } from '../../lib/api'

export function QueriesPane({
  ns,
  workflowId,
  runId,
  running,
}: {
  ns: string
  workflowId: string
  runId: string
  running: boolean
}) {
  const [queryType, setQueryType] = useState('currentState')
  const [args, setArgs] = useState('')
  const [result, setResult] = useState<unknown>(null)
  const [err, setErr] = useState<{ status: number; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    setLoading(true)
    setErr(null)
    setResult(null)
    let parsedArgs: unknown = null
    if (args.trim()) {
      try {
        parsedArgs = JSON.parse(args)
      } catch (e) {
        setErr({
          status: 0,
          message: `Could not parse args as JSON: ${e instanceof Error ? e.message : String(e)}`,
        })
        setLoading(false)
        return
      }
    }
    try {
      const resp = await apiPost<unknown>(
        `/v1/tasks/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(workflowId)}/query?runId=${encodeURIComponent(runId)}`,
        parsedArgs === null
          ? { queryType }
          : { queryType, args: parsedArgs },
      )
      setResult(resp)
    } catch (e) {
      if (e instanceof ApiError) {
        setErr({ status: e.status, message: e.message })
      } else {
        setErr({ status: 0, message: e instanceof Error ? e.message : String(e) })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!running) {
    return (
      <Alert title="Queries require a running workflow">
        This workflow is not running, so there is no worker available to answer
        a query. Re-open while it is in progress.
      </Alert>
    )
  }

  return (
    <YStack gap="$3">
      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <YStack gap="$1">
            <Text fontSize="$1" color="$placeholderColor">
              Query type
            </Text>
            <Input
              size="$3"
              value={queryType}
              onChangeText={setQueryType}
              placeholder="currentState"
            />
          </YStack>
          <YStack gap="$1">
            <Text fontSize="$1" color="$placeholderColor">
              Args (JSON, optional)
            </Text>
            <TextArea
              size="$3"
              minH={80}
              value={args}
              onChangeText={setArgs}
              placeholder={'{"key": "value"}'}
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            />
          </YStack>
          <XStack justify="flex-end">
            <Button size="$2" chromeless onPress={run} disabled={loading || !queryType}>
              <XStack items="center" gap="$1.5">
                {loading ? <Spinner size="small" /> : <RefreshCw size={14} color="#7e8794" />}
                <Text fontSize="$2">{loading ? 'Querying…' : 'Run query'}</Text>
              </XStack>
            </Button>
          </XStack>
        </YStack>
      </Card>

      {err ? (
        err.status === 501 ? (
          <Alert title="Worker SDK runtime not yet shipped">
            Custom queries land when the worker SDK runtime ships. Until then
            the engine returns 501 for any queryType other than __stack_trace —
            that's the honest answer rather than a fabricated frame.
          </Alert>
        ) : (
          <Alert variant="destructive" title={`Query failed (${err.status || 'network'})`}>
            {err.message}
          </Alert>
        )
      ) : result !== null ? (
        <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <Text
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$1"
            color="$color"
          >
            {JSON.stringify(result, null, 2)}
          </Text>
        </Card>
      ) : null}
    </YStack>
  )
}
