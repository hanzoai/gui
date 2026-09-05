// @vitest-environment happy-dom
//
// What these tests actually prove, end to end:
//
//   1. With NO configuration, events reach exactly ONE URL —
//      https://api.hanzo.ai/v1/event — and nothing else is ever contacted.
//   2. All three lenses are fed by that one stream: a pageview, a product event
//      and an exception all appear in the same batch with the right `type`, so
//      Cloud can fan them out to analytics / insights / sentry.
//   3. Do-Not-Track and Global Privacy Control are honored with zero app code,
//      and an explicit stored choice outranks them in both directions.
//   4. Nothing is written to storage while telemetry is refused.
//   5. Nothing ever throws into the host app — no network, no storage, no
//      well-formed error required.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { onConsentChange, setConsent } from '../src/consent'
import { productFromHost, resolveEnv } from '../src/env'
import { createTelemetry, setTelemetry } from '../src/telemetry'

interface Sent {
  url: string
  batch: Array<Record<string, unknown>>
}

let sent: Sent[]

/** happy-dom ships no localStorage, which is also the Safari-private-mode case
 *  the client must survive — so the tests install a real one explicitly when
 *  they mean to exercise persistence, and remove it when they do not. */
function installStorage(): Storage {
  const map = new Map<string, string>()
  const storage: Storage = {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
  }
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true })
  return storage
}

function stubNavigator(patch: Record<string, unknown>): void {
  vi.stubGlobal('navigator', patch)
}

function captureFetch(): void {
  sent = []
  vi.stubGlobal('fetch', (url: string, init?: { body?: string }) => {
    const body = JSON.parse(init?.body ?? '{"batch":[]}') as {
      batch: Array<Record<string, unknown>>
    }
    sent.push({ url, batch: body.batch })
    return Promise.resolve({ ok: true } as Response)
  })
}

