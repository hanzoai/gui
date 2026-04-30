import { describe, it, expect } from 'vitest'
import {
  clausesFromQuery,
  clausesToQuery,
  setClause,
  removeClauses,
} from '../search/clauses'
import type { QueryClause } from '../../lib/format'

describe('clausesFromQuery / clausesToQuery', () => {
  it('returns an empty list for blank input', () => {
    expect(clausesFromQuery('')).toEqual([])
    expect(clausesFromQuery('   ')).toEqual([])
  })

  it('returns an empty list for unparseable input (degraded round-trip)', () => {
    expect(clausesFromQuery('this is not a query')).toEqual([])
  })

  it('extracts a single clause', () => {
    const out = clausesFromQuery('ExecutionStatus = "Running"')
    expect(out).toHaveLength(1)
    expect(out[0].field).toBe('ExecutionStatus')
    expect(out[0].op).toBe('=')
    expect(out[0].value).toBe('Running')
  })

  it('flattens nested AND conjunctions', () => {
    const out = clausesFromQuery('ExecutionStatus = "Running" AND WorkflowType = "Mine"')
    expect(out).toHaveLength(2)
    expect(out[0].field).toBe('ExecutionStatus')
    expect(out[1].field).toBe('WorkflowType')
  })

  it('round-trips a clause list back to a string', () => {
    const clauses: QueryClause[] = [
      { type: 'clause', field: 'ExecutionStatus', op: '=', value: 'Running' },
      { type: 'clause', field: 'WorkflowType', op: '=', value: 'MyWorkflow' },
    ]
    const q = clausesToQuery(clauses)
    const back = clausesFromQuery(q)
    expect(back).toEqual(clauses)
  })

  it('emits an empty string for an empty list', () => {
    expect(clausesToQuery([])).toBe('')
  })
})

describe('setClause / removeClauses', () => {
  it('replaces an existing clause matching by default field-only', () => {
    const a: QueryClause = { type: 'clause', field: 'ExecutionStatus', op: '=', value: 'Running' }
    const b: QueryClause = { type: 'clause', field: 'ExecutionStatus', op: 'IN', value: ['Running', 'Failed'] }
    const out = setClause([a], b)
    expect(out).toEqual([b])
  })

  it('appends when no match', () => {
    const a: QueryClause = { type: 'clause', field: 'ExecutionStatus', op: '=', value: 'Running' }
    const b: QueryClause = { type: 'clause', field: 'WorkflowType', op: '=', value: 'X' }
    expect(setClause([a], b)).toEqual([a, b])
  })

  it('removeClauses filters by predicate', () => {
    const a: QueryClause = { type: 'clause', field: 'StartTime', op: '>=', value: '2026-01-01' }
    const b: QueryClause = { type: 'clause', field: 'StartTime', op: '<=', value: '2026-12-31' }
    const c: QueryClause = { type: 'clause', field: 'WorkflowType', op: '=', value: 'X' }
    const out = removeClauses([a, b, c], (x) => x.field === 'StartTime')
    expect(out).toEqual([c])
  })
})
