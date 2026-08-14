process.env.GUI_TARGET = 'web'

import { afterEach, describe, expect, test } from 'vitest'

import config from '../config-default'
import { createGui, getConfig, updateConfig } from '../web/src'

const pollutionKey = '__hanzoguiPolluted'

describe('updateConfig', () => {
  afterEach(() => {
    delete Object.prototype[pollutionKey]
  })

  test('ignores inherited config keys', () => {
    createGui(config.getDefaultGuiConfig())

    updateConfig('__proto__', { [pollutionKey]: true })

    expect(Object.prototype).not.toHaveProperty(pollutionKey)
    expect({}).not.toHaveProperty(pollutionKey)
  })

  test('updates own config keys', () => {
    createGui(config.getDefaultGuiConfig())

    const conf = getConfig()
    const originalTheme = conf.themes.light

    updateConfig('themes', { __updateConfigTest: originalTheme })

    expect(getConfig().themes.__updateConfigTest).toBe(originalTheme)
    delete getConfig().themes.__updateConfigTest
  })
})
