import { describe, expect, test } from 'vitest'

import {
  GEIST_CDN_ORIGIN,
  GEIST_VERSION,
  geistBaseURL,
  geistFontFace,
  geistMono,
  geistPreloadHrefs,
  geistProperties,
  geistSans,
  GEIST_MONO_FAMILY,
  GEIST_SANS_FAMILY,
  installGeist,
} from '../src/index'

describe('the URL the bytes come from', () => {
  test('defaults to the versioned, immutable path on our own CDN', () => {
    expect(geistBaseURL()).toBe(`${GEIST_CDN_ORIGIN}/fonts/geist/${GEIST_VERSION}`)
    expect(geistPreloadHrefs()).toEqual([
      `https://cdn.hanzo.ai/fonts/geist/${GEIST_VERSION}/GeistVariable.woff2`,
      `https://cdn.hanzo.ai/fonts/geist/${GEIST_VERSION}/GeistMonoVariable.woff2`,
    ])
  })

  test('self-hosted serves the same layout from the app origin', () => {
    expect(geistBaseURL({ mode: 'self-hosted' })).toBe(`/fonts/geist/${GEIST_VERSION}`)
    expect(geistPreloadHrefs({ mode: 'self-hosted' })).toEqual([
      `/fonts/geist/${GEIST_VERSION}/GeistVariable.woff2`,
      `/fonts/geist/${GEIST_VERSION}/GeistMonoVariable.woff2`,
    ])
  })

  test('a version is a directory, so publishing one never disturbs another', () => {
    expect(geistBaseURL({ version: '9.9.9' })).toContain('/fonts/geist/9.9.9')
    expect(geistBaseURL({ version: '9.9.9' })).not.toContain(GEIST_VERSION)
  })

  test('a trailing slash on the base does not double up', () => {
    expect(geistBaseURL({ base: 'https://cdn.example/' })).toBe(
      `https://cdn.example/fonts/geist/${GEIST_VERSION}`
    )
  })
})

