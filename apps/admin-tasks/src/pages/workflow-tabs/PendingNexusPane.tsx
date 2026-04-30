// Pending nexus operations pane — table of in-flight nexus operations
// from the workflow describe envelope (`pendingNexusOperations`).
// Distinct from NexusLinksPane (which lists every nexus call this
// workflow has ever made, including completed ones); this view only
// shows what's still outstanding so an on-call reader can quickly see
// which downstream system is gating progress.
//
// Polls the describe endpoint every 5s while mounted so newly-
// scheduled operations and state transitions appear without manual
// refresh.

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Text, XStack, YStack } from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { Empty, useFetch } from '@hanzogui/admin'
import {
  Workflows,
  type PendingNexusOperation,
  type WorkflowExecution,
} from '../../lib/api'
import { NexusOperationStatusPill } from '../../components/nexus/NexusOperationStatusPill'

const POLL_MS = 5000

interface DescribeResp {
  workflowExecutionInfo?: WorkflowExecution
  pendingNexusOperations?: PendingNexusOperation[]
}

// The describe envelope sometimes carries an extended shape: lastFailure,
// scheduleTime, attempt. We accept it loosely so the column wires up
// when the backend ships it; until then we display the typed fields.
type PendingNexusRich = PendingNexusOperation & {
  scheduledTime?: string
  attempt?: number
  lastFailure?: { message?: string; stackTrace?: string } | null
}

export interface PendingNexusPaneProps {
  wf: WorkflowExecution
  ns?: string
}

export function PendingNexusPane({ wf, ns }: PendingNexusPaneProps) {
  const { ns: nsParam } = useParams()
  const namespace = ns ?? nsParam ?? ''
  const url = namespace
    ? Workflows.describeUrl(namespace, wf.execution.workflowId, wf.execution.runId)
    : null
  const { data, mutate } = useFetch<DescribeResp>(url)

  useEffect(() => {
    if (!url) return
    const id = window.setInterval(() => void mutate(), POLL_MS)
    return () => window.clearInterval(id)
  }, [url, mutate])

  const live =
    (data?.workflowExecutionInfo?.pendingNexusOperations ??
      data?.pendingNexusOperations) as PendingNexusRich[] | undefined
  const rows = (live ?? (wf.pendingNexusOperations as PendingNexusRich[] | undefined) ?? []).slice()
  rows.sort((a, b) => sortKey(a) - sortKey(b))

  if (rows.length === 0) {
    return (
      <Empty
        title="No pending nexus operations"
        hint="In-flight calls to nexus endpoints appear here while they are scheduled or running. Completed operations land in the Nexus links tab."
      />
    )
  }

  return (
    <YStack gap="$3">
      <Text fontSize="$3" color="$color" fontWeight="500">
        Pending{' '}
        <Text fontSize="$2" color="$placeholderColor" fontWeight="400">
          ({rows.length})
        </Text>
      </Text>
      {rows.map((p, i) => (
        <PendingRow
          key={`${p.endpoint}-${p.service}-${p.operation}-${p.scheduledEventId ?? i}`}
          ns={namespace}
          wf={wf}
          op={p}
        />
      ))}
    </YStack>
  )
}

function PendingRow({
  ns,
  wf,
  op,
}: {
  ns: string
  wf: WorkflowExecution
  op: PendingNexusRich
}) {
  const [openFail, setOpenFail] = useState(false)
  const runQs = wf.execution.runId
    ? `?runId=${encodeURIComponent(wf.execution.runId)}`
    : ''
  const baseHref = `/namespaces/${encodeURIComponent(ns)}/workflows/${encodeURIComponent(wf.execution.workflowId)}`
  const eventHref = op.scheduledEventId
    ? `${baseHref}/events/${encodeURIComponent(String(op.scheduledEventId))}${runQs}`
    : null
  const endpointHref = op.endpoint
    ? `/namespaces/${encodeURIComponent(ns)}/nexus/${encodeURIComponent(op.endpoint)}`
    : null

  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$2.5">
        <XStack items="center" gap="$3" justify="space-between" flexWrap="wrap">
          <XStack items="center" gap="$2" flexWrap="wrap">
            <NexusOperationStatusPill state={op.state} />
            <Text fontSize="$3" fontWeight="500" color="$color">
              {op.service}
              {op.service && op.operation ? '.' : ''}
              {op.operation || '(operation)'}
            </Text>
          </XStack>
          {eventHref ? (
            <Link to={eventHref} style={{ textDecoration: 'none' }}>
              <Text fontSize="$1" color={'#86efac' as never}>
                event #{op.scheduledEventId}
              </Text>
            </Link>
          ) : null}
        </XStack>

        <XStack flexWrap="wrap" gap="$4">
          <Field label="Endpoint">
            {endpointHref ? (
              <Link to={endpointHref} style={{ textDecoration: 'none' }}>
                <Text fontSize="$2" color={'#86efac' as never}>
                  {op.endpoint}
                </Text>
              </Link>
            ) : (
              <Text fontSize="$2" color="$placeholderColor">
                —
              </Text>
            )}
          </Field>
          <Field label="Scheduled">
            {op.scheduledTime ? new Date(op.scheduledTime).toLocaleString() : '—'}
          </Field>
          <Field label="Attempt">
            {op.attempt ? String(op.attempt) : '—'}
          </Field>
          <Field label="Schedule-to-start">
            {op.scheduleToStartTimeout ?? '—'}
          </Field>
          <Field label="Start-to-close">
            {op.startToCloseTimeout ?? '—'}
          </Field>
        </XStack>

        {op.lastFailure?.message ? (
          <YStack gap="$2">
            <Button
              size="$2"
              chromeless
              self="flex-start"
              onPress={() => setOpenFail((v) => !v)}
            >
              <XStack items="center" gap="$1.5">
                {openFail ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <Text fontSize="$2" color={'#fca5a5' as never}>
                  Last failure
                </Text>
              </XStack>
            </Button>
            {openFail ? (
              <Card p="$3" bg={'#1f1213' as never} borderColor="#7f1d1d" borderWidth={1}>
                <YStack gap="$2">
                  <Text fontSize="$2" color="#fca5a5">
                    {op.lastFailure.message}
                  </Text>
                  {op.lastFailure.stackTrace ? (
                    <Text
                      fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                      fontSize="$1"
                      color="#fca5a5"
                      whiteSpace={'pre-wrap' as never}
                    >
                      {op.lastFailure.stackTrace}
                    </Text>
                  ) : null}
                </YStack>
              </Card>
            ) : null}
          </YStack>
        ) : null}
      </YStack>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack gap="$0.5" minW={140}>
      <Text fontSize="$1" color="$placeholderColor">
        {label}
      </Text>
      <Text fontSize="$2" color="$color">
        {children}
      </Text>
    </YStack>
  )
}

function sortKey(op: PendingNexusRich): number {
  if (op.scheduledEventId) return op.scheduledEventId
  if (op.scheduledTime) {
    const t = Date.parse(op.scheduledTime)
    return Number.isFinite(t) ? t : 0
  }
  return 0
}
