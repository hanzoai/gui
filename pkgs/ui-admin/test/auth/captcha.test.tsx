// Captcha enforcement test for the end-user auth surface.
//
// The Login / Signup / ForgotPassword forms must refuse to submit when
// the application has a captcha configured but no token has been
// produced. We verify this against the source by asserting:
//   1. each form computes `captchaRequired` from the prop, and
//   2. its `canSubmit` (or equivalent gate) ANDs in `captchaToken !== null`.
// A previous regression let undefined-widget configurations bypass the
// challenge entirely; this test pins that hole closed.

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const FILES = [
  '../../src/auth/Login.tsx',
  '../../src/auth/Signup.tsx',
  '../../src/auth/ForgotPassword.tsx',
] as const

describe('auth forms — captcha gating', () => {
  for (const rel of FILES) {
    const src = readFileSync(join(__dirname, rel), 'utf8')

    it(`${rel} accepts a CaptchaConfig prop`, () => {
      expect(src).toMatch(/captcha\?:\s*CaptchaConfig/)
    })

    it(`${rel} computes captchaRequired from the config`, () => {
      // Non-greedy on whitespace so style choices don't break the test.
      expect(src).toMatch(
        /captchaRequired\s*=\s*!!captcha\s*&&\s*captcha\.type\s*!==\s*'none'/,
      )
    })

    it(`${rel} blocks submit when a captcha is required but unsolved`, () => {
      expect(src).toMatch(
        /!captchaRequired\s*\|\|\s*captchaToken\s*!==\s*null/,
      )
    })
  }
})
