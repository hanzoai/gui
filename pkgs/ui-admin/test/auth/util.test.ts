import { describe, expect, it } from 'vitest'
import { isEmail, isPhoneShape, scorePassword } from '../../src/auth/util'

describe('util.isEmail', () => {
  it('accepts well-formed emails', () => {
    expect(isEmail('z@hanzo.ai')).toBe(true)
    expect(isEmail('first.last+tag@sub.example.co')).toBe(true)
  })
  it('rejects junk', () => {
    expect(isEmail('not an email')).toBe(false)
    expect(isEmail('a@b')).toBe(false)
    expect(isEmail('')).toBe(false)
  })
})

describe('util.isPhoneShape', () => {
  it('accepts +-prefixed numbers and groups', () => {
    expect(isPhoneShape('+1 (913) 777-9708')).toBe(true)
    expect(isPhoneShape('9137779708')).toBe(true)
  })
  it('rejects letters', () => {
    expect(isPhoneShape('abc-1234')).toBe(false)
  })
})

describe('util.scorePassword', () => {
  it('returns 0 for empty', () => {
    expect(scorePassword('')).toBe(0)
  })
  it('rises with mix and length', () => {
    expect(scorePassword('aaaaaaaa')).toBeLessThanOrEqual(1)
    expect(scorePassword('Aa1aaaaa')).toBeGreaterThanOrEqual(2)
    expect(scorePassword('Aa1!Aa1!Aa1!Aa1!')).toBe(4)
  })
})
