// Pure formatting helpers. No React. No globals. No external deps.
// Each function is independently testable.
//
// The chrome library (@hanzogui/admin) already exports formatTimestamp,
// humanTTL, parseWorkflowStatus, workflowStatusVariant. We re-export
// those here so pages have one place to import from. The new helpers
// (duration, relative, bytes, bigint, status icon, query parser) live
// alongside.

import {
  formatTimestamp,
  humanTTL,
  parseWorkflowStatus,
  workflowStatusVariant,
  workflowStatusLabel,
  badgeColors,
  type StatusVariant,
  type WorkflowStatus,
} from '@hanzogui/admin'

export {
  formatTimestamp,
  humanTTL,
  parseWorkflowStatus,
  workflowStatusVariant,
  workflowStatusLabel,
  badgeColors,
  type StatusVariant,
  type WorkflowStatus,
}

// ── duration / relative time ──────────────────────────────────────

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

// formatDuration accepts a Duration-string ("12.345s", "30m", "1h") OR
// a millisecond number. Returns a compact human form: "1d 2h", "12.3s",
// "450ms".
export function formatDuration(input: string | number | undefined | null): string {
  if (input === null || input === undefined) return '—'
  const ms = typeof input === 'number' ? input : parseDurationToMs(input)
  if (!Number.isFinite(ms)) return String(input)
  const abs = Math.abs(ms)
  if (abs < 1000) return `${Math.round(ms)}ms`
  if (abs < MINUTE) return `${(ms / SECOND).toFixed(ms < 10 * SECOND ? 2 : 1)}s`
  if (abs < HOUR) {
    const m = Math.floor(ms / MINUTE)
    const s = Math.round((ms % MINUTE) / SECOND)
    return s ? `${m}m ${s}s` : `${m}m`
  }
  if (abs < DAY) {
    const h = Math.floor(ms / HOUR)
    const m = Math.round((ms % HOUR) / MINUTE)
    return m ? `${h}h ${m}m` : `${h}h`
  }
  const d = Math.floor(ms / DAY)
  const h = Math.round((ms % DAY) / HOUR)
  return h ? `${d}d ${h}h` : `${d}d`
}

// parseDurationToMs — proto-style "12s", "1h", "1.5m", "120ms". Falls
// back to NaN for unparseable input.
export function parseDurationToMs(s: string): number {
  if (!s) return NaN
  // Pure number → seconds (proto Duration JSON for round seconds).
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s) * SECOND
  const m = /^(-?\d+(?:\.\d+)?)(ms|s|m|h|d)$/.exec(s)
  if (!m) return NaN
  const v = Number(m[1])
  switch (m[2]) {
    case 'ms':
      return v
    case 's':
      return v * SECOND
    case 'm':
      return v * MINUTE
    case 'h':
      return v * HOUR
    case 'd':
      return v * DAY
    default:
      return NaN
  }
}

// formatRelative — "5s ago", "2h ago", "in 3m". Pass an ISO timestamp
// (or Date), optional `now` for tests.
export function formatRelative(input: string | Date | undefined | null, now: Date = new Date()): string {
  if (!input) return '—'
  const t = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(t.getTime())) return '—'
  const diff = now.getTime() - t.getTime()
  const abs = Math.abs(diff)
  const fmt = formatDuration(abs)
  return diff >= 0 ? `${fmt} ago` : `in ${fmt}`
}

// ── bytes / numbers ───────────────────────────────────────────────

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

export function formatBytes(input: number | string | undefined | null): string {
  if (input === null || input === undefined) return '—'
  const n = typeof input === 'string' ? Number(input) : input
  if (!Number.isFinite(n)) return String(input)
  if (n === 0) return '0 B'
  const i = Math.min(BYTE_UNITS.length - 1, Math.floor(Math.log10(Math.abs(n)) / 3))
  const v = n / Math.pow(1000, i)
  const decimals = v < 10 && i > 0 ? 2 : v < 100 && i > 0 ? 1 : 0
  return `${v.toFixed(decimals)} ${BYTE_UNITS[i]}`
}

