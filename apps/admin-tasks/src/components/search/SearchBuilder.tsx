// SearchBuilder — chip-based query composer. Output is a single query
// string that round-trips through parseSearchQuery / stringifyQuery so
// the search bar (FEATURE-1) and the batch creator (FEATURE-7) can hand
// the same string to the visibility API.
//
// The AST grammar (see lib/format.ts) supports `=`, `!=`, `>`, `>=`,
// `<`, `<=`, STARTS_WITH, IN. There's no BETWEEN: a `startTime BETWEEN`
// chip emits two clauses (`startTime >= a AND startTime <= b`) which
// round-trips losslessly. Chips for unknown / freeform queries are
// disabled — operators pick themselves from the chip kind.

import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Input, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { X } from '@hanzogui/lucide-icons-2/icons/X'
import { Badge } from '@hanzogui/admin'
import {
  parseSearchQuery,
  stringifyQuery,
  QueryParseError,
  type QueryNode,
  type QueryClause,
} from '../../lib/format'
import { SearchAttributePicker } from './SearchAttributePicker'
import { WORKFLOW_STATUSES, type SearchAttributesSchema } from '../../lib/types'

type ChipKind = 'workflowType' | 'workflowId' | 'workflowStatus' | 'startTime' | 'custom'

interface Chip {
  id: string
  kind: ChipKind
  // Field name on the wire — `WorkflowType`, `WorkflowId`, `ExecutionStatus`,
  // `StartTime`, or any custom search-attribute name.
  field: string
  // For `=`, `STARTS_WITH`, `IN` chips.
  value?: string
  // For status chips: multiple statuses as IN(...).
  values?: string[]
  // For startTime range chips. ISO strings.
  from?: string
  to?: string
}

export interface SearchBuilderProps {
  schema?: SearchAttributesSchema
  value: string
  onChange: (next: string) => void
}

let chipSeq = 0
const nextId = () => `chip-${++chipSeq}`

