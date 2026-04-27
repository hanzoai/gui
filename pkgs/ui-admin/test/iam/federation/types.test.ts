import { describe, it, expectTypeOf } from 'vitest'
import type {
  Ldap,
  LdapSyncEvent,
  Syncer,
  SyncerType,
  Webhook,
  Invitation,
  Verification,
} from '../../../src/iam/federation'

// Smoke type-check: ensure the bucket's domain shapes stay narrow
// and that the discriminated union for SSE events keeps its tags.
// If anyone widens an enum or drops a discriminant the build fails
// here instead of in a downstream consumer.

describe('federation domain types', () => {
  it('LdapSyncEvent is discriminated on `kind`', () => {
    expectTypeOf<LdapSyncEvent>().toMatchTypeOf<{ kind: string }>()
    type Kinds = LdapSyncEvent['kind']
    expectTypeOf<Kinds>().toEqualTypeOf<
      'ldap.sync.started' | 'ldap.sync.progress' | 'ldap.sync.completed'
    >()
  })

  it('Webhook keeps method and contentType narrow', () => {
    expectTypeOf<Webhook['method']>().toEqualTypeOf<'POST' | 'GET' | 'PUT' | 'DELETE'>()
    expectTypeOf<Webhook['contentType']>().toEqualTypeOf<
      'application/json' | 'application/x-www-form-urlencoded'
    >()
  })

  it('Invitation.state is binary Active|Suspended', () => {
    expectTypeOf<Invitation['state']>().toEqualTypeOf<'Active' | 'Suspended'>()
  })

  it('SyncerType covers every supported provider', () => {
    expectTypeOf<SyncerType>().toEqualTypeOf<Syncer['type']>()
  })

  it('Ldap exposes a numeric port field', () => {
    expectTypeOf<Ldap['port']>().toBeNumber()
  })

  it('Verification.isUsed gates the audit row', () => {
    expectTypeOf<Verification['isUsed']>().toBeBoolean()
  })
})
