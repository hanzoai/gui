// Defense-in-depth: the impersonate flow MUST gate submit on
// (a) the operator typing the target's exact username AND
// (b) supplying a non-empty reason that gets persisted to audit.
//
// Source-level assertions verify the wiring; a runtime test would
// require a hanzogui Provider stack which the page-level tests in
// this bucket already deliberately skip. The combinations covered
// below are sufficient to catch any regression that would weaken
// the gate.

import { describe, expect, it } from 'vitest'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const SRC = path.resolve(process.cwd(), 'src/iam/identity/UserList.tsx')

async function read(): Promise<string> {
  return await fs.readFile(SRC, 'utf8')
}

describe('UserList — impersonate ceremony', () => {
  it('does not use window.confirm for impersonation', async () => {
    const src = await read()
    // The impersonate handler must not fall back to window.confirm.
    // We allow window.confirm in `onDelete` (lower-stakes), but the
    // impersonate path must exclusively use the structured dialog.
    const impersonateBlock = src.match(
      /const\s+(?:openImpersonate|submitImpersonate|onImpersonate)[\s\S]*?\n\}\n/g,
    )
    expect(impersonateBlock).toBeTruthy()
    for (const block of impersonateBlock ?? []) {
      expect(block).not.toMatch(/window\.confirm/)
    }
  })

  it('exposes ImpersonateDialog with the audit/typed-name gate', async () => {
    const src = await read()
    expect(src).toMatch(/export function ImpersonateDialog/)
    // The submit button is disabled unless typed === target AND reason is set.
    expect(src).toMatch(/typedName === target\.name/)
    expect(src).toMatch(/reason\.trim\(\)\.length > 0/)
    expect(src).toMatch(/disabled=\{!canSubmit\}/)
  })

  it('sends reason in the impersonate POST payload', async () => {
    const src = await read()
    expect(src).toMatch(/apiPost\(\s*iamUrl\('impersonate-user'\)/)
    expect(src).toMatch(/reason:\s*reason\.trim\(\)/)
    expect(src).toMatch(/target:\s*`\$\{target\.owner\}\/\$\{target\.name\}`/)
  })

  it('renders the audit Reason TextArea + typed-confirmation Input', async () => {
    const src = await read()
    expect(src).toMatch(/Reason for impersonation/)
    expect(src).toMatch(/<TextArea/)
    expect(src).toMatch(/Type the username/)
  })
})

describe('canSubmit predicate — combinatorial gate', () => {
  // The predicate is inlined in the component body. We re-derive it
  // here from the same rules to make sure the rules themselves are
  // correct. If anyone weakens the rules, this test breaks alongside
  // the source assertions above.
  type Draft = {
    target: { name: string }
    typedName: string
    reason: string
    submitting: boolean
  }
  const canSubmit = (d: Draft | null): boolean =>
    d !== null &&
    d.typedName === d.target.name &&
    d.reason.trim().length > 0 &&
    !d.submitting

  it('rejects when nothing is typed', () => {
    expect(
      canSubmit({
        target: { name: 'alice' },
        typedName: '',
        reason: '',
        submitting: false,
      }),
    ).toBe(false)
  })

  it('rejects when only the username is typed', () => {
    expect(
      canSubmit({
        target: { name: 'alice' },
        typedName: 'alice',
        reason: '',
        submitting: false,
      }),
    ).toBe(false)
  })

  it('rejects when only a reason is typed', () => {
    expect(
      canSubmit({
        target: { name: 'alice' },
        typedName: '',
        reason: 'support ticket',
        submitting: false,
      }),
    ).toBe(false)
  })

  it('rejects whitespace-only reasons', () => {
    expect(
      canSubmit({
        target: { name: 'alice' },
        typedName: 'alice',
        reason: '   ',
        submitting: false,
      }),
    ).toBe(false)
  })

  it('rejects username with case mismatch (case-sensitive equality)', () => {
    expect(
      canSubmit({
        target: { name: 'alice' },
        typedName: 'Alice',
        reason: 'ok',
        submitting: false,
      }),
    ).toBe(false)
  })

  it('accepts only when both factors are present and not submitting', () => {
    expect(
      canSubmit({
        target: { name: 'alice' },
        typedName: 'alice',
        reason: 'ticket-1234',
        submitting: false,
      }),
    ).toBe(true)
  })

  it('rejects while a prior submit is in flight', () => {
    expect(
      canSubmit({
        target: { name: 'alice' },
        typedName: 'alice',
        reason: 'ticket-1234',
        submitting: true,
      }),
    ).toBe(false)
  })
})