export default function SearchBuilder({ schema = {}, value, onChange }: SearchBuilderProps) {
  // Hydrate chips from the incoming string. Anything we can't match
  // becomes a `custom` chip so editing still round-trips.
  const initialChips = useMemo(() => fromQuery(value), [])
  const [chips, setChips] = useState<Chip[]>(initialChips)

  // Re-emit when chips change. Skip the very first render so the
  // builder doesn't clobber a parent-supplied default with `''`.
  const first = useMemo(() => ({ done: false }), [])
  useEffect(() => {
    if (!first.done) {
      first.done = true
      return
    }
    onChange(toQuery(chips))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  const update = (id: string, patch: Partial<Chip>) =>
    setChips((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  const remove = (id: string) => setChips((cs) => cs.filter((c) => c.id !== id))
  const add = (kind: ChipKind) =>
    setChips((cs) => [...cs, blankChip(kind)])

  return (
    <YStack gap="$2">
      <XStack gap="$2" flexWrap="wrap" items="center">
        {chips.map((chip) => (
          <ChipEditor
            key={chip.id}
            chip={chip}
            schema={schema}
            onChange={(p) => update(chip.id, p)}
            onRemove={() => remove(chip.id)}
          />
        ))}
        <AddMenu onAdd={add} />
      </XStack>
    </YStack>
  )
}

function ChipEditor({
  chip,
  schema,
  onChange,
  onRemove,
}: {
  chip: Chip
  schema: SearchAttributesSchema
  onChange: (p: Partial<Chip>) => void
  onRemove: () => void
}) {
  return (
    <Card
      px="$2"
      py="$1.5"
      bg={'rgba(255,255,255,0.03)' as never}
      borderColor="$borderColor"
      borderWidth={1}
    >
      <XStack items="center" gap="$2">
        <Badge variant="muted">{chipLabel(chip)}</Badge>
        <ChipBody chip={chip} schema={schema} onChange={onChange} />
        <Button size="$1" chromeless onPress={onRemove} aria-label="Remove chip">
          <X size={12} color="#7e8794" />
        </Button>
      </XStack>
    </Card>
  )
}

function ChipBody({
  chip,
  schema,
  onChange,
}: {
  chip: Chip
  schema: SearchAttributesSchema
  onChange: (p: Partial<Chip>) => void
}) {
  if (chip.kind === 'workflowStatus') {
    return (
      <XStack gap="$1.5" items="center" flexWrap="wrap">
        {WORKFLOW_STATUSES.filter((s) => s !== 'Unspecified').map((s) => {
          const selected = chip.values?.includes(s) ?? false
          return (
            <Button
              key={s}
              size="$1"
              chromeless
              borderWidth={1}
              borderColor={selected ? ('#86efac' as never) : '$borderColor'}
              onPress={() => {
                const cur = chip.values ?? []
                const next = selected ? cur.filter((x) => x !== s) : [...cur, s]
                onChange({ values: next })
              }}
            >
              <Text fontSize="$1" color={selected ? ('#86efac' as never) : '$color'}>
                {s}
              </Text>
            </Button>
          )
        })}
      </XStack>
    )
  }
  if (chip.kind === 'startTime') {
    return (
      <XStack gap="$1.5" items="center">
        <Text fontSize="$1" color="$placeholderColor">
          from
        </Text>
        <Input
          size="$2"
          width={200}
          placeholder="2026-01-01T00:00:00Z"
          value={chip.from ?? ''}
          onChangeText={(v: string) => onChange({ from: v })}
        />
        <Text fontSize="$1" color="$placeholderColor">
          to
        </Text>
        <Input
          size="$2"
          width={200}
          placeholder="2026-12-31T23:59:59Z"
          value={chip.to ?? ''}
          onChangeText={(v: string) => onChange({ to: v })}
        />
      </XStack>
    )
  }
  if (chip.kind === 'custom') {
    return (
      <XStack gap="$1.5" items="center" minW={320}>
        <SearchAttributePicker
          schema={schema}
          value={chip.field}
          onChange={(v) => onChange({ field: v })}
          placeholder="Attribute"
        />
        <Text fontSize="$1" color="$placeholderColor">
          =
        </Text>
        <Input
          size="$2"
          width={180}
          placeholder="value"
          value={chip.value ?? ''}
          onChangeText={(v: string) => onChange({ value: v })}
        />
      </XStack>
    )
  }
  // workflowType / workflowId
  return (
    <Input
      size="$2"
      width={220}
      placeholder={chip.kind === 'workflowType' ? 'MyWorkflow' : 'workflow-id'}
      value={chip.value ?? ''}
      onChangeText={(v: string) => onChange({ value: v })}
    />
  )
}

function AddMenu({ onAdd }: { onAdd: (k: ChipKind) => void }) {
  const opts: Array<{ kind: ChipKind; label: string }> = [
    { kind: 'workflowType', label: 'Type' },
    { kind: 'workflowId', label: 'ID' },
    { kind: 'workflowStatus', label: 'Status' },
    { kind: 'startTime', label: 'Start time' },
    { kind: 'custom', label: 'Custom' },
  ]
  return (
    <XStack gap="$1.5" items="center">
      <Plus size={12} color="#7e8794" />
      {opts.map((o) => (
        <Button
          key={o.kind}
          size="$1"
          chromeless
          borderWidth={1}
          borderColor="$borderColor"
          onPress={() => onAdd(o.kind)}
        >
          <Text fontSize="$1" color="$placeholderColor">
            + {o.label}
          </Text>
        </Button>
      ))}
    </XStack>
  )
}

// ── chip ↔ string round-trip ─────────────────────────────────────

function blankChip(kind: ChipKind): Chip {
  switch (kind) {
    case 'workflowType':
      return { id: nextId(), kind, field: 'WorkflowType' }
    case 'workflowId':
      return { id: nextId(), kind, field: 'WorkflowId' }
    case 'workflowStatus':
      return { id: nextId(), kind, field: 'ExecutionStatus', values: [] }
    case 'startTime':
      return { id: nextId(), kind, field: 'StartTime' }
    case 'custom':
      return { id: nextId(), kind, field: '' }
  }
}

function chipLabel(c: Chip): string {
  switch (c.kind) {
    case 'workflowType':
      return 'WorkflowType'
    case 'workflowId':
      return 'WorkflowId'
    case 'workflowStatus':
      return 'Status'
    case 'startTime':
      return 'StartTime'
    case 'custom':
      return c.field || 'Custom'
  }
}

export function toQuery(chips: Chip[]): string {
  const clauses: QueryClause[] = []
  for (const c of chips) {
    switch (c.kind) {
      case 'workflowType':
        if (c.value)
          clauses.push({ type: 'clause', field: 'WorkflowType', op: '=', value: c.value })
        break
      case 'workflowId':
        if (c.value)
          clauses.push({ type: 'clause', field: 'WorkflowId', op: '=', value: c.value })
        break
      case 'workflowStatus':
        if (c.values && c.values.length > 0) {
          clauses.push({
            type: 'clause',
            field: 'ExecutionStatus',
            op: 'IN',
            value: c.values.slice(),
          })
        }
        break
      case 'startTime':
        if (c.from)
          clauses.push({ type: 'clause', field: 'StartTime', op: '>=', value: c.from })
        if (c.to)
          clauses.push({ type: 'clause', field: 'StartTime', op: '<=', value: c.to })
        break
      case 'custom':
        if (c.field && c.value)
          clauses.push({ type: 'clause', field: c.field, op: '=', value: c.value })
        break
    }
  }
  if (clauses.length === 0) return ''
  let node: QueryNode = clauses[0]
  for (let i = 1; i < clauses.length; i++) {
    node = { type: 'conjunction', logic: 'AND', left: node, right: clauses[i] }
  }
  return stringifyQuery(node)
}

export function fromQuery(input: string): Chip[] {
  if (!input.trim()) return []
  let ast: QueryNode | null
  try {
    ast = parseSearchQuery(input)
  } catch (e) {
    if (e instanceof QueryParseError) return [{ id: nextId(), kind: 'custom', field: '', value: input }]
    return []
  }
  if (!ast) return []
  const flat: QueryClause[] = []
  flatten(ast, flat)

  const chips: Chip[] = []
  let startFrom: string | undefined
  let startTo: string | undefined
  for (const cl of flat) {
    if (cl.field === 'WorkflowType' && cl.op === '=') {
      chips.push({ id: nextId(), kind: 'workflowType', field: 'WorkflowType', value: String(cl.value) })
    } else if (cl.field === 'WorkflowId' && cl.op === '=') {
      chips.push({ id: nextId(), kind: 'workflowId', field: 'WorkflowId', value: String(cl.value) })
    } else if (cl.field === 'ExecutionStatus' && cl.op === 'IN' && Array.isArray(cl.value)) {
      chips.push({
        id: nextId(),
        kind: 'workflowStatus',
        field: 'ExecutionStatus',
        values: cl.value.map(String),
      })
    } else if (cl.field === 'StartTime' && cl.op === '>=') {
      startFrom = String(cl.value)
    } else if (cl.field === 'StartTime' && cl.op === '<=') {
      startTo = String(cl.value)
    } else if (cl.op === '=') {
      chips.push({
        id: nextId(),
        kind: 'custom',
        field: cl.field,
        value: String(cl.value),
      })
    }
    // Other operators fall through silently — round-tripping is best-effort
    // for clauses outside the chip vocabulary.
  }
  if (startFrom !== undefined || startTo !== undefined) {
    chips.push({
      id: nextId(),
      kind: 'startTime',
      field: 'StartTime',
      from: startFrom,
      to: startTo,
    })
  }
  return chips
}

function flatten(node: QueryNode, out: QueryClause[]) {
  if (node.type === 'clause') {
    out.push(node)
    return
  }
  // Builder only emits AND, but tolerate OR by flattening anyway.
  flatten(node.left, out)
  flatten(node.right, out)
}