beforeEach(() => {
  installStorage().clear()
  stubNavigator({})
  setTelemetry(undefined)
  captureFetch()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('the one front door', () => {
  it('defaults to https://api.hanzo.ai/v1/event with no configuration', () => {
    expect(resolveEnv().host).toBe('https://api.hanzo.ai')

    const t = createTelemetry()
    expect(t.enabled).toBe(true)
    t.track('plan_clicked', { plan: 'pro' })
    t.flush()

    expect(sent).toHaveLength(1)
    expect(sent[0]!.url).toBe('https://api.hanzo.ai/v1/event')
  })

  it('carries all three lenses on ONE stream', () => {
    const t = createTelemetry({ product: 'site' })
    t.pageview('/pricing') //                     → analytics.hanzo.ai
    t.track('plan_clicked', { plan: 'pro' }) //   → insights.hanzo.ai
    t.identify('user-42')
    t.captureError(new TypeError('boom')) //      → sentry.hanzo.ai (+ analytics_errors)
    t.flush()

    const batch = sent.flatMap((s) => s.batch)
    const kinds = batch.map((e) => e.type)
    expect(kinds).toContain('pageview')
    expect(kinds).toContain('event')
    expect(kinds).toContain('identify')

    // Every event names the same emitting surface and rides the same wire.
    expect(new Set(batch.map((e) => e.product))).toEqual(new Set(['site']))
    expect(new Set(sent.map((s) => s.url))).toEqual(
      new Set(['https://api.hanzo.ai/v1/event'])
    )

    // A reported error is `handled: true`; only global/unhandled capture is false.
    const err = batch.find((e) => e.event === '$exception' || Boolean(e.error)) as {
      error: Record<string, unknown>
    }
    expect(err).toBeDefined()
    expect(err.error).toMatchObject({ type: 'TypeError', message: 'boom', handled: true })
  })

  it('never contacts sentry./analytics./insights. hosts — those are dashboards', () => {
    const t = createTelemetry()
    t.track('x')
    t.captureError(new Error('y'))
    t.flush()
    expect(sent.length).toBeGreaterThan(0)
    for (const s of sent) {
      expect(s.url).not.toMatch(
        /sentry\.hanzo\.ai|analytics\.hanzo\.ai|insights\.hanzo\.ai/
      )
    }
  })

  it('sends a publishable key so a logged-out page still reports', () => {
    const urls: string[] = []
    vi.stubGlobal('fetch', (url: string) => {
      urls.push(url)
      return Promise.resolve({ ok: true } as Response)
    })
    const t = createTelemetry({ ingestKey: 'pk_live_test' })
    t.track('x')
    t.flush()
    expect(urls[0]).toBe('https://api.hanzo.ai/v1/event?ingest_key=pk_live_test')
  })
})

describe('zero configuration', () => {
  it('infers the emitting surface from the host', () => {
    expect(productFromHost('hanzo.ai')).toBe('site')
    expect(productFromHost('www.hanzo.ai')).toBe('site')
    expect(productFromHost('console.hanzo.ai')).toBe('console')
    expect(productFromHost('cloud.hanzo.ai')).toBe('cloud')
    expect(productFromHost('hanzo.chat')).toBe('chat')
    expect(productFromHost('hanzo.app')).toBe('app')
    expect(productFromHost('zoo.ngo')).toBe('zoo')
    expect(productFromHost('localhost')).toBe('dev')
    expect(productFromHost(undefined)).toBeUndefined()
  })

  it('reads a runtime global for pages with no build step', () => {
    ;(globalThis as unknown as Record<string, unknown>).__HANZO_TELEMETRY__ = {
      ingestKey: 'pk_from_script_tag',
      product: 'docs',
    }
    try {
      const env = resolveEnv()
      expect(env.ingestKey).toBe('pk_from_script_tag')
      expect(createTelemetry().product).toBe('docs')
    } finally {
      delete (globalThis as unknown as Record<string, unknown>).__HANZO_TELEMETRY__
    }
  })
})

describe('privacy', () => {
  it('honors Global Privacy Control with no app code', () => {
    stubNavigator({ globalPrivacyControl: true })
    const t = createTelemetry()
    expect(t.enabled).toBe(false)
    t.track('should_not_ship')
    t.flush()
    expect(sent).toHaveLength(0)
  })

  it('honors Do-Not-Track with no app code', () => {
    stubNavigator({ doNotTrack: '1' })
    expect(createTelemetry().enabled).toBe(false)
  })

  it('lets an explicit choice outrank the browser default, both ways', () => {
    stubNavigator({ doNotTrack: '1' })
    setConsent('granted')
    expect(createTelemetry().enabled).toBe(true)

    setConsent('denied')
    expect(createTelemetry().enabled).toBe(false)

    setConsent('unset') // back to honoring the browser
    expect(createTelemetry().enabled).toBe(false)
  })

  it('writes nothing to storage while telemetry is refused', () => {
    stubNavigator({ doNotTrack: '1' })
    const t = createTelemetry()
    t.track('x')
    t.pageview('/')
    t.flush()
    expect(window.localStorage.length).toBe(0)
  })

  it('respects a build-time kill switch over everything', () => {
    setConsent('granted')
    expect(createTelemetry({ enabled: false }).enabled).toBe(false)
  })

  it('notifies live listeners the moment consent changes', () => {
    const seen: Array<string | undefined> = []
    const off = onConsentChange((c) => seen.push(c))
    setConsent('denied')
    setConsent('granted')
    off()
    setConsent('denied')
    expect(seen).toEqual(['denied', 'granted'])
  })
})

describe('fail-soft', () => {
  it('swallows a transport that throws', () => {
    vi.stubGlobal('fetch', () => {
      throw new Error('network is down')
    })
    const t = createTelemetry()
    expect(() => {
      t.track('x')
      t.flush()
    }).not.toThrow()
  })

  it('swallows a non-Error thrown value', () => {
    const t = createTelemetry()
    expect(() => t.captureError({ weird: true })).not.toThrow()
    t.flush()
    const err = sent
      .flatMap((s) => s.batch)
      .find((e) => e.event === '$exception' || Boolean(e.error))
    expect(err).toBeDefined()
  })

  it('works with no localStorage at all (Safari private mode)', () => {
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      configurable: true,
    })
    const t = createTelemetry()
    expect(() => {
      t.track('x')
      t.flush()
    }).not.toThrow()
    expect(sent[0]?.url).toBe('https://api.hanzo.ai/v1/event')
  })
})
