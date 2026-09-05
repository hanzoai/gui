// @vitest-environment happy-dom
//
// Where the publishable key comes from when nobody supplies one.
//
// PUBLISHABLE_KEY is a BUILD-time variable. A static export is built once and
// served on every brand, so a build-time key is either absent or wrong — and
// absent is what the fleet actually had: hanzo.ai's is commented out in
// .env.example and both Zoo sites shipped with none, so every one of them
// mounted a client that collected and sent nothing.
//
// A brand's domain already names its org, and an org has exactly one
// publishable key, so the key is derivable from `location.hostname` and
// @hanzo/event derives it (`keyForPage`). These tests hold that wiring in
// place, and hold the line that an unrecognised host reports NOWHERE rather
// than into whichever project happens to be first in the table.

import { afterEach, describe, expect, it } from 'vitest'
import { createTelemetry, describeTelemetry } from '../src/telemetry'

/** happy-dom's location is read-only; this is how a test names its host. */
function servedFrom(host: string) {
  window.happyDOM?.setURL?.(`https://${host}/`)
}

const keyOf = (host: string, config = {}) => {
  servedFrom(host)
  const t = createTelemetry(config)
  return describeTelemetry(t)?.hasIngestKey
}

afterEach(() => servedFrom('localhost'))

describe('a page with no key configured', () => {
  it('finds its own org key from the domain it is served from', () => {
    expect(keyOf('zoo.ngo')).toBe(true)
    expect(keyOf('zoolabs.io')).toBe(true)
    expect(keyOf('hanzo.ai')).toBe(true)
    expect(keyOf('lux.network')).toBe(true)
  })

  it('reads a subdomain as its brand, so an alias needs no entry of its own', () => {
    expect(keyOf('www.zoo.ngo')).toBe(true)
    expect(keyOf('explore.lux.network')).toBe(true)
  })

  it('reports NOWHERE from a host no brand claims', () => {
    // The alternative — falling back to some default org — is the defect this
    // whole derivation exists to prevent: it is silent, it reads as working,
    // and it only surfaces later in someone else's warehouse.
    expect(keyOf('localhost')).toBe(false)
    expect(keyOf('example.com')).toBe(false)
    expect(keyOf('zoo.ngo.evil.test')).toBe(false)
  })

  it('yields to a key the app states', () => {
    servedFrom('example.com')
    expect(describeTelemetry(createTelemetry({ ingestKey: 'pk-stated' }))?.hasIngestKey).toBe(true)
  })
})
