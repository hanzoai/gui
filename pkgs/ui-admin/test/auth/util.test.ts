import { describe, expect, it } from 'vitest'
import {
  isEmail,
  isPhoneShape,
  maskEmail,
  maskPhone,
  scorePassword,
} from '../../src/auth/util'

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

describe('util.maskEmail', () => {
  it('returns empty for null/undefined/empty', () => {
    expect(maskEmail(null)).toBe('')
    expect(maskEmail(undefined)).toBe('')
    expect(maskEmail('')).toBe('')
  })

  it('keeps the first character of the local part and the full domain', () => {
    expect(maskEmail('z@hanzo.ai')).toBe('z***@hanzo.ai')
    expect(maskEmail('jane.doe@example.com')).toBe('j***@example.com')
  })

  it('handles a single-char local part', () => {
    // Single-char local part still keeps that char and masks the
    // rest with `***` — never the bare `@domain`.
    expect(maskEmail('a@hanzo.ai')).toBe('a***@hanzo.ai')
  })

  it('rejects strings with no usable local part or no domain TLD', () => {
    // `@hanzo.ai` → no local → unsafe, return ''.
    expect(maskEmail('@hanzo.ai')).toBe('')
    // No `.` in the domain → not a real address, render nothing.
    expect(maskEmail('a@b')).toBe('')
    // No `@` at all.
    expect(maskEmail('zhanzo.ai')).toBe('')
  })

  it('uses the LAST `@` so quoted/invalid local parts still mask the right domain', () => {
    // RFC quoted local parts may contain `@`; the displayed domain
    // is the last `@`-separated label, not the first.
    expect(maskEmail('weird@local@hanzo.ai')).toBe('w***@hanzo.ai')
  })
})

describe('util.maskPhone', () => {
  it('returns empty for null/undefined/empty', () => {
    expect(maskPhone(null)).toBe('')
    expect(maskPhone(undefined)).toBe('')
    expect(maskPhone('')).toBe('')
  })

  it('keeps the last 4 digits and strips formatting', () => {
    expect(maskPhone('913-777-9708')).toBe('***-***-9708')
    expect(maskPhone('+1 (913) 777-9708')).toBe('***-***-9708')
    expect(maskPhone('9137779708')).toBe('***-***-9708')
  })

  it('returns empty when there are fewer than 4 digits', () => {
    // Anything below the 4-digit floor leaks the entire number, so
    // render nothing.
    expect(maskPhone('123')).toBe('')
    expect(maskPhone('()-')).toBe('')
  })
})
