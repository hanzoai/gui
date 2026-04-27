import { describe, expect, it } from 'vitest'
import {
  FormUrls,
  RecordUrls,
  ResourceUrls,
  RuleUrls,
  ServerUrls,
  SiteUrls,
  TicketUrls,
} from '../../../src/iam/resources/api'

// URL builders are pure data. We assert the wire shape so the
// /v1/iam/<resource> contract stays stable as we move through edits.

describe('IAM resources URL builders', () => {
  it('builds /v1/iam/resources list URLs with the wire param names', () => {
    const u = ResourceUrls.list({
      owner: 'lux',
      p: 2,
      pageSize: 10,
      field: 'name',
      value: 'avatar',
    })
    expect(u).toContain('/v1/iam/resources')
    expect(u).toContain('owner=lux')
    expect(u).toContain('p=2')
    expect(u).toContain('pageSize=10')
    expect(u).toContain('field=name')
    expect(u).toContain('value=avatar')
  })

  it('drops empty params from the query string', () => {
    const u = FormUrls.list({ owner: 'lux' })
    expect(u).toBe('/v1/iam/forms?owner=lux')
  })

  it('URL-encodes owner+name segments on item paths', () => {
    expect(SiteUrls.one('lux', 'site/with/slashes')).toBe(
      '/v1/iam/sites/lux/site%2Fwith%2Fslashes',
    )
    expect(ServerUrls.remove('admin', 'name with spaces')).toBe(
      '/v1/iam/servers/admin/name%20with%20spaces',
    )
  })

  it('uses the global list endpoint when scoped to all orgs', () => {
    expect(SiteUrls.globalList()).toBe('/v1/iam/sites/global')
  })

  it('routes ticket message append to the nested resource', () => {
    expect(TicketUrls.appendMessage('lux', 't1')).toBe(
      '/v1/iam/tickets/lux/t1/messages',
    )
  })

  it('keeps records and rules under the same /v1/iam prefix', () => {
    expect(RecordUrls.list({ owner: 'lux' })).toBe(
      '/v1/iam/records?owner=lux',
    )
    expect(RuleUrls.list({ owner: 'lux' })).toBe(
      '/v1/iam/rules?owner=lux',
    )
  })

  it('omits the question mark when no params are set', () => {
    expect(FormUrls.list({})).toBe('/v1/iam/forms')
  })
})
