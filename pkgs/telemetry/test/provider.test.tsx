// @vitest-environment happy-dom
//
// The adoption claim, tested: mounting `<TelemetryProvider>` with NO props is
// the entire setup. A pageview ships, a route change ships another, a render
// error is reported, and the ambient `track()` shares the provider's stream.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Component, act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { resetClients } from '@hanzo/event'
import { TelemetryProvider } from '../src/TelemetryProvider'
import { getTelemetry, setTelemetry, track } from '../src/telemetry'

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

beforeEach(() => {
  ;(
    globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true
  installStorage()
  vi.stubGlobal('navigator', {})
  setTelemetry(undefined)
  resetClients() // each `it` is its own page load
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

describe('<TelemetryProvider/> with no props', () => {
  it('renders children and records the initial pageview', () => {
    act(() => {
      root.render(
        <TelemetryProvider replay={false}>
          <p>hello</p>
        </TelemetryProvider>
      )
    })
    expect(container.textContent).toBe('hello')

    act(() => getTelemetry().flush())
    const pageviews = events().filter((e) => e.type === 'pageview')
    expect(pageviews).toHaveLength(1)
    expect(sent[0]!.url).toBe('https://api.hanzo.ai/v1/event')
  })

  it('counts a SPA route change with no app code', () => {
    act(() => {
      root.render(
        <TelemetryProvider replay={false}>
          <p>hi</p>
        </TelemetryProvider>
      )
    })
    act(() => {
      window.history.pushState({}, '', '/pricing')
    })
    act(() => getTelemetry().flush())

    const paths = events()
      .filter((e) => e.type === 'pageview')
      .map((e) => e.path)
    expect(paths).toContain('/pricing')
    expect(paths).toHaveLength(2) // initial + the navigation, never double-counted
  })

  it('shares ONE stream with module-scope track()', () => {
    act(() => {
      root.render(
        <TelemetryProvider product="site" replay={false}>
          <p>hi</p>
        </TelemetryProvider>
      )
    })
    track('plan_clicked', { plan: 'pro' })
    act(() => getTelemetry().flush())

    const evt = events().find((e) => e.event === 'plan_clicked')
    expect(evt).toBeDefined()
    expect(evt!.product).toBe('site') // the provider's client, not a second one
  })

  it('reports a React render error and shows the fallback', () => {
    const Boom = (): never => {
      throw new Error('render exploded')
    }
    vi.spyOn(console, 'error').mockImplementation(() => {})
    act(() => {
      root.render(
        <TelemetryProvider replay={false} fallback={<p>sorry</p>}>
          <Boom />
        </TelemetryProvider>
      )
    })
    expect(container.textContent).toBe('sorry')

    act(() => getTelemetry().flush())
    const err = events().find((e) => e.event === '$exception' || Boolean(e.error)) as
      | { error: Record<string, unknown>; properties: Record<string, unknown> }
      | undefined
    expect(err?.error).toMatchObject({ message: 'render exploded', handled: false })
    expect(err?.properties).toMatchObject({ react: true })
  })

  // The regression that mattered: with no `fallback` the provider must still
  // REPORT before it gets out of the way. Re-throwing from render() aborted the
  // commit, so componentDidCatch never ran and the error vanished — silently,
  // and only for apps that correctly let their own boundary own the UI.
  it('reports a render error even with NO fallback, then re-throws', () => {
    const Boom = (): never => {
      throw new Error('no fallback exploded')
    }
    vi.spyOn(console, 'error').mockImplementation(() => {})

    let escaped: unknown
    class Outer extends Component<{ children: ReactNode }, { failed: boolean }> {
      state = { failed: false }
      static getDerivedStateFromError() {
        return { failed: true }
      }
      componentDidCatch(e: Error) {
        escaped = e
      }
      render() {
        return this.state.failed ? 'outer caught' : this.props.children
      }
    }

    act(() => {
      root.render(
        <Outer>
          <TelemetryProvider replay={false}>
            <Boom />
          </TelemetryProvider>
        </Outer>
      )
    })

    // Observing must not change behavior: the app's own boundary still decides.
    expect(container.textContent).toBe('outer caught')
    expect((escaped as Error)?.message).toBe('no fallback exploded')

    act(() => getTelemetry().flush())
    const err = events().find((e) => e.event === '$exception' || Boolean(e.error)) as
      | { error: Record<string, unknown>; properties: Record<string, unknown> }
      | undefined
    expect(err?.error).toMatchObject({ message: 'no fallback exploded', handled: false })
    expect(err?.properties).toMatchObject({ react: true })
  })

  it('collects nothing when the browser asks not to be tracked', () => {
    vi.stubGlobal('navigator', { globalPrivacyControl: true })
    act(() => {
      root.render(
        <TelemetryProvider replay={false}>
          <p>hi</p>
        </TelemetryProvider>
      )
    })
    act(() => getTelemetry().flush())
    expect(sent).toHaveLength(0)
  })
})
