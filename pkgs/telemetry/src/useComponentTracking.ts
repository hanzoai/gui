// What the user clicked, named by the component that drew it.
//
// Product analytics normally identifies a click by a CSS selector or a hand-
// written `data-testid`. Both rot: the selector breaks the first time someone
// reorders a wrapper, and the testid only exists where a human remembered to
// add one. Neither can tell you which COMPONENT was clicked, which is the
// question anyone actually asks of the data.
//
// The gui compiler already answers it. Its AST pass walks every component to
// flatten it, and while it is there it writes three attributes (dev only, via
// `shouldAddDebugProp`):
//
//   data-is  the gui component that rendered this element   — "Button"
//   data-in  the component it was used inside               — "PricingCard"
//   data-at  where that call site lives                     — "pricing.tsx:42"
//
// This hook reads them back. Nothing to annotate by hand, nothing to keep in
// sync, and the names survive refactors because they ARE the source.
//
// It reads and never writes: no attribute here, no markup change, no behavior.
// If the compiler did not run, every field is undefined and the event still
// carries its path — strictly additive, never a broken event.

import { useEffect } from 'react'
import { hasDom } from './telemetry.ts'
import type { Telemetry } from './types.ts'

/** The compiler's three attributes, read off the nearest annotated ancestor.
 *
 *  Nearest, not the target itself: a click lands on whatever leaf sits under
 *  the pointer — an icon `<svg>`, a text `<span>` — and leaves carry no
 *  annotation. `closest()` walks up to the component that owns the click, which
 *  is the thing worth naming. */
const annotation = (el: Element | null) => {
  const node = el?.closest?.('[data-at]')
  if (!node) return null
  return {
    component: node.getAttribute('data-is') ?? undefined,
    usedIn: node.getAttribute('data-in') ?? undefined,
    at: node.getAttribute('data-at') ?? undefined,
  }
}

/** A human label for the click, in the order a person would look for one:
 *  what it says, then what it is called, then nothing. Text is trimmed and
 *  capped — a click on a paragraph should not post the paragraph. */
const label = (el: Element | null) => {
  if (!el) return undefined
  const node = el.closest?.('button, a, [role="button"], [role="link"]') ?? el
  const text = (node.getAttribute?.('aria-label') || node.textContent || '').trim()
  return text ? text.slice(0, 80) : undefined
}

/** Report component-attributed clicks.
 *
 *  Capture phase, so a handler that calls `stopPropagation` — every menu, every
 *  dialog — cannot silently delete the event. Passive, so listening can never
 *  cost a frame of scroll or delay the app's own handler. */
export function useComponentTracking(telemetry: Telemetry | null, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !telemetry || !hasDom()) return

    const onClick = (e: Event) => {
      const target = e.target as Element | null
      const a = annotation(target)
      // No annotation and no label is a click on bare page furniture. Reporting
      // it would spend an event to say "something on this page was clicked".
      const text = label(target)
      if (!a && !text) return
      telemetry.track('component_clicked', {
        component: a?.component,
        used_in: a?.usedIn,
        at: a?.at,
        label: text,
        path: window.location.pathname,
      })
    }

    window.addEventListener('click', onClick, { capture: true, passive: true })
    return () => window.removeEventListener('click', onClick, { capture: true })
  }, [telemetry, enabled])
}
