import dedent from 'dedent'
import * as React from 'react'
import { describe, expect, test } from 'vitest'
import {
  DEFAULT_EXTRACT_PACKAGES,
  installedPackageOf,
  isExtractable,
} from '@hanzogui/static'

import { extractForWeb } from './lib/extract'

Error.stackTraceLimit = Number.MAX_SAFE_INTEGER
process.env.GUI_TARGET = 'web'
window['React'] = React

describe('installedPackageOf', () => {
  test('names the package that owns the file, or nothing for app source', () => {
    expect(installedPackageOf('/app/src/Home.tsx')).toBe('')
    expect(installedPackageOf('/app/node_modules/react-dom/index.js')).toBe('react-dom')
    expect(installedPackageOf('/app/node_modules/@hanzo/ui/dist/index.js')).toBe(
      '@hanzo/ui'
    )
  })

  test('the LAST node_modules wins, so nesting and pnpm both name the owner', () => {
    expect(
      installedPackageOf('/a/node_modules/@hanzo/ui/node_modules/@hanzogui/core/x.js')
    ).toBe('@hanzogui/core')
    expect(
      installedPackageOf(
        '/a/node_modules/.pnpm/@hanzogui+text@8.1.0/node_modules/@hanzogui/text/dist/jsx/Text.mjs'
      )
    ).toBe('@hanzogui/text')
  })

  test('reads windows separators', () => {
    expect(installedPackageOf('C:\\a\\node_modules\\@hanzogui\\core\\dist\\x.js')).toBe(
      '@hanzogui/core'
    )
  })
})

describe('isExtractable', () => {
  test('app source always, installed packages never, until one is named', () => {
    const installed = '/a/node_modules/@hanzogui/button/dist/esm/Button.mjs'
    expect(isExtractable('/a/src/Home.tsx')).toBe(true)
    expect(isExtractable(installed)).toBe(false)
    expect(isExtractable(installed, DEFAULT_EXTRACT_PACKAGES)).toBe(true)
  })

  test('a scope entry takes the scope, a plain entry takes one package', () => {
    expect(isExtractable('/a/node_modules/@acme/kit/dist/a.js', ['@acme/*'])).toBe(true)
    expect(isExtractable('/a/node_modules/@hanzo/ui/dist/a.js', ['@hanzo/ui'])).toBe(true)
    expect(isExtractable('/a/node_modules/@hanzo/gui/dist/a.js', ['@hanzo/ui'])).toBe(
      false
    )
  })

  test('naming a package does not admit its neighbours', () => {
    expect(
      isExtractable('/a/node_modules/react-dom/index.js', DEFAULT_EXTRACT_PACKAGES)
    ).toBe(false)
  })

  test('generated icon sets stay out, installed or in a workspace', () => {
    expect(
      isExtractable(
        '/a/node_modules/@hanzogui/lucide-icons-2/dist/esm/icons/Activity.js',
        DEFAULT_EXTRACT_PACKAGES
      )
    ).toBe(false)
    expect(isExtractable('/repo/pkgs/lucide-icons/src/icons/Activity.tsx')).toBe(false)
  })
})

describe('extracting from an installed package', () => {
  // what a published @hanzogui package actually ships: a .mjs whose JSX is
  // already lowered, holding a styled() definition
  const packageSource = dedent`
    import { MyStack } from '@hanzogui/test-design-system'
    import { styled } from '@hanzogui/core'

    export const Boxy = styled(MyStack, {
      backgroundColor: 'orange'
    })
  `
  const installedPath = '/app/node_modules/@hanzogui/test-design-system/dist/esm/Boxy.mjs'

  test('is refused by default — the allowlist is empty', async () => {
    const out = await extractForWeb(packageSource, {
      sourcePath: installedPath,
      options: { enableDynamicEvaluation: true },
    })
    expect(out).toBe(null)
  })

  test('is extracted once the package is named', async () => {
    const out = await extractForWeb(packageSource, {
      sourcePath: installedPath,
      options: {
        enableDynamicEvaluation: true,
        extractPackages: DEFAULT_EXTRACT_PACKAGES,
      },
    })
    if (!out) throw new Error('no output — the allowlist did not admit the package')
    expect(out.styles).toContain('background-color')
    expect(out.styles).toContain('orange')
  })

  test('naming a different package still refuses it', async () => {
    const out = await extractForWeb(packageSource, {
      sourcePath: installedPath,
      options: { enableDynamicEvaluation: true, extractPackages: ['@acme/*'] },
    })
    expect(out).toBe(null)
  })

  test('app source is unaffected by the allowlist either way', async () => {
    const appSource = dedent`
      import { MyStack } from '@hanzogui/test-design-system'
      import { styled } from '@hanzogui/core'

      export const Boxy = styled(MyStack, { backgroundColor: 'orange' })
    `
    const out = await extractForWeb(appSource, {
      sourcePath: '/app/src/Boxy.tsx',
      options: { enableDynamicEvaluation: true },
    })
    if (!out) throw new Error('no output for app source')
    expect(out.styles).toContain('orange')
  })
})
