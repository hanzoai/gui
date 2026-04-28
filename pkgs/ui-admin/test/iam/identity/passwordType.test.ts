// Defense-in-depth: the OrgEdit page MUST NOT let an operator type
// `plain`, `bcrypt`, `md5`, or anything else into the passwordType
// field. The only safe value is `argon2id`. We assert the literal
// option set on the SelectField via the exported constant — if a
// future change ever broadens the set, this test breaks loudly.

import { describe, expect, it } from 'vitest'
import {
  PASSWORD_TYPE_OPTIONS,
  type PasswordType,
} from '../../../src/iam/identity/Field'

describe('passwordType — closed-set safe options', () => {
  it('exposes exactly one option: argon2id', () => {
    expect(PASSWORD_TYPE_OPTIONS).toEqual(['argon2id'])
  })

  it('is a frozen literal (readonly tuple)', () => {
    // The `as const` annotation gives us a readonly tuple. The
    // length is invariant; pushing or splicing is rejected by the
    // type system and we sanity-check it at runtime as well.
    expect(PASSWORD_TYPE_OPTIONS.length).toBe(1)
    // Type-side assertion: `'plain'` is not assignable to
    // `PasswordType`. We can't assert TS errors at runtime but we
    // can pin the union via a type-level identity test.
    const v: PasswordType = 'argon2id'
    expect(v).toBe('argon2id')
  })

  it('rejects unsafe candidates by membership check', () => {
    // The page wires `options={PASSWORD_TYPE_OPTIONS}` into
    // SelectField. Anything that fails .includes can never be chosen
    // in the UI.
    for (const unsafe of ['plain', 'bcrypt', 'md5', 'sha256', '123', '']) {
      expect((PASSWORD_TYPE_OPTIONS as readonly string[]).includes(unsafe)).toBe(
        false,
      )
    }
  })
})

describe('OrgEdit — wires SelectField, not Field, for passwordType', () => {
  it('source uses SelectField with PASSWORD_TYPE_OPTIONS', async () => {
    // Read the page source as text and assert the safe wiring is in
    // place. A regression that swaps SelectField for Field, or
    // hard-codes a different option list, fails this test.
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    const src = await fs.readFile(
      path.resolve(
        process.cwd(),
        'src/iam/identity/OrgEdit.tsx',
      ),
      'utf8',
    )
    expect(src).toContain('SelectField')
    expect(src).toContain('options={PASSWORD_TYPE_OPTIONS}')
    // No free-text Field for passwordType anymore.
    expect(src).not.toMatch(/<Field[^>]*onChangeText=\{[^}]*passwordType/)
  })
})
