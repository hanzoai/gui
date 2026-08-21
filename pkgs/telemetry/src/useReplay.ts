// Session capture, off the critical path.
//
// The capture engine (@hanzo/observe) annotates every click/input/submit with a
// semantic hierarchy derived from the DOM, so a replay is readable ("nav /
// Dashboard / UserCard / button[save]") instead of a pixel movie — and it ships
// no CDN script, so a strict `default-src 'none'` CSP cannot break it.
//
// It is imported with a dynamic `import()` inside an idle callback: the engine
// lands in its own chunk, fetched after the page is interactive, so it can never
// cost a millisecond of LCP. If the chunk fails to load, capture silently does
// not happen and the app is untouched.

import { useEffect } from 'react'
import type { RedactionPolicy, Telemetry } from './types.js'

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

/** useReplay starts interaction capture once the browser is idle. */
export function useReplay(
  telemetry: Telemetry,
  active: boolean,
  redaction?: RedactionPolicy
): void {
  useEffect(() => {
    if (!active || typeof window === 'undefined' || typeof document === 'undefined')
      return

    let cancelled = false
    let stop: (() => void) | undefined

    const start = (): void => {
      if (cancelled) return
      import('@hanzo/observe')
        .then(({ observe, wireProps }) => {
          if (cancelled) return
          const engine = observe(
            (interaction) => {
              // Navigation is owned by useRouteTracking — one source, one count.
              if (interaction.kind === 'nav') return
              telemetry.track(interaction.name, wireProps(interaction))
            },
            { nav: false, redaction }
          )
          stop = () => engine.stop()
        })
        .catch(() => {
          /* capture is a bonus, never a requirement */
        })
    }

    const w = window as IdleWindow
    const idle = typeof w.requestIdleCallback === 'function'
    const handle = idle
      ? w.requestIdleCallback!(start, { timeout: 3000 })
      : window.setTimeout(start, 1200)

    return () => {
      cancelled = true
      try {
        if (idle) w.cancelIdleCallback?.(handle)
        else window.clearTimeout(handle)
      } catch {
        /* nothing to cancel */
      }
      stop?.()
    }
    // `redaction` is read once at start; change it by remounting the provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telemetry, active])
}
