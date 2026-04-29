// BatchCreate — wizard page for starting a bulk operation. The form
// is short on purpose: kind picker, visibility query, reason, and a
// dry-run preview that lists the matched executions before any write
// goes out. We never let a user submit without first running the
// preview — the upstream Svelte UI also blocks "Start" until the
// match count is known.
//
// SearchBuilder lives in FEATURE-3. If that component lands at the
// path below, we'll switch the textarea to it; until then a plain
// TextArea keeps the wizard usable and keeps typecheck clean.

import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  H1,
  H4,
  Input,
  Spinner,
  Text,
  TextArea,
  XStack,
  YStack,
} from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Play } from '@hanzogui/lucide-icons-2/icons/Play'
import { Search } from '@hanzogui/lucide-icons-2/icons/Search'
import { Alert, Badge, ErrorState } from '@hanzogui/admin'
import { ApiError, Batches, Workflows } from '../lib/api'
import type { WorkflowExecution } from '../lib/api'
import { BatchKindIcon, type BatchKind } from '../components/batch/BatchKindIcon'

const KINDS: Array<{ kind: BatchKind; wire: string; help: string }> = [
  { kind: 'Cancel', wire: 'BATCH_OPERATION_TYPE_CANCEL', help: 'Request cancel on every match.' },
  {
    kind: 'Terminate',
    wire: 'BATCH_OPERATION_TYPE_TERMINATE',
    help: 'Terminate every match — irreversible.',
  },
  {
    kind: 'Signal',
    wire: 'BATCH_OPERATION_TYPE_SIGNAL',
    help: 'Send a signal name + payload to every match.',
  },
  {
    kind: 'Reset',
    wire: 'BATCH_OPERATION_TYPE_RESET',
    help: 'Reset every match to a re-applied event id.',
  },
  {
    kind: 'UpdateOptions',
    wire: 'BATCH_OPERATION_TYPE_UPDATE_EXECUTION_OPTIONS',
    help: 'Update versioning override / execution options on every match.',
  },
]

const PREVIEW_LIMIT = 10

