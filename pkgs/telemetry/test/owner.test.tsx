// @vitest-environment happy-dom
//
// The no-double-fire guarantee, tested from the outside: count what reaches the
// wire. `GuiProvider` mounts `<TelemetryProvider owner="gui">` for EVERY gui app,
// and several apps already mount their own analytics provider — so the one thing
// that must never happen is two clients emitting into `/v1/event`.
//
// The fleet holds both nestings (verified across the apps that mount both), so
// both are tested here:
//
//   gui OUTSIDE, app INSIDE   — hanzo.app, console
//   app OUTSIDE, gui INSIDE   — store, identity
//
// plus the two shapes that have to keep working: a bare gui app collects with no
// wiring at all, and two nested GuiProviders are still one stream.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { createAnalytics } from '@hanzo/event'
import { AnalyticsProvider } from '@hanzo/event/react'
import { TelemetryProvider } from '../src/TelemetryProvider'
import { getTelemetry, setTelemetry } from '../src/telemetry'

interface Sent {
  url: string
  batch: Array<Record<string, unknown>>
}

let sent: Sent[]
let container: HTMLDivElement
let root: Root

function installStorage(): void {
  const map = new Map<string, string>()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      get length() {
        return map.size
      },
      clear: () => map.clear(),
      getItem: (k: string) => map.get(k) ?? null,
      key: (i: number) => Array.from(map.keys())[i] ?? null,
      removeItem: (k: string) => void map.delete(k),
      setItem: (k: string, v: string) => void map.set(k, String(v)),
    } satisfies Storage,
  })
}

const events = (): Array<Record<string, unknown>> => sent.flatMap((s) => s.batch)
const pageviews = (): Array<Record<string, unknown>> =>
  events().filter((e) => e.type === 'pageview')

beforeEach(() => {
  ;(
    globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true
  installStorage()
  vi.stubGlobal('navigator', {})
  setTelemetry(undefined)
  sent = []
  vi.stubGlobal('fetch', (url: string, init?: { body?: string }) => {
    const body = JSON.parse(init?.body ?? '{"batch":[]}') as {
      batch: Array<Record<string, unknown>>
    }
    sent.push({ url, batch: body.batch })
    return Promise.resolve({ ok: true } as Response)
  })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

/** An app's own @hanzo/event client. `batchSize: 1` makes it flush on every
 *  event, so the wire is readable synchronously instead of on its 5s timer. */
const appAnalytics = (product: string) =>
  createAnalytics({ product, batchSize: 1, enabled: true })

/** Drain the ambient client (app clients above flush themselves). */
function flushAll(): void {
  act(() => getTelemetry().flush())
}

describe('owner="gui" — what GuiProvider mounts', () => {
  it('collects for a BARE gui app, with no app-side wiring at all', () => {
    act(() => {
      root.render(
        <TelemetryProvider owner="gui" product="desktop" replay={false}>
          <p>bare</p>
        </TelemetryProvider>
      )
    })
    flushAll()

    expect(container.textContent).toBe('bare')
    expect(pageviews()).toHaveLength(1)
    expect(sent[0]!.url).toBe('https://api.hanzo.ai/v1/event')
    expect(pageviews()[0]!.product).toBe('desktop')
  })

  it('yields to an app provider BELOW it — one stream, not two', () => {
    act(() => {
      root.render(
        <TelemetryProvider owner="gui" product="gui-should-not-emit" replay={false}>
          <TelemetryProvider product="app" replay={false}>
            <p>app owns it</p>
          </TelemetryProvider>
        </TelemetryProvider>
      )
    })
    flushAll()

    expect(pageviews()).toHaveLength(1)
    expect(pageviews()[0]!.product).toBe('app')
    expect(events().some((e) => e.product === 'gui-should-not-emit')).toBe(false)
  })

  it('yields to an app provider ABOVE it — one stream, not two', () => {
    act(() => {
      root.render(
        <AnalyticsProvider client={appAnalytics('store')}>
          <TelemetryProvider owner="gui" product="gui-should-not-emit" replay={false}>
            <p>store owns it</p>
          </TelemetryProvider>
        </AnalyticsProvider>
      )
    })
    flushAll()

    expect(pageviews()).toHaveLength(1)
    expect(pageviews()[0]!.product).toBe('store')
    expect(events().some((e) => e.product === 'gui-should-not-emit')).toBe(false)
  })

  // The ONE shape gui cannot detect, pinned so it can never surprise anyone: a
  // raw <AnalyticsProvider> BELOW gui. Context does not look down, and unlike
  // <TelemetryProvider> a raw one claims nothing, so gui has no way to know it
  // is there. hanzo.ai, chat and hanzo.industries ship exactly this, which is
  // why each carries an explicit `telemetry={false}` on its GuiProvider until it
  // drops its own wiring — the opt-out tested below.
  it('cannot see a raw <AnalyticsProvider> BELOW it — hence the opt-out', () => {
    act(() => {
      root.render(
        <TelemetryProvider owner="gui" product="gui" replay={false}>
          <AnalyticsProvider client={appAnalytics('site')}>
            <p>site</p>
          </AnalyticsProvider>
        </TelemetryProvider>
      )
    })
    flushAll()
    expect(
      pageviews()
        .map((e) => e.product)
        .sort()
    ).toEqual(['gui', 'site'])
  })

  it('emits nothing when the app opts out — what telemetry={false} compiles to', () => {
    act(() => {
      root.render(
        <AnalyticsProvider client={appAnalytics('site')}>
          <p>site only</p>
        </AnalyticsProvider>
      )
    })
    flushAll()
    expect(pageviews().map((e) => e.product)).toEqual(['site'])
  })

  it('nested GuiProviders are still ONE stream', () => {
    act(() => {
      root.render(
        <TelemetryProvider owner="gui" product="desktop" replay={false}>
          <TelemetryProvider owner="gui" product="desktop" replay={false}>
            <p>nested</p>
          </TelemetryProvider>
        </TelemetryProvider>
      )
    })
    flushAll()

    expect(pageviews()).toHaveLength(1)
  })

  it('hands the stream back when the app provider unmounts', () => {
    const Tree = ({ withApp }: { withApp: boolean }): React.ReactNode => (
      <TelemetryProvider owner="gui" product="gui" replay={false}>
        {withApp ? (
          <TelemetryProvider product="app" replay={false}>
            <p>x</p>
          </TelemetryProvider>
        ) : (
          <p>x</p>
        )}
      </TelemetryProvider>
    )

    act(() => root.render(<Tree withApp />))
    flushAll()
    expect(pageviews().map((e) => e.product)).toEqual(['app'])

    act(() => root.render(<Tree withApp={false} />))
    flushAll()
    // gui resumes ownership rather than leaving the app dark.
    expect(pageviews().map((e) => e.product)).toEqual(['app', 'gui'])
  })

  it('still honors Do-Not-Track', () => {
    vi.stubGlobal('navigator', { globalPrivacyControl: true })
    act(() => {
      root.render(
        <TelemetryProvider owner="gui" replay={false}>
          <p>hi</p>
        </TelemetryProvider>
      )
    })
    flushAll()
    expect(sent).toHaveLength(0)
  })
})
