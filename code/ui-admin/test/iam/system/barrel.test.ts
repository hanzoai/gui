import { describe, expect, it } from 'vitest'
import * as System from '../../../src/iam/system'

describe('iam/system barrel', () => {
  it('exports admin pages', () => {
    expect(typeof System.SystemInfo).toBe('function')
    expect(typeof System.Setting).toBe('function')
    expect(typeof System.LoginShowcase).toBe('function')
    expect(typeof System.EntryPage).toBe('function')
    expect(typeof System.ManagementPage).toBe('function')
  })

  it('exports runtime config helpers', () => {
    expect(typeof System.getConf).toBe('function')
    expect(typeof System.setConfig).toBe('function')
    expect(typeof System.initConfigFromCookie).toBe('function')
    expect(typeof System.DefaultApplication).toBe('string')
    expect(System.ThemeDefault.themeType).toBe('dark')
  })

  it('exposes the Conf namespace import', () => {
    expect(typeof System.Conf.setConfig).toBe('function')
  })
})
