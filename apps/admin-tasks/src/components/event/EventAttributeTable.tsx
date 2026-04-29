// EventAttributeTable — typed renderer for a single HistoryEvent's
// `attributes` object. Drives the per-event drill-down view.
//
// Per-event-type rendering picks the fields that matter for the 12
// canonical event types (Activity Scheduled/Started/Completed/Failed,
// Timer Started/Fired/Canceled, Workflow signaled, Child workflow
// Initiated/Started/Completed, MarkerRecorded, Workflow & Workflow Task
// Started/Scheduled/Completed). Anything else falls back to a generic
// key/value table that recursively decodes payload-shaped values.
//
// Empty values are hidden by default with a "show all" toggle so a
// MarkerRecorded with one populated header doesn't spam 8 nulls.
//
// The pure logic lives in ./event-attribute-rows so the unit test can
// exercise row derivation + payload decoding without a Tamagui provider.

import { useMemo, useState } from 'react'
import { Button, Text, XStack, YStack } from 'hanzogui'
import { Badge } from '@hanzogui/admin'
import { EventLink } from './EventLink'
import { PayloadDecoder } from './PayloadDecoder'
import { buildRows, isEmptyRow, type AttributeRow } from './event-attribute-rows'
import type { HistoryEvent } from '../../lib/types'

export interface EventAttributeTableProps {
  event: HistoryEvent
  ns: string
  workflowId: string
  runId?: string
}

export function EventAttributeTable({
  event,
  ns,
  workflowId,
  runId,
}: EventAttributeTableProps) {
  const [showAll, setShowAll] = useState(false)
  const rows = useMemo(
    () => buildRows(event, { ns, workflowId, runId }),
    [event, ns, workflowId, runId],
  )
  const populated = rows.filter((r) => !isEmptyRow(r))
  const hidden = rows.length - populated.length
  const visible = showAll ? rows : populated

  if (rows.length === 0) {
    return (
      <Text fontSize="$2" color="$placeholderColor">
        No attributes on this event.
      </Text>
    )
  }

  return (
    <YStack gap="$2">
      <YStack borderWidth={1} borderColor="$borderColor" rounded="$2" overflow="hidden">
        {visible.map((r, i) => (
          <XStack
            key={`${r.label}-${i}`}
            px="$3"
            py="$2"
            borderTopWidth={i === 0 ? 0 : 1}
            borderTopColor="$borderColor"
            items="flex-start"
            gap="$3"
          >
            <Text width={180} fontSize="$2" color="$placeholderColor">
              {r.label}
            </Text>
            <YStack flex={1} minW={0}>
              <RowBody row={r} ns={ns} workflowId={workflowId} runId={runId} />
            </YStack>
          </XStack>
        ))}
      </YStack>
      {hidden > 0 ? (
        <XStack>
          <Button size="$1" chromeless onPress={() => setShowAll((v) => !v)}>
            <Text fontSize="$1" color="$placeholderColor">
              {showAll ? 'Hide empty' : `Show ${hidden} empty`}
            </Text>
          </Button>
        </XStack>
      ) : null}
    </YStack>
  )
}

function RowBody({
  row,
  ns,
  workflowId,
  runId,
}: {
  row: AttributeRow
  ns: string
  workflowId: string
  runId?: string
}) {
  switch (row.kind) {
    case 'empty':
      return (
        <Text fontSize="$2" color="$placeholderColor">
          —
        </Text>
      )
    case 'scalar':
      return (
        <Text fontFamily={'ui-monospace, SFMono-Regular, monospace' as never} fontSize="$2" color="$color">
          {String(row.raw)}
        </Text>
      )
    case 'badge':
      return <Badge variant="muted">{row.badge ?? ''}</Badge>
    case 'link':
      return (
        <EventLink ns={ns} workflowId={workflowId} runId={runId} eventId={row.raw as string | number} />
      )
    case 'payload':
      return <PayloadDecoder value={row.raw} />
  }
}

// Re-export pure helpers so callers can compose without re-importing
// from the lower-level module.
export { decodePayload } from './event-attribute-rows'
export type { AttributeRow }
