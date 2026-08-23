import { describe, expect, test } from 'vitest'

import {
  ZEN_MONO_FAMILY,
  ZEN_SANS_FAMILY,
  zenMono,
  zenMonoFamily,
  zenSans,
  zenSansFamily,
} from '../src/index'
import * as fontZen from '../src/index'

describe('the fallback chain', () => {
  // The bug this exists to prevent: a family the browser cannot resolve leaves
  // the document on its default, which is a serif.
  test('sans ends in sans-serif and never in a serif', () => {
    expect(zenSans.startsWith('"Zen"')).toBe(true)
    expect(zenSans).toContain('system-ui')
    expect(zenSans.trim().endsWith('sans-serif')).toBe(true)
    expect(zenSans.replaceAll('sans-serif', '')).not.toMatch(/\bserif\b/)
  })

  test('mono ends in monospace and offers ui-monospace first', () => {
    expect(zenMono.startsWith('"Zen Mono"')).toBe(true)
    expect(zenMono).toContain('ui-monospace')
    expect(zenMono.trim().endsWith('monospace')).toBe(true)
    expect(zenMono.replaceAll('sans-serif', '')).not.toMatch(/\bserif\b/)
  })
})

describe('the typeface is named in exactly one place', () => {
  test('every stack and platform face agrees on the family', () => {
    // The stack and the native family are two spellings of one name; if they
    // can drift, the font silently stops resolving.
    expect(zenSans.startsWith(`"${ZEN_SANS_FAMILY}",`)).toBe(true)
    expect(zenMono.startsWith(`"${ZEN_MONO_FAMILY}",`)).toBe(true)
    expect([zenSans, ZEN_SANS_FAMILY]).toContain(zenSansFamily)
    expect([zenMono, ZEN_MONO_FAMILY]).toContain(zenMonoFamily)
  })

  test('the mono family is the real face name, not a squashed one', () => {
    // "ZenMono" is not the name the bytes register, so it resolves to nothing.
    expect(ZEN_MONO_FAMILY).toBe('Zen Mono')
    expect(zenMono).not.toContain('"ZenMono"')
  })
})

describe('the faces belong to @hanzo/font', () => {
  test('this package names the family and emits no @font-face of its own', () => {
    // A second copy of the rules is a second answer to "where are the bytes",
    // and the copy this replaced pointed at a CDN path that serves nothing.
    for (const name of Object.keys(fontZen)) {
      expect(name).not.toMatch(/FontFace|Stylesheet|Properties|PreloadHrefs|BaseURL/)
    }
  })
})

describe('the fonts the kit builds', () => {
  test('carry the family and a line height for every size', () => {
    const sans = fontZen.createZenSansFont()
    const mono = fontZen.createZenMonoFont()
    expect(sans.family).toBe(zenSansFamily)
    expect(mono.family).toBe(zenMonoFamily)
    expect(Object.keys(sans.lineHeight)).toEqual(Object.keys(sans.size))
  })
})
