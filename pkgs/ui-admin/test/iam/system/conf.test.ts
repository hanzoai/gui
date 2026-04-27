import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getConf, initConfigFromCookie, setConfig } from '../../../src/iam/system/Conf'
import { getFriendlyFileSize, getProgressColor, readRuntimeConfigCookie } from '../../../src/iam/system/util'

describe('Conf.setConfig', () => {
  beforeEach(() => {
    setConfig({
      showGithubCorner: false,
      isDemoMode: false,
      forceLanguage: '',
      defaultLanguage: 'en',
      staticBaseUrl: '',
      aiAssistantUrl: '',
    })
  })

  it('mutates module state from a partial config', () => {
    setConfig({ defaultLanguage: 'de', isDemoMode: true })
    expect(getConf().DefaultLanguage).toBe('de')
    expect(getConf().IsDemoMode).toBe(true)
    expect(getConf().ShowGithubCorner).toBe(false)
  })

  it('ignores null / undefined inputs', () => {
    setConfig(null)
    setConfig(undefined)
    expect(getConf().DefaultLanguage).toBe('en')
  })
})

describe('initConfigFromCookie', () => {
  afterEach(() => {
    document.cookie = 'jsonWebConfig=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  })

  it('reads and applies a JSON cookie', () => {
    document.cookie = `jsonWebConfig=${encodeURIComponent(JSON.stringify({ defaultLanguage: 'fr' }))}`
    initConfigFromCookie()
    expect(getConf().DefaultLanguage).toBe('fr')
  })

  it('tolerates a missing or "null" cookie value', () => {
    document.cookie = 'jsonWebConfig=null'
    expect(() => initConfigFromCookie()).not.toThrow()
    expect(readRuntimeConfigCookie()).toBeNull()
  })
})

describe('util.getFriendlyFileSize', () => {
  it('formats zero', () => {
    expect(getFriendlyFileSize(0)).toBe('0 B')
  })
  it('rounds MB to one decimal', () => {
    expect(getFriendlyFileSize(2 * 1024 * 1024)).toBe('2.0 MB')
  })
  it('drops decimals at >= 100 of unit', () => {
    expect(getFriendlyFileSize(150 * 1024)).toBe('150 KB')
  })
})

describe('util.getProgressColor', () => {
  it('uses red >= 90%', () => {
    expect(getProgressColor(95)).toBe('#ef4444')
  })
  it('uses amber 70-89%', () => {
    expect(getProgressColor(75)).toBe('#f59e0b')
  })
  it('uses blue otherwise', () => {
    expect(getProgressColor(20)).toBe('#3b82f6')
  })
})
