import { describe, it, expect } from 'vitest'
import {
  transition,
  canPerform,
  availableActions,
  isTerminal,
  isRunning,
  TERMINAL_STATUSES,
  RUNNING_STATUSES,
} from '../workflow-fsm'

describe('workflow-fsm: classifications', () => {
  it('treats Completed/Failed/Canceled/Terminated/TimedOut/ContinuedAsNew as terminal', () => {
    for (const s of ['Completed', 'Failed', 'Canceled', 'Terminated', 'TimedOut', 'ContinuedAsNew'] as const) {
      expect(isTerminal(s)).toBe(true)
      expect(TERMINAL_STATUSES.has(s)).toBe(true)
    }
  })
  it('treats Running/Paused/Pending as running', () => {
    for (const s of ['Running', 'Paused', 'Pending'] as const) {
      expect(isRunning(s)).toBe(true)
      expect(RUNNING_STATUSES.has(s)).toBe(true)
    }
  })
})

describe('workflow-fsm: transitions', () => {
  it('Running → Completed via complete', () => {
    expect(transition('Running', { type: 'complete' })).toBe('Completed')
  })
  it('Running → Canceled only on cancel-complete (not on cancel-request)', () => {
    expect(transition('Running', { type: 'cancel-request' })).toBe('Running')
    expect(transition('Running', { type: 'cancel-complete' })).toBe('Canceled')
  })
  it('Running → Terminated', () => {
    expect(transition('Running', { type: 'terminate' })).toBe('Terminated')
  })
  it('Running ↔ Paused', () => {
    expect(transition('Running', { type: 'pause' })).toBe('Paused')
    expect(transition('Paused', { type: 'unpause' })).toBe('Running')
  })
  it('terminal states never transition', () => {
    expect(transition('Completed', { type: 'cancel-complete' })).toBeNull()
    expect(transition('Failed', { type: 'terminate' })).toBeNull()
    expect(transition('Canceled', { type: 'signal' })).toBeNull()
  })
  it('signal preserves status when running, returns null when terminal', () => {
    expect(transition('Running', { type: 'signal' })).toBe('Running')
    expect(transition('Paused', { type: 'signal' })).toBe('Paused')
    expect(transition('Completed', { type: 'signal' })).toBeNull()
  })
})

describe('workflow-fsm: canPerform / availableActions', () => {
  it('canPerform mirrors transition()', () => {
    expect(canPerform('Running', { type: 'terminate' })).toBe(true)
    expect(canPerform('Completed', { type: 'terminate' })).toBe(false)
  })
  it('availableActions empty for terminal states', () => {
    expect(availableActions('Completed')).toEqual([])
    expect(availableActions('Terminated')).toEqual([])
  })
  it('availableActions includes signal+terminate for Running', () => {
    const actions = availableActions('Running')
    expect(actions).toContain('signal')
    expect(actions).toContain('terminate')
    expect(actions).toContain('cancel-request')
    expect(actions).toContain('pause')
    expect(actions).not.toContain('unpause')
  })
  it('availableActions includes unpause for Paused', () => {
    const actions = availableActions('Paused')
    expect(actions).toContain('unpause')
    expect(actions).not.toContain('pause')
  })
})
