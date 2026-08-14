import { describe, expect, it } from 'vitest'
import { getExpiredSupabaseCookieHeaders, getSupabaseCookieNames } from '../cookies'

describe('security cookie helpers', () => {
  it('extracts only validated Supabase cookie names', () => {
    expect(
      getSupabaseCookieNames(
        'sb-auth-token=abc; theme=dark; sb-project-ref-auth-token.0=def; sb bad=value'
      )
    ).toEqual(['sb-auth-token', 'sb-project-ref-auth-token.0'])
  })

  it('creates expired Set-Cookie headers for current host and hanzogui.dev domain', () => {
    const headers = getExpiredSupabaseCookieHeaders(
      'sb-auth-token=abc; theme=dark',
      'www.hanzogui.dev'
    )

    expect(headers).toEqual([
      'sb-auth-token=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax',
      'sb-auth-token=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Domain=.hanzogui.dev; SameSite=Lax',
    ])
  })

  it('does not emit headers when there are no Supabase cookies', () => {
    expect(getExpiredSupabaseCookieHeaders('theme=dark', 'hanzogui.dev')).toEqual([])
  })
})
