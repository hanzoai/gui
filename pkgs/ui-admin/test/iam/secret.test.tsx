// Cross-bucket invariant: every IAM edit page that handles a secret
// MUST hold it in a write-only `*Edit` state. Binding `value={draft.X}`
// straight back into a `secureTextEntry` input — or even into a plain
// editable text field for tokens / minted credentials — round-trips the
// stored value through the DOM and back to the server. That's the
// upstream Casdoor regression the security review surfaced; closing it
// means the source of every edit page must NOT contain those bindings.
//
// This test scans the source files. Runtime behaviour is covered by
// the Playwright suite, but a syntactic ban gives us O(1) protection
// against the regression sneaking back in.

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

interface FileBan {
  /** path relative to the repo root */
  path: string
  /** which secret-shaped fields must NOT bind to `value={draft.X}` */
  bannedFields: readonly string[]
  /** must declare a secureTextEntry input (true) or use CopyField (false) */
  requireSecureTextEntry: boolean
}

const FILES: readonly FileBan[] = [
  // Federation bucket — bind passwords / HMAC secrets.
  {
    path: '../../src/iam/federation/WebhookEdit.tsx',
    bannedFields: ['secret'],
    requireSecureTextEntry: true,
  },
  {
    path: '../../src/iam/federation/LdapEdit.tsx',
    bannedFields: ['password'],
    requireSecureTextEntry: true,
  },
  {
    path: '../../src/iam/federation/SyncerEdit.tsx',
    bannedFields: ['password', 'sshPassword'],
    requireSecureTextEntry: true,
  },
  // Auth bucket — OAuth/OIDC client secrets, server-issued tokens & keys.
  {
    path: '../../src/iam/auth/AppEdit.tsx',
    bannedFields: ['clientSecret'],
    requireSecureTextEntry: true,
  },
  {
    path: '../../src/iam/auth/ProviderEdit.tsx',
    bannedFields: ['clientSecret'],
    requireSecureTextEntry: true,
  },
  // Token: server-issued blobs round-trip through CopyField, never editable.
  {
    path: '../../src/iam/auth/TokenEdit.tsx',
    bannedFields: ['accessToken', 'refreshToken'],
    requireSecureTextEntry: false,
  },
  // Key: same story for the access key + secret pair.
  {
    path: '../../src/iam/auth/KeyEdit.tsx',
    bannedFields: ['accessSecret'],
    requireSecureTextEntry: false,
  },
  // Policy bucket — Casbin adapter DB password.
  {
    path: '../../src/iam/policy/AdapterEdit.tsx',
    bannedFields: ['password'],
    requireSecureTextEntry: true,
  },
] as const

function bannedPatternsFor(field: string): readonly RegExp[] {
  const f = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Cover bare bindings, fallback-`||`, fallback-`??`, all of which
  // echo the server value back into the form.
  return [
    new RegExp(`\\bvalue=\\{draft\\.${f}\\}`),
    new RegExp(`\\bvalue=\\{draft\\.${f}\\s*\\|\\|`),
    new RegExp(`\\bvalue=\\{draft\\.${f}\\s*\\?\\?`),
  ] as const
}

describe('IAM edit pages — secret fields are write-only', () => {
  for (const file of FILES) {
    const abs = join(__dirname, file.path)
    const src = readFileSync(abs, 'utf8')

    for (const field of file.bannedFields) {
      for (const pat of bannedPatternsFor(field)) {
        it(`${file.path} does not bind \`${field}\` via ${pat.source}`, () => {
          expect(src).not.toMatch(pat)
        })
      }
    }

    if (file.requireSecureTextEntry) {
      it(`${file.path} declares a masked secret input`, () => {
        // Either a hanzogui Input with `secureTextEntry` (federation /
        // policy) or a Field with `type="password"` (auth bucket which
        // wraps Input via primitives). Both render a `<input type=
        // "password">` underneath.
        expect(src).toMatch(/secureTextEntry|type="password"/)
      })
    } else {
      it(`${file.path} renders server-issued values via CopyField only`, () => {
        expect(src).toMatch(/CopyField/)
      })
    }
  }
})

describe('IAM edit pages — save payloads strip server-issued fields', () => {
  // TokenEdit and KeyEdit must omit server-minted blobs from the POST
  // body. We assert the destructure literally lives in the source
  // — the simplest evidence that the fields don't round-trip.
  it('TokenEdit strips accessToken/refreshToken/code on save', () => {
    const src = readFileSync(
      join(__dirname, '../../src/iam/auth/TokenEdit.tsx'),
      'utf8',
    )
    expect(src).toMatch(/accessToken:\s*_omit/)
    expect(src).toMatch(/refreshToken:\s*_omit/)
    expect(src).toMatch(/code:\s*_omit/)
  })

  it('KeyEdit strips accessKey/accessSecret on save', () => {
    const src = readFileSync(
      join(__dirname, '../../src/iam/auth/KeyEdit.tsx'),
      'utf8',
    )
    expect(src).toMatch(/accessKey:\s*_omit/)
    expect(src).toMatch(/accessSecret:\s*_omit/)
  })

  it('ProviderEdit omits clientSecret when blank', () => {
    const src = readFileSync(
      join(__dirname, '../../src/iam/auth/ProviderEdit.tsx'),
      'utf8',
    )
    expect(src).toMatch(/clientSecret:\s*_omit/)
    expect(src).toMatch(/clientSecretEdit/)
  })

  it('AppEdit omits clientSecret when blank', () => {
    const src = readFileSync(
      join(__dirname, '../../src/iam/auth/AppEdit.tsx'),
      'utf8',
    )
    expect(src).toMatch(/clientSecret:\s*_omit/)
    expect(src).toMatch(/clientSecretEdit/)
  })

  it('AdapterEdit omits password when blank', () => {
    const src = readFileSync(
      join(__dirname, '../../src/iam/policy/AdapterEdit.tsx'),
      'utf8',
    )
    expect(src).toMatch(/password:\s*_omit/)
    expect(src).toMatch(/passwordEdit/)
  })

  it('LdapEdit omits password when blank', () => {
    const src = readFileSync(
      join(__dirname, '../../src/iam/federation/LdapEdit.tsx'),
      'utf8',
    )
    expect(src).toMatch(/password:\s*_omit/)
    // The legacy code path (`password: ''`) must be gone.
    expect(src).not.toMatch(/password:\s*''/)
  })

  it('SyncerEdit omits password and sshPassword when blank', () => {
    const src = readFileSync(
      join(__dirname, '../../src/iam/federation/SyncerEdit.tsx'),
      'utf8',
    )
    expect(src).not.toMatch(/password:\s*passwordEdit\s*\|\|\s*''/)
    expect(src).not.toMatch(/sshPassword:\s*sshPasswordEdit\s*\|\|\s*''/)
    expect(src).toMatch(/delete base\.password/)
    expect(src).toMatch(/delete base\.sshPassword/)
  })
})