// formatBigInt accepts a string-as-int (proto convention) or a number.
// Renders with thousands separators. `—` for missing.
export function formatBigInt(input: number | string | undefined | null): string {
  if (input === null || input === undefined || input === '') return '—'
  const s = typeof input === 'number' ? String(input) : input
  // Avoid Number() for true bigints; just split on the decimal point.
  const [intPart, dec] = s.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec ? `${grouped}.${dec}` : grouped
}

// ── status mappings ──────────────────────────────────────────────

// statusColor — convenience that returns the badge fg colour for a
// WorkflowStatus. Used by sparklines and inline status dots.
export function statusColor(status: WorkflowStatus | string): string {
  const ws =
    typeof status === 'string' && !isWorkflowStatus(status)
      ? parseWorkflowStatus(status)
      : (status as WorkflowStatus)
  return badgeColors(workflowStatusVariant(ws)).fg
}

function isWorkflowStatus(s: string): s is WorkflowStatus {
  return [
    'Running',
    'Completed',
    'Failed',
    'Canceled',
    'Terminated',
    'ContinuedAsNew',
    'TimedOut',
    'Pending',
    'Unspecified',
  ].includes(s)
}

// iconForStatus — Lucide icon name for a workflow status. Pages map
// the name to the actual icon import (tree-shakeable per-icon).
export function iconForStatus(status: WorkflowStatus | string): string {
  const ws = typeof status === 'string' && !isWorkflowStatus(status)
    ? parseWorkflowStatus(status)
    : (status as WorkflowStatus)
  switch (ws) {
    case 'Running':
      return 'Play'
    case 'Completed':
      return 'CheckCircle2'
    case 'Failed':
      return 'XCircle'
    case 'Canceled':
      return 'Ban'
    case 'Terminated':
      return 'Square'
    case 'TimedOut':
      return 'Clock'
    case 'ContinuedAsNew':
      return 'ArrowRight'
    case 'Pending':
      return 'CircleDashed'
    case 'Unspecified':
    default:
      return 'Circle'
  }
}

// ── search-query parser ──────────────────────────────────────────
//
// SQL-ish workflow filter language. Mirrors upstream
// src/lib/utilities/query/. Grammar:
//
//   query  := expr (logic expr)*
//   logic  := 'AND' | 'OR'
//   expr   := identifier op value
//   op     := '=' | '!=' | '>' | '>=' | '<' | '<=' | 'STARTS_WITH' | 'IN'
//   value  := number | quoted-string | '(' value (',' value)* ')'
//
// Returns a typed AST. Errors throw `QueryParseError` with a position.
//
// This is intentionally small. The full upstream parser supports
// `BETWEEN`, time fns, etc. — add when a feature actually needs them.

export type QueryOp = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'STARTS_WITH' | 'IN'
export type QueryLogic = 'AND' | 'OR'

export interface QueryClause {
  type: 'clause'
  field: string
  op: QueryOp
  value: string | number | Array<string | number>
}

export interface QueryConjunction {
  type: 'conjunction'
  logic: QueryLogic
  left: QueryNode
  right: QueryNode
}

export type QueryNode = QueryClause | QueryConjunction

export class QueryParseError extends Error {
  constructor(message: string, public position: number) {
    super(`${message} at position ${position}`)
    this.name = 'QueryParseError'
  }
}

