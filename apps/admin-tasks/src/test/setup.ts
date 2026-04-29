// Test setup — runs before every test file. Wires up:
//   - @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
//   - RTL automatic cleanup between tests
//   - The fetch handler registry from ./msw, started/stopped/reset
//     around every test.
//
// We do NOT use the real msw package here. The handler-table fetch
// stub in ./msw is sufficient for the URL/method routing the tasks
// SPA exercises and avoids the service-worker / interceptors-startup
// cost during unit tests. msw is listed as a devDep so future
// integration tests (e.g. inside the kitchen-sink shell) can opt in
// without changing app dependencies.

import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './msw'

// jsdom does not implement matchMedia. Several @hanzogui packages call
// it at module-evaluation time (Select → useMedia), so any test file
// that touches @hanzogui/admin re-export needs a no-op stub up front.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
// ResizeObserver is also missing under jsdom — Tamagui layout helpers poke it.
if (typeof globalThis.ResizeObserver === 'undefined') {
  ;(globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

beforeAll(() => server.listen())
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