export function BatchCreatePage() {
  const { ns } = useParams()
  const namespace = ns!
  const navigate = useNavigate()

  const [kind, setKind] = useState<BatchKind>('Terminate')
  const [query, setQuery] = useState("ExecutionStatus=\"Running\"")
  const [reason, setReason] = useState('')
  const [signalName, setSignalName] = useState('')
  const [signalPayload, setSignalPayload] = useState('')

  const [preview, setPreview] = useState<{
    rows: WorkflowExecution[]
    total: number
    moreAvailable: boolean
  } | null>(null)
  const [previewErr, setPreviewErr] = useState<Error | null>(null)
  const [previewing, setPreviewing] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  const wire = KINDS.find((k) => k.kind === kind)?.wire ?? 'BATCH_OPERATION_TYPE_UNSPECIFIED'

  const runPreview = useCallback(async () => {
    setPreviewing(true)
    setPreviewErr(null)
    setPreview(null)
    try {
      const cursor = await Workflows.list(namespace, { query, pageSize: PREVIEW_LIMIT })
      const rows = cursor.data.executions ?? []
      setPreview({
        rows,
        total: rows.length,
        moreAvailable: Boolean(cursor.nextPageToken),
      })
    } catch (e) {
      setPreviewErr(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setPreviewing(false)
    }
  }, [namespace, query])

  const onSubmit = useCallback(async () => {
    if (!preview) return
    setSubmitting(true)
    setSubmitErr(null)
    try {
      const body: Record<string, unknown> = {
        operation: wire,
        operationType: kind,
        query,
        reason: reason || `Started from console (${kind})`,
      }
      if (kind === 'Signal') {
        body.signalName = signalName
        if (signalPayload.trim()) {
          try {
            body.signalPayload = JSON.parse(signalPayload)
          } catch {
            throw new Error('Signal payload must be valid JSON.')
          }
        }
      }
      const created = await Batches.create(namespace, body)
      const id = created.batchId || created.jobId
      if (id) {
        navigate(`/namespaces/${encodeURIComponent(namespace)}/batches/${encodeURIComponent(id)}`)
      } else {
        navigate(`/namespaces/${encodeURIComponent(namespace)}/batches`)
      }
    } catch (e) {
      if (e instanceof ApiError) {
        setSubmitErr(`${e.status === 501 ? 'Not yet implemented in native server' : 'Failed'}: ${e.message}`)
      } else {
        setSubmitErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setSubmitting(false)
    }
  }, [kind, wire, query, reason, signalName, signalPayload, preview, namespace, navigate])

  const canSubmit =
    !!preview && !submitting && !!query.trim() && (kind !== 'Signal' || !!signalName.trim())

  return (
    <YStack gap="$4">
      <XStack items="center" gap="$1">
        <Link
          to={`/namespaces/${encodeURIComponent(namespace)}/batches`}
          style={{ textDecoration: 'none' }}
        >
          <XStack items="center" gap="$1">
            <ChevronLeft size={14} color="#7e8794" />
            <Text fontSize="$2" color="$placeholderColor">
              Batches
            </Text>
          </XStack>
        </Link>
      </XStack>

      <H1 size="$8" color="$color">
        Start a batch in {namespace}
      </H1>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$4">
          <YStack gap="$2">
            <H4 size="$3" color="$color">
              Operation
            </H4>
            <XStack gap="$2" flexWrap="wrap">
              {KINDS.map((k) => (
                <Button
                  key={k.kind}
                  size="$2"
                  onPress={() => setKind(k.kind)}
                  bg={kind === k.kind ? ('#f2f2f2' as never) : 'transparent'}
                  borderWidth={1}
                  borderColor={kind === k.kind ? ('#f2f2f2' as never) : '$borderColor'}
                >
                  <XStack items="center" gap="$1.5">
                    <BatchKindIcon kind={k.kind} />
                    <Text
                      fontSize="$2"
                      color={kind === k.kind ? ('#070b13' as never) : '$color'}
                    >
                      {k.kind === 'UpdateOptions' ? 'Update options' : k.kind}
                    </Text>
                  </XStack>
                </Button>
              ))}
            </XStack>
            <Text fontSize="$1" color="$placeholderColor">
              {KINDS.find((k) => k.kind === kind)?.help}
            </Text>
          </YStack>

          <YStack gap="$2">
            <H4 size="$3" color="$color">
              Visibility query
            </H4>
            <TextArea
              value={query}
              onChangeText={setQuery}
              minH={96}
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              placeholder='ExecutionStatus="Running"'
            />
            <XStack gap="$2" items="center">
              <Button
                size="$2"
                onPress={() => void runPreview()}
                disabled={previewing || !query.trim()}
              >
                <XStack items="center" gap="$1.5">
                  {previewing ? <Spinner size="small" /> : <Search size={12} color="#7e8794" />}
                  <Text fontSize="$2">{previewing ? 'Previewing…' : 'Preview matches'}</Text>
                </XStack>
              </Button>
              <Text fontSize="$1" color="$placeholderColor">
                Required before starting. We never run a batch without showing the match count.
              </Text>
            </XStack>
          </YStack>

          {kind === 'Signal' ? (
            <YStack gap="$2">
              <H4 size="$3" color="$color">
                Signal
              </H4>
              <Input
                value={signalName}
                onChangeText={setSignalName}
                placeholder="signal name"
              />
              <TextArea
                value={signalPayload}
                onChangeText={setSignalPayload}
                minH={64}
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                placeholder='{"key":"value"} (optional)'
              />
            </YStack>
          ) : null}

          <YStack gap="$2">
            <H4 size="$3" color="$color">
              Reason
            </H4>
            <Input value={reason} onChangeText={setReason} placeholder="why are you running this batch?" />
          </YStack>
        </YStack>
      </Card>

      {previewErr ? <ErrorState error={previewErr} /> : null}

      {preview ? (
        <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <YStack gap="$3">
            <XStack items="baseline" gap="$2">
              <H4 size="$3" color="$color">
                Dry-run preview
              </H4>
              <Badge variant="info">
                {preview.total}
                {preview.moreAvailable ? '+' : ''} matches
              </Badge>
            </XStack>
            {preview.rows.length === 0 ? (
              <Text fontSize="$2" color="$placeholderColor">
                No executions match this query. Refine the query or pick a different namespace.
              </Text>
            ) : (
              <YStack gap="$1">
                {preview.rows.map((wf) => (
                  <XStack
                    key={`${wf.execution.workflowId}:${wf.execution.runId}`}
                    gap="$3"
                    py="$1"
                    borderBottomWidth={1}
                    borderBottomColor="$borderColor"
                  >
                    <Text fontSize="$1" color="$placeholderColor">
                      {String(wf.status).replace(/^WORKFLOW_EXECUTION_STATUS_/, '').toLowerCase()}
                    </Text>
                    <Text
                      fontSize="$1"
                      fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                      color="$color"
                      flex={1}
                      numberOfLines={1}
                    >
                      {wf.execution.workflowId}
                    </Text>
                    <Text fontSize="$1" color="$placeholderColor" numberOfLines={1}>
                      {wf.type?.name ?? '—'}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            )}
          </YStack>
        </Card>
      ) : null}

      {submitErr ? (
        <Alert variant="destructive" title="Could not start batch">
          {submitErr}
        </Alert>
      ) : null}

      <XStack gap="$2" justify="flex-end">
        <Link
          to={`/namespaces/${encodeURIComponent(namespace)}/batches`}
          style={{ textDecoration: 'none' }}
        >
          <Button chromeless>
            <Text fontSize="$2">Cancel</Text>
          </Button>
        </Link>
        <Button
          onPress={() => void onSubmit()}
          disabled={!canSubmit}
          bg={canSubmit ? ('#f2f2f2' as never) : ('rgba(255,255,255,0.05)' as never)}
          hoverStyle={canSubmit ? { background: '#ffffff' as never } : undefined}
        >
          <XStack items="center" gap="$1.5">
            {submitting ? <Spinner size="small" /> : <Play size={14} color={canSubmit ? '#070b13' : '#7e8794'} />}
            <Text
              fontSize="$2"
              fontWeight="500"
              color={canSubmit ? ('#070b13' as never) : '$placeholderColor'}
            >
              {submitting ? 'Starting…' : preview ? 'Start batch' : 'Preview required'}
            </Text>
          </XStack>
        </Button>
      </XStack>
    </YStack>
  )
}
