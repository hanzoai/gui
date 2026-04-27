import { describe, expect, it } from 'vitest'
import * as Auth from '../../src/auth'

describe('auth barrel', () => {
  it('exports the user-facing flows', () => {
    expect(typeof Auth.Login).toBe('function')
    expect(typeof Auth.Signup).toBe('function')
    expect(typeof Auth.ForgotPassword).toBe('function')
    expect(typeof Auth.MfaSetup).toBe('function')
    expect(typeof Auth.MfaVerify).toBe('function')
    expect(typeof Auth.RecoveryCodes).toBe('function')
    expect(typeof Auth.QrCode).toBe('function')
    expect(typeof Auth.Captcha).toBe('function')
  })

  it('exports the auth utilities', () => {
    expect(typeof Auth.isEmail).toBe('function')
    expect(typeof Auth.isPhoneShape).toBe('function')
    expect(typeof Auth.inIframe).toBe('function')
    expect(typeof Auth.readCsrfToken).toBe('function')
    expect(typeof Auth.scorePassword).toBe('function')
  })
})
