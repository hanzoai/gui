// Defense-in-depth: UserEdit MUST gate the `isAdmin` toggle on the
// signed-in operator's super-admin status. The server is still
// authoritative; this test pins the client-side hint so non-super
// admins never see an enabled toggle they can't actually use.
//
// We don't render the page (it needs a hanzogui Provider + react-router
// + the IAM whoami endpoint). Instead we assert the source-level
// wiring: the file imports the gating predicate, calls useIdentity,
// and passes `disabled={!canEditAdminFlag}` (or equivalent) to the
// admin ToggleField. Every regression hits one of these assertions.

import { describe, expect, it } from 'vitest'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const SRC = path.resolve(process.cwd(), 'src/iam/identity/UserEdit.tsx')

async function read(): Promise<string> {
  return await fs.readFile(SRC, 'utf8')
}

describe('UserEdit — isAdmin toggle gating', () => {
  it('imports useIdentity + isSuperAdmin from the data layer', async () => {
    const src = await read()
    expect(src).toMatch(/useIdentity[\s\S]*?from '\.\.\/\.\.\/data'/)
    expect(src).toMatch(/isSuperAdmin[\s\S]*?from '\.\.\/\.\.\/data'/)
  })

  it('computes canEditAdminFlag from the resolved identity', async () => {
    const src = await read()
    expect(src).toMatch(/const\s+\{\s*identity\s*\}\s*=\s*useIdentity\(\)/)
    expect(src).toMatch(/canEditAdminFlag\s*=\s*isSuperAdmin\(identity\)/)
  })

  it('passes disabled={!canEditAdminFlag} to the user-admin toggle', async () => {
    const src = await read()
    // Locate the user-admin ToggleField block and assert the
    // disabled prop is wired.
    const block = src.match(
      /<ToggleField[\s\S]*?id="user-admin"[\s\S]*?\/>/,
    )
    expect(block, 'user-admin ToggleField must exist').toBeTruthy()
    const text = block?.[0] ?? ''
    expect(text).toMatch(/disabled=\{\s*!canEditAdminFlag\s*\}/)
    // And explains *why* via a hint when disabled.
    expect(text).toMatch(/Only super-admins/)
  })
})