interface Token {
  type: 'ident' | 'op' | 'logic' | 'string' | 'number' | 'lparen' | 'rparen' | 'comma'
  value: string
  position: number
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const n = input.length
  while (i < n) {
    const c = input[i]
    if (/\s/.test(c)) {
      i++
      continue
    }
    if (c === '(') {
      tokens.push({ type: 'lparen', value: '(', position: i++ })
      continue
    }
    if (c === ')') {
      tokens.push({ type: 'rparen', value: ')', position: i++ })
      continue
    }
    if (c === ',') {
      tokens.push({ type: 'comma', value: ',', position: i++ })
      continue
    }
    if (c === '"' || c === "'") {
      const start = i
      const quote = c
      i++
      let val = ''
      while (i < n && input[i] !== quote) {
        if (input[i] === '\\' && i + 1 < n) {
          val += input[i + 1]
          i += 2
          continue
        }
        val += input[i++]
      }
      if (i >= n) throw new QueryParseError('unterminated string', start)
      i++ // closing quote
      tokens.push({ type: 'string', value: val, position: start })
      continue
    }
    if (/[0-9-]/.test(c) && (i === 0 || tokens[tokens.length - 1]?.type !== 'ident')) {
      const start = i
      let val = ''
      if (c === '-') val = input[i++]
      while (i < n && /[0-9.]/.test(input[i])) val += input[i++]
      if (val === '-' || val === '') throw new QueryParseError('expected number', start)
      tokens.push({ type: 'number', value: val, position: start })
      continue
    }
    if (c === '!' && input[i + 1] === '=') {
      tokens.push({ type: 'op', value: '!=', position: i })
      i += 2
      continue
    }
    if (c === '>' || c === '<') {
      if (input[i + 1] === '=') {
        tokens.push({ type: 'op', value: c + '=', position: i })
        i += 2
      } else {
        tokens.push({ type: 'op', value: c, position: i++ })
      }
      continue
    }
    if (c === '=') {
      tokens.push({ type: 'op', value: '=', position: i++ })
      continue
    }
    if (/[A-Za-z_]/.test(c)) {
      const start = i
      let val = ''
      while (i < n && /[A-Za-z0-9_.]/.test(input[i])) val += input[i++]
      const upper = val.toUpperCase()
      if (upper === 'AND' || upper === 'OR') {
        tokens.push({ type: 'logic', value: upper, position: start })
      } else if (upper === 'IN' || upper === 'STARTS_WITH') {
        tokens.push({ type: 'op', value: upper, position: start })
      } else {
        tokens.push({ type: 'ident', value: val, position: start })
      }
      continue
    }
    throw new QueryParseError(`unexpected character ${JSON.stringify(c)}`, i)
  }
  return tokens
}

export function parseSearchQuery(input: string): QueryNode | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const tokens = tokenize(trimmed)
  let pos = 0

  const peek = () => tokens[pos]
  const consume = (type?: Token['type']): Token => {
    const t = tokens[pos]
    if (!t) throw new QueryParseError('unexpected end of query', input.length)
    if (type && t.type !== type) {
      throw new QueryParseError(`expected ${type}, got ${t.type} (${t.value})`, t.position)
    }
    pos++
    return t
  }

  const parseValue = (): string | number | Array<string | number> => {
    const t = peek()
    if (!t) throw new QueryParseError('expected value', input.length)
    if (t.type === 'lparen') {
      consume('lparen')
      const list: Array<string | number> = []
      while (peek() && peek().type !== 'rparen') {
        const v = parseValue()
        if (Array.isArray(v)) throw new QueryParseError('nested lists not supported', t.position)
        list.push(v)
        if (peek()?.type === 'comma') consume('comma')
      }
      consume('rparen')
      return list
    }
    if (t.type === 'string') {
      consume('string')
      return t.value
    }
    if (t.type === 'number') {
      consume('number')
      return Number(t.value)
    }
    if (t.type === 'ident') {
      consume('ident')
      return t.value
    }
    throw new QueryParseError(`unexpected token ${t.value}`, t.position)
  }

  const parseClause = (): QueryClause => {
    const id = consume('ident')
    const op = consume('op')
    const value = parseValue()
    return { type: 'clause', field: id.value, op: op.value as QueryOp, value }
  }

  let node: QueryNode = parseClause()
  while (peek()?.type === 'logic') {
    const logic = consume('logic').value as QueryLogic
    const right = parseClause()
    node = { type: 'conjunction', logic, left: node, right }
  }
  if (pos !== tokens.length) {
    throw new QueryParseError('unexpected trailing input', tokens[pos].position)
  }
  return node
}

// stringifyQuery — round-trip an AST back to a query string. Used by
// the saved-views feature when persisting URLs.
export function stringifyQuery(node: QueryNode | null): string {
  if (!node) return ''
  if (node.type === 'clause') {
    const v = node.value
    let value: string
    if (Array.isArray(v)) {
      value = `(${v.map((x) => (typeof x === 'string' ? `"${x}"` : String(x))).join(', ')})`
    } else if (typeof v === 'string') {
      value = `"${v}"`
    } else {
      value = String(v)
    }
    return `${node.field} ${node.op} ${value}`
  }
  return `${stringifyQuery(node.left)} ${node.logic} ${stringifyQuery(node.right)}`
}
