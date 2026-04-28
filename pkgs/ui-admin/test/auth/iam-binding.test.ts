// IAM-class binding test for the end-user auth surface.
//
// Login / Signup / ForgotPassword route every network call through
// the canonical `IAM` class from `@hanzo/iam/browser`. We verify
// against the source that:
//   1. Each component imports the IAM type from `@hanzo/iam/browser`.
//   2. Each component requires an `iam: IAM` prop.
//   3. Each component drives its submit handler off `iam.<method>` —
//      no bespoke fetch / no legacy `onSubmit(payload)` callback.
// A previous shape let consumers wire arbitrary fetch logic via
// callback props; this test pins the canonical boundary closed.

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const FILES = [
  '../../src/auth/Login.tsx',
  '../../src/auth/Signup.tsx',
  '../../src/auth/ForgotPassword.tsx',
] as const

describe('auth forms — canonical IAM class boundary', () => {
  for (const rel of FILES) {
    const src = readFileSync(join(__dirname, rel), 'utf8')

    it(`${rel} imports IAM from @hanzo/iam/browser`, () => {
      expect(src).toMatch(/from '@hanzo\/iam\/browser'/)
    })

    it(`${rel} declares an iam: IAM prop`, () => {
      expect(src).toMatch(/iam:\s*IAM/)
    })

    it(`${rel} routes its submit through an iam method call`, () => {
      // At least one of the canonical methods must be invoked. We
      // search for the dispatch shape `iam.<method>(`.
      expect(src).toMatch(
        /iam\.(loginWithCredentials|exchangeCodeForToken|loginWithPhoneOTP|signup|sendVerificationCode)\(/,
      )
    })

    it(`${rel} carries no legacy onSubmit payload prop`, () => {
      // The legacy API exposed `onSubmit: (payload: ...Payload) => Promise<void>`.
      // Going forward, the IAM class IS the auth boundary; the
      // `onSubmit` prop is gone in favour of the side-effect-free
      // `onSuccess` callback.
      expect(src).not.toMatch(/onSubmit:\s*\(payload:/)
      expect(src).not.toMatch(/LoginPayload|SignupPayload|ForgetPayload/)
    })

    it(`${rel} contains no direct fetch() call`, () => {
      // The IAM class owns the wire path. Any `fetch(` here would
      // fork the canonical auth boundary.
      expect(src).not.toMatch(/\bfetch\(/)
    })
  }
})
