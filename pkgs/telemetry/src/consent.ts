// Consent, in one place.
//
// Two independent signals, one answer:
//
//   1. The browser's standing preference — Do-Not-Track / Global Privacy
//      Control. Honored by default, with no code in the app.
//   2. The person's explicit in-app choice, persisted. A choice they made
//      themselves outranks the browser default in BOTH directions — that is
//      what "explicit" means.
//
// An app that wants no persistence at all just passes `consent="granted"` or
// `consent="denied"` and never calls `setConsent`.

import type { StoredConsent, TelemetryConsent } from './types.ts'

const KEY = 'hz_consent'

const hasWindow = (): boolean => typeof window !== 'undefined'

function store(): Storage | undefined {
  try {
    if (!hasWindow() || !window.localStorage) return undefined
    return window.localStorage
  } catch {
    return undefined // Safari private mode / blocked storage
  }
}

/** True when the browser is asking not to be tracked — DNT in any of its three
 *  historical spellings, or the Global Privacy Control signal. */
export function doNotTrack(): boolean {
  if (!hasWindow()) return false
  try {
    const n = navigator as Navigator & {
      msDoNotTrack?: string
      globalPrivacyControl?: boolean
    }
    const w = window as Window & { doNotTrack?: string }
    if (n.globalPrivacyControl === true) return true
    return n.doNotTrack === '1' || w.doNotTrack === '1' || n.msDoNotTrack === '1'
  } catch {
    return false
  }
}

/** The person's persisted choice, or undefined if they never made one. */
export function getConsent(): StoredConsent | undefined {
  const s = store()
  if (!s) return undefined
  try {
    const v = s.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : undefined
  } catch {
    return undefined
  }
}

type Listener = (consent: StoredConsent | undefined) => void
const listeners = new Set<Listener>()

/** Record the person's choice. `'unset'` forgets it, so the `auto` policy
 *  (DNT/GPC) applies again. Live providers re-evaluate immediately. */
export function setConsent(consent: StoredConsent | 'unset'): void {
  const s = store()
  try {
    if (consent === 'unset') s?.removeItem(KEY)
    else s?.setItem(KEY, consent)
  } catch {
    /* storage blocked — the in-memory notification below still applies */
  }
  const next = consent === 'unset' ? undefined : consent
  for (const fn of listeners) {
    try {
      fn(next)
    } catch {
      /* a listener must never break the caller */
    }
  }
}

/** Subscribe to consent changes; returns the unsubscribe. */
export function onConsentChange(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** The single policy decision. `enabled` is a hard build-time override and wins
 *  over everything; otherwise an explicit stored choice wins; otherwise the
 *  declared posture; otherwise DNT/GPC. */
export function resolveEnabled(opts: {
  enabled?: boolean
  consent?: TelemetryConsent
  stored?: StoredConsent | undefined
}): boolean {
  if (typeof opts.enabled === 'boolean') return opts.enabled
  const stored = opts.stored !== undefined ? opts.stored : getConsent()
  if (stored === 'denied') return false
  if (stored === 'granted') return true
  const mode: TelemetryConsent = opts.consent ?? 'auto'
  if (mode === 'denied') return false
  if (mode === 'granted') return true
  return !doNotTrack()
}
