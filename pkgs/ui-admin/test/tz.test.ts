import { describe, expect, it, beforeEach } from 'vitest'
import { getTz, setTz, TZ_KEY } from '../src/data/tz'

describe('tz', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips the user preference through localStorage', () => {
    expect(getTz()).toBe('local') // default when unset
    setTz('utc')
    expect(localStorage.getItem(TZ_KEY)).toBe('utc')
    expect(getTz()).toBe('utc')
    setTz('local')
    expect(getTz()).toBe('local')
  })
})
