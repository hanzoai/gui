// @vitest-environment happy-dom
//
// Naming the surface, and finding the key, with no app-side code.
//
// A gui app gets telemetry for free only if the two things it never configures
// resolve on their own: WHAT it is (`product`, which distinguishes desktop from
// site from console in the warehouse) and WHICH ORG it belongs to (the
// publishable ingest key, which the door HMAC-verifies to a tenant).

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { productFromHost, runtimeProduct } from '../src/env'
import { createTelemetry, describeTelemetry } from '../src/telemetry'

const TAURI = '__TAURI_INTERNALS__'

afterEach(() => {
  delete (globalThis as Record<string, unknown>)[TAURI]
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('product', () => {
  it('names a Tauri window `desktop` from the runtime, not the URL', () => {
    // The three origins a desktop shell is served from — none of which a
    // hostname rule reads as "desktop".
    for (const host of ['localhost', 'tauri.localhost', '127.0.0.1']) {
      expect(productFromHost(host)).not.toBe('desktop')
    }
    expect(runtimeProduct()).toBeUndefined()
    ;(globalThis as Record<string, unknown>)[TAURI] = { invoke: () => {} }
    expect(runtimeProduct()).toBe('desktop')
  })

  it('gives a desktop client the `desktop` product with no config', () => {
    ;(globalThis as Record<string, unknown>)[TAURI] = { invoke: () => {} }
    expect(createTelemetry().product).toBe('desktop')
  })

  it('still lets a surface name itself', () => {
    ;(globalThis as Record<string, unknown>)[TAURI] = { invoke: () => {} }
    expect(createTelemetry({ product: 'studio' }).product).toBe('studio')
  })

  it('falls back to the hostname for a browser', () => {
    expect(runtimeProduct()).toBeUndefined()
    expect(productFromHost('console.hanzo.ai')).toBe('console')
    expect(productFromHost('hanzo.ai')).toBe('site')
  })
})

describe('ingest key', () => {
  // PUBLISHABLE_KEY is the ONE name: KMS holds `deploy/PUBLISHABLE_KEY`, the
  // Dockerfiles pass it through, and @hanzo/event reads the same spelling. A
  // surface that resolved no key sent unattributed beacons, which the door
  // refuses — silently, and invisibly until you read the warehouse.
  it('reads the canonical build-time name', () => {
    vi.stubEnv('NEXT_PUBLIC_PUBLISHABLE_KEY', 'pk_canonical')
    expect(describeTelemetry(createTelemetry())?.hasIngestKey).toBe(true)
  })

  it('still reads the older HANZO_INGEST_KEY spelling that three surfaces set', () => {
    vi.stubEnv('NEXT_PUBLIC_HANZO_INGEST_KEY', 'pk_legacy')
    expect(describeTelemetry(createTelemetry())?.hasIngestKey).toBe(true)
  })

  it('resolves no key rather than inventing one', () => {
    expect(describeTelemetry(createTelemetry())?.hasIngestKey).toBe(false)
  })

  it('takes an explicit key over the environment', () => {
    vi.stubEnv('NEXT_PUBLIC_PUBLISHABLE_KEY', 'pk_env')
    const t = createTelemetry({ ingestKey: 'pk_explicit' })
    expect(describeTelemetry(t)?.hasIngestKey).toBe(true)
  })
})
