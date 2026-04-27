import { describe, expect, it } from 'vitest'
import {
  LdapEdit,
  LdapSync,
  SyncerList,
  SyncerEdit,
  WebhookList,
  WebhookEdit,
  InvitationList,
  InvitationEdit,
  VerificationList,
  SelectInline,
  isLikelyEmail,
} from '../../../src/iam/federation'

describe('federation barrel', () => {
  it('exports every page as a function component', () => {
    const components = [
      LdapEdit,
      LdapSync,
      SyncerList,
      SyncerEdit,
      WebhookList,
      WebhookEdit,
      InvitationList,
      InvitationEdit,
      VerificationList,
      SelectInline,
    ]
    for (const c of components) {
      expect(typeof c).toBe('function')
    }
  })

  it('names the components after their files (helps DevTools traces)', () => {
    expect(LdapEdit.name).toBe('LdapEdit')
    expect(LdapSync.name).toBe('LdapSync')
    expect(SyncerList.name).toBe('SyncerList')
    expect(SyncerEdit.name).toBe('SyncerEdit')
    expect(WebhookList.name).toBe('WebhookList')
    expect(WebhookEdit.name).toBe('WebhookEdit')
    expect(InvitationList.name).toBe('InvitationList')
    expect(InvitationEdit.name).toBe('InvitationEdit')
    expect(VerificationList.name).toBe('VerificationList')
  })
})

describe('isLikelyEmail', () => {
  it('accepts well-formed addresses', () => {
    expect(isLikelyEmail('z@hanzo.ai')).toBe(true)
    expect(isLikelyEmail('first.last+tag@sub.example.co')).toBe(true)
  })

  it('rejects malformed addresses', () => {
    expect(isLikelyEmail('not-an-email')).toBe(false)
    expect(isLikelyEmail('a@b')).toBe(false)
    expect(isLikelyEmail('')).toBe(false)
    expect(isLikelyEmail('  spaces in@middle.com')).toBe(false)
  })
})
