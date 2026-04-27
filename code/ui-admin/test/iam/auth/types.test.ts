import { describe, expect, it } from 'vitest'
import type {
  IamApplication,
  IamCert,
  IamKey,
  IamProvider,
  IamSession,
  IamToken,
} from '../../../src/iam/auth/types'

// Type-only smoke. We assert the wire shape compiles for a sample of
// each Casdoor record. If the upstream object renames a field
// (Casdoor sometimes does on minor versions), the build flags here.

describe('auth bucket types', () => {
  it('IamApplication compiles with OAuth fields', () => {
    const app: IamApplication = {
      owner: 'admin',
      name: 'app-hanzo',
      organization: 'admin',
      createdTime: '2026-04-27T00:00:00Z',
      displayName: 'Hanzo',
      category: 'Default',
      type: 'All',
      clientId: 'abc',
      clientSecret: 'shh',
      redirectUris: ['https://example.com/cb'],
      grantTypes: ['authorization_code'],
      scopes: ['openid'],
      tokenFormat: 'JWT',
      enablePassword: true,
      enableSignUp: false,
      cert: 'cert-hanzo',
    }
    expect(app.name).toBe('app-hanzo')
  })

  it('IamProvider compiles for OIDC', () => {
    const p: IamProvider = {
      owner: 'admin',
      name: 'oidc-hanzo',
      createdTime: '2026-04-27T00:00:00Z',
      displayName: 'Hanzo OIDC',
      category: 'OIDC',
      type: 'Custom',
      clientId: 'abc',
      clientSecret: 'shh',
      providerUrl: 'https://hanzo.id/.well-known/openid-configuration',
      scopes: 'openid profile email',
    }
    expect(p.category).toBe('OIDC')
  })

  it('IamSession compiles', () => {
    const s: IamSession = {
      owner: 'admin',
      name: 'frodo',
      createdTime: '2026-04-27T00:00:00Z',
      application: 'app-hanzo',
      sessionId: ['sid_aaa', 'sid_bbb'],
    }
    expect(s.sessionId.length).toBe(2)
  })

  it('IamToken accepts opaque + JWT', () => {
    const t: IamToken = {
      owner: 'admin',
      name: 'tok_1',
      createdTime: '2026-04-27T00:00:00Z',
      application: 'app-hanzo',
      organization: 'admin',
      user: 'admin',
      accessToken: 'eyJhbGciOi…',
      expiresIn: 7200,
      scope: 'read',
      tokenType: 'Bearer',
    }
    expect(t.tokenType).toBe('Bearer')
  })

  it('IamCert exposes public PEM but tracks private key off-screen', () => {
    const c: IamCert = {
      owner: 'admin',
      name: 'cert-hanzo',
      createdTime: '2026-04-27T00:00:00Z',
      displayName: 'Hanzo JWT',
      scope: 'JWT',
      type: 'x509',
      cryptoAlgorithm: 'RS256',
      bitSize: 4096,
      expireInYears: 20,
      certificate: '-----BEGIN CERTIFICATE-----\n…',
      privateKey: '-----BEGIN PRIVATE KEY-----\n…',
    }
    // The type allows privateKey for round-trip; the UI never renders it.
    expect(c.privateKey).toMatch(/PRIVATE KEY/)
  })

  it('IamKey state narrows to Active / Inactive', () => {
    const k: IamKey = {
      owner: 'admin',
      name: 'key_1',
      createdTime: '2026-04-27T00:00:00Z',
      displayName: 'Bootstrap key',
      type: 'Organization',
      accessKey: 'hk-deadbeef',
      state: 'Active',
    }
    expect(k.state).toBe('Active')
  })
})
