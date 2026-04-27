import { afterEach, describe, expect, it } from 'vitest'
import { isEmail, isPhoneShape, readCsrfToken, scorePassword } from '../../src/auth/util'

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

describe('util.readCsrfToken', () => {
  afterEach(() => {
    document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  })

  it('returns "" when the cookie is absent', () => {
    expect(readCsrfToken()).toBe('')
  })

  it('reads + URL-decodes a cookie value', () => {
    document.cookie = `csrf_token=${encodeURIComponent('abc/=+123')}`
    expect(readCsrfToken()).toBe('abc/=+123')
  })
})
