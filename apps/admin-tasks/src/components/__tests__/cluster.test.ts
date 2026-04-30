// Pure-logic tests for cluster + migration components. We assert the
// exported predicates (effectiveHealth, canSubmitMigration) directly
// to avoid the hanzogui provider chain — same reasoning as
// WorkflowStatusPill.test.tsx.

import { describe, it, expect } from 'vitest'
import { effectiveHealth } from '../cluster/ValidatorTable'
import { canSubmitMigration } from '../migration/MigrationDialog'
import type { Validator } from '../../lib/api'

const v = (over: Partial<Validator>): Validator => ({
  id: 'n1',
  addr: '10.0.0.1:9000',
  role: 'follower',
  health: 'healthy',
  ...over,
})

describe('effectiveHealth', () => {
  it('returns failed when health=failed regardless of lag', () => {
    expect(effectiveHealth(v({ health: 'failed', replicationLagMs: 0 }))).toBe('failed')
  })

  it('returns laggy when health=laggy', () => {
    expect(effectiveHealth(v({ health: 'laggy', replicationLagMs: 100 }))).toBe('laggy')
  })

  it('downgrades a healthy follower to laggy when lag exceeds threshold', () => {
    expect(effectiveHealth(v({ health: 'healthy', replicationLagMs: 750 }))).toBe('laggy')
    expect(effectiveHealth(v({ health: 'healthy', replicationLagMs: 250 }))).toBe('healthy')
  })

  it('respects a custom threshold', () => {
    expect(effectiveHealth(v({ health: 'healthy', replicationLagMs: 100 }), 50)).toBe('laggy')
  })

  it('returns unknown for unrecognised health values', () => {
    expect(effectiveHealth(v({ health: 'mystery' as never }))).toBe('unknown')
  })

  it('returns healthy when no lag is reported', () => {
    expect(effectiveHealth(v({ health: 'healthy', replicationLagMs: undefined }))).toBe('healthy')
  })
})

describe('canSubmitMigration', () => {
  it('rejects an empty typed name', () => {
    expect(canSubmitMigration('', 'default', 'n2')).toBe(false)
  })

  it('rejects a near-miss typed name (case-sensitive)', () => {
    expect(canSubmitMigration('Default', 'default', 'n2')).toBe(false)
    expect(canSubmitMigration('default ', 'default', 'n2')).toBe(false)
  })

  it('rejects a missing target node', () => {
    expect(canSubmitMigration('default', 'default', null)).toBe(false)
    expect(canSubmitMigration('default', 'default', '')).toBe(false)
  })

  it('accepts an exact name plus a chosen node', () => {
    expect(canSubmitMigration('default', 'default', 'n2')).toBe(true)
  })
})
