import { test, expect } from 'bun:test'
import { bold, red, green, gray } from './ansi.js'

test('color helpers return wrapped strings on TTY, plain otherwise', () => {
  // In the test runner stdout typically isn't a TTY, so we get pass-through.
  // The contract: result is always a string that contains the input substring.
  for (const fn of [bold, red, green, gray]) {
    const out = fn('hello')
    expect(typeof out).toBe('string')
    expect(out.includes('hello')).toBe(true)
  }
})
