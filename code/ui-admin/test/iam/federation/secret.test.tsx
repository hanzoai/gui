import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Lightweight invariant check: the WebhookEdit and LdapEdit + SyncerEdit
// sources must NOT bind the secret/password back into the form via
// `value={draft.password}` / `value={draft.secret}` / `value={...sshPassword}`
// — those secrets are write-only. They must come from a separate
// `*Edit` state. This is enforced syntactically here; the runtime
// behaviour is covered by the Playwright suite.
//
// The whole point of the security review was that upstream Casdoor
// echoed plaintext secrets into the DOM after fetch. Closing that
// regression deserves a regression test.

const FILES = [
  '../../../src/iam/federation/WebhookEdit.tsx',
  '../../../src/iam/federation/LdapEdit.tsx',
  '../../../src/iam/federation/SyncerEdit.tsx',
]

// We only ban the *direct* `value={draft.password}` form. Allow
// `placeholder={draft.password ? ... }` — that just toggles a hint
// based on whether the server reported any value, never echoes it.
const BANNED_BINDINGS = [
  /\bvalue=\{draft\.password\}/,
  /\bvalue=\{draft\.password \|\|/,
  /\bvalue=\{draft\.password \?\?/,
  /\bvalue=\{draft\.secret\}/,
  /\bvalue=\{draft\.sshPassword\}/,
]

describe('secret fields are write-only', () => {
  for (const rel of FILES) {
    const abs = join(__dirname, rel)
    const src = readFileSync(abs, 'utf8')
    for (const pat of BANNED_BINDINGS) {
      it(`${rel} does not bind ${pat} into a value prop`, () => {
        expect(src).not.toMatch(pat)
      })
    }
    it(`${rel} declares a secureTextEntry input`, () => {
      // We can't be picky about which control — just that one of the
      // password / secret fields is masked.
      expect(src).toMatch(/secureTextEntry/)
    })
  }
})
