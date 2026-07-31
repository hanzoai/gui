// @vitest-environment node
//
// SSR safety, proven where it matters: a Node environment with no window, no
// document and no localStorage. The provider must render its children, collect
// nothing, and never throw — importing telemetry into a server component has to
// be a non-event.

import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { TelemetryProvider } from './TelemetryProvider.js'
import { createTelemetry, hasDom, track } from './telemetry.js'

describe('server rendering', () => {
  it('has no DOM to speak of', () => {
    expect(typeof window).toBe('undefined')
    expect(hasDom()).toBe(false)
  })

  it('renders children and collects nothing', () => {
    const html = renderToString(
      <TelemetryProvider>
        <p>hello</p>
      </TelemetryProvider>,
    )
    expect(html).toContain('hello')
  })

  it('is inert: a client built on the server is disabled', () => {
    expect(createTelemetry().enabled).toBe(false)
  })

  it('does not throw when the ambient API is called on the server', () => {
    expect(() => track('server_side_call', { a: 1 })).not.toThrow()
  })
})