describe('the @font-face rules', () => {
  const css = geistFontFace()

  test('name both families and point at the two variable files', () => {
    expect(css).toContain('font-family: "Geist";')
    expect(css).toContain('font-family: "Geist Mono";')
    expect(css).toContain(
      `${GEIST_CDN_ORIGIN}/fonts/geist/${GEIST_VERSION}/GeistVariable.woff2`
    )
    expect(css).toContain(
      `${GEIST_CDN_ORIGIN}/fonts/geist/${GEIST_VERSION}/GeistMonoVariable.woff2`
    )
    expect(css.match(/@font-face/g)).toHaveLength(2)
  })

  test('never leave text invisible, and cover the whole weight axis', () => {
    expect(css.match(/font-display: swap;/g)).toHaveLength(2)
    expect(css.match(/font-weight: 100 900;/g)).toHaveLength(2)
  })

  test('switching to self-hosted changes only the origin', () => {
    const self = geistFontFace({ mode: 'self-hosted' })
    expect(self).not.toContain('cdn.hanzo.ai')
    expect(self.replace(/url\("[^"]*\//g, 'url("')).toBe(
      css.replace(/url\("[^"]*\//g, 'url("')
    )
  })
})

describe('the fallback chain', () => {
  // The bug this exists to prevent: a family the browser cannot resolve leaves
  // the document on its default, which is a serif.
  test('sans ends in sans-serif and never in a serif', () => {
    expect(geistSans.startsWith('"Geist"')).toBe(true)
    expect(geistSans).toContain('system-ui')
    expect(geistSans.trim().endsWith('sans-serif')).toBe(true)
    expect(geistSans.replace(/sans-serif/g, '')).not.toMatch(/\bserif\b/)
  })

  test('mono ends in monospace and offers ui-monospace first', () => {
    expect(geistMono.startsWith('"Geist Mono"')).toBe(true)
    expect(geistMono).toContain('ui-monospace')
    expect(geistMono.trim().endsWith('monospace')).toBe(true)
    expect(geistMono).not.toMatch(/\bserif\b/)
  })
})

describe('the typeface is named in exactly one place', () => {
  test('every stack, rule and native face agrees on the family', () => {
    // The stack, the @font-face rule and the native family are three spellings
    // of one name; if they can drift, the font silently stops resolving.
    expect(geistSans.startsWith(`"${GEIST_SANS_FAMILY}",`)).toBe(true)
    expect(geistMono.startsWith(`"${GEIST_MONO_FAMILY}",`)).toBe(true)
    expect(geistFontFace()).toContain(`font-family: "${GEIST_SANS_FAMILY}"`)
    expect(geistFontFace()).toContain(`font-family: "${GEIST_MONO_FAMILY}"`)
  })

  test('the mono family is the real face name, not a squashed one', () => {
    // "GeistMono" is not the name the bytes register, so it resolves to nothing.
    expect(GEIST_MONO_FAMILY).toBe('Geist Mono')
    expect(geistFontFace()).not.toContain('"GeistMono"')
  })
})

describe('a fallback is always a sans, never the browser default', () => {
  test('the sans stack ends in sans-serif and the mono stack in monospace', () => {
    expect(geistSans.trimEnd().endsWith('sans-serif')).toBe(true)
    expect(geistMono.trimEnd().endsWith('monospace')).toBe(true)
  })

  test('neither stack names a bare serif family', () => {
    // `sans-serif` ends the stack and is the point; a standalone `serif` would
    // be the failure. Remove the legitimate one, then nothing may remain.
    expect(geistSans.replaceAll('sans-serif', '')).not.toMatch(/\bserif\b/)
    expect(geistMono.replaceAll('sans-serif', '')).not.toMatch(/\bserif\b/)
  })

  test('text never goes invisible waiting on the network', () => {
    expect(geistFontFace()).toContain('font-display: swap')
  })

  test('one variable file covers the whole weight range', () => {
    expect(geistFontFace().match(/font-weight: 100 900/g)).toHaveLength(2)
    expect(geistFontFace().match(/format\("woff2"\)/g)).toHaveLength(2)
  })
})

describe('installing the typeface', () => {
  test('the properties bind to the stacks the tokens use', () => {
    expect(geistProperties()).toContain(`--hz-font-sans: ${geistSans}`)
    expect(geistProperties()).toContain(`--hz-font-mono: ${geistMono}`)
  })

  test('both halves land together — rules that fetch, properties that point', () => {
    // Either alone is a page that renders in a fallback while looking configured.
    const doc = makeDoc()
    expect(installGeist({}, doc as unknown as Document)).toBe(true)
    const css = installedCSS(doc)
    expect(css).toContain('@font-face')
    expect(css).toContain('--hz-font-sans')
  })

  test('falls back to a style element where adoptedStyleSheets is absent', () => {
    const doc = makeDoc({ adopted: false })
    expect(installGeist({}, doc as unknown as Document)).toBe(true)
    expect(installedCSS(doc)).toContain('@font-face')
  })

  test('says so rather than throwing when there is no document', () => {
    expect(installGeist({}, undefined)).toBe(false)
  })

  test('an air-gapped install serves the same layout from its own origin', () => {
    const doc = makeDoc()
    installGeist({ mode: 'self-hosted' }, doc as unknown as Document)
    const css = installedCSS(doc)
    expect(css).toContain(`/fonts/geist/${GEIST_VERSION}/GeistVariable.woff2`)
    expect(css).not.toContain(GEIST_CDN_ORIGIN)
  })
})

type FakeDoc = {
  adoptedStyleSheets?: { cssText: string }[]
  head: { appendChild: (n: { textContent: string }) => void }
  createElement: () => { textContent: string; setAttribute: () => void }
  _elements: { textContent: string }[]
}

function makeDoc({ adopted = true }: { adopted?: boolean } = {}): FakeDoc {
  const elements: { textContent: string }[] = []
  const doc: FakeDoc = {
    head: { appendChild: (n) => elements.push(n) },
    createElement: () => ({ textContent: '', setAttribute: () => {} }),
    _elements: elements,
  }
  if (adopted) doc.adoptedStyleSheets = []
  return doc
}

function installedCSS(doc: FakeDoc): string {
  const sheets = (doc.adoptedStyleSheets ?? []).map((s) => s.cssText).join('')
  return sheets + doc._elements.map((e) => e.textContent).join('')
}
