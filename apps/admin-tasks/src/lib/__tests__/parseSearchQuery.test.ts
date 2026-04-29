import { describe, it, expect } from 'vitest'
import { parseSearchQuery, stringifyQuery, QueryParseError } from '../format'

describe('parseSearchQuery', () => {
  it('returns null for empty input', () => {
    expect(parseSearchQuery('')).toBeNull()
    expect(parseSearchQuery('   ')).toBeNull()
  })

  it('parses a simple equality clause', () => {
    const ast = parseSearchQuery('WorkflowType = "Foo"')
    expect(ast).toEqual({
      type: 'clause',
      field: 'WorkflowType',
      op: '=',
      value: 'Foo',
    })
  })

  it('parses comparison ops', () => {
    const ast = parseSearchQuery('Attempt >= 3')
    expect(ast).toMatchObject({ field: 'Attempt', op: '>=', value: 3 })
  })

  it('parses an IN list', () => {
    const ast = parseSearchQuery('Status IN ("Running", "Failed")')
    expect(ast).toMatchObject({
      type: 'clause',
      field: 'Status',
      op: 'IN',
      value: ['Running', 'Failed'],
    })
  })

  it('parses AND/OR conjunctions left-associatively', () => {
    const ast = parseSearchQuery('a = 1 AND b = 2 OR c = 3')
    expect(ast?.type).toBe('conjunction')
    if (ast?.type === 'conjunction') {
      expect(ast.logic).toBe('OR')
      expect(ast.left.type).toBe('conjunction')
    }
  })

  it('throws QueryParseError on unterminated string', () => {
    expect(() => parseSearchQuery('x = "open')).toThrow(QueryParseError)
  })

  it('throws QueryParseError on unexpected character', () => {
    expect(() => parseSearchQuery('x ~ 1')).toThrow(QueryParseError)
  })

  it('round-trips via stringifyQuery for a simple clause', () => {
    const src = 'WorkflowType = "Foo"'
    expect(stringifyQuery(parseSearchQuery(src))).toBe('WorkflowType = "Foo"')
  })
})
