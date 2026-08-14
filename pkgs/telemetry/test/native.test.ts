// @vitest-environment node
//
// React Native emits. RN is a JS runtime with a global `window` but no DOM
// (`navigator.product === 'ReactNative'`), and through 8.1.1 it was gated silent
// alongside SSR. It is NOT SSR: it has `fetch`, so the event / identify / group /
// error streams all send — only the DOM-only planes (History pageviews, session
// replay) stay off. This proves emit against a minimal RN stub in a Node env,
// where the only globals are the ones a mobile runtime actually provides.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { canEmit, createTelemetry, hasDom } from '../src/telemetry'
import { isReactNative } from '../src/env'

interface Sent {
  url: string
  batch: Array<Record<string, unknown>>
}
let sent: Sent[]

beforeEach(() => {
  sent = []
  // A React Native runtime: a `window` with no `document`/`location`, a
  // `navigator` naming the platform, and `fetch` — nothing a browser has that
  // RN does not, and nothing it lacks. `vi.stubGlobal` is required because Node
  // 21+ defines `navigator` as a getter-only global that a bare assignment
  // cannot override.
  vi.stubGlobal('window', {})
  vi.stubGlobal('navigator', { product: 'ReactNative' })
  vi.stubGlobal('fetch', (url: string, init?: { body?: string }): Promise<unknown> => {
    const body = init?.body ? (JSON.parse(init.body) as { batch?: unknown[] }) : {}
    const batch = (body.batch ?? []) as Array<Record<string, unknown>>
    sent.push({ url: String(url), batch })
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ accepted: batch.length, dropped: 0 }),
    })
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('react native', () => {
  it('is a live host without a DOM', () => {
    expect(hasDom()).toBe(false)
    expect(isReactNative()).toBe(true)
    expect(canEmit()).toBe(true)
  })

  it('builds an ENABLED client — native is not SSR', () => {
    expect(createTelemetry().enabled).toBe(true)
  })

  it('names an unconfigured mobile app `mobile` from the runtime', () => {
    expect(createTelemetry().product).toBe('mobile')
  })

  it('emits through fetch: init never throws, and a pageview reaches the one front door', async () => {
    const t = createTelemetry()
    // The @hanzo/event fix (>=0.3.16): init() reads as non-browser on RN and
    // returns before touching window.location, rather than throwing.
    expect(() => t.client.init()).not.toThrow()

    t.track('screen_opened', { screen: 'Home' })
    t.pageview('Home')
    t.flush()
    await new Promise((r) => setTimeout(r, 10)) // let the transport drain

    expect(sent.length).toBeGreaterThan(0)
    expect(sent[0].url).toBe('https://api.hanzo.ai/v1/event')
    const types = sent.flatMap((s) => s.batch.map((e) => e.type))
    expect(types).toContain('pageview')
  })
})
