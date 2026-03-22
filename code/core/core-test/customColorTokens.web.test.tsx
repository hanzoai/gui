import { describe, expect, test, beforeEach } from 'vitest'
import { createGui } from '@hanzo/gui-core'

describe('custom color tokens', () => {
  beforeEach(() => {
    // Clear any global Hanzo GUI configuration between tests
    if (globalThis.__guiConfig) {
      delete globalThis.__guiConfig
    }
  })
  test('automatically merges custom color tokens into themes', () => {
    const customColors = {
      customRed: '#ff0000',
      customBlue: '#0000ff',
      customGreen: '#00ff00',
    }

    const config = {
      tokens: {
        color: customColors,
        space: { true: 10 },
        size: { true: 10 },
        radius: { true: 10 },
        zIndex: { true: 10 },
      },
      themes: {
        light: {
          background: '#fff',
          color: '#000',
        },
        dark: {
          background: '#000',
          color: '#fff',
        },
      },
    }

    const hanzoGui = createGui(config)

    // Check that custom colors are available in tokensParsed with correct structure
    expect(gui.tokensParsed.color['$customRed']).toBeDefined()
    expect(gui.tokensParsed.color['$customRed']).toMatchObject({
      isVar: true,
      key: '$customRed',
      name: 'c-color-customRed',
      val: '#ff0000',
      variable: 'var(--c-color-customRed)',
    })

    expect(gui.tokensParsed.color['$customBlue']).toMatchObject({
      isVar: true,
      key: '$customBlue',
      name: 'c-color-customBlue',
      val: '#0000ff',
      variable: 'var(--c-color-customBlue)',
    })

    expect(gui.tokensParsed.color['$customGreen']).toMatchObject({
      isVar: true,
      key: '$customGreen',
      name: 'c-color-customGreen',
      val: '#00ff00',
      variable: 'var(--c-color-customGreen)',
    })

    // Check that custom colors are automatically added to themes
    const lightTheme = gui.themeConfig.themes.light
    const darkTheme = gui.themeConfig.themes.dark

    expect(lightTheme.customRed).toBeDefined()
    expect(lightTheme.customRed.val).toBe('#ff0000')
    expect(lightTheme.customBlue.val).toBe('#0000ff')
    expect(lightTheme.customGreen.val).toBe('#00ff00')

    expect(darkTheme.customRed).toBeDefined()
    expect(darkTheme.customRed.val).toBe('#ff0000')
    expect(darkTheme.customBlue.val).toBe('#0000ff')
    expect(darkTheme.customGreen.val).toBe('#00ff00')
  })

  test('works with nested theme structures', () => {
    const customColors = {
      customAccent: '#ff00ff',
    }

    const config = {
      tokens: {
        color: customColors,
        space: { true: 10 },
        size: { true: 10 },
        radius: { true: 10 },
        zIndex: { true: 10 },
      },
      themes: {
        light: {
          background: '#fff',
        },
        dark: {
          background: '#000',
        },
        light_blue: {
          background: '#e0f2ff',
        },
        dark_blue: {
          background: '#001122',
        },
      },
    }

    const hanzoGui = createGui(config)

    // Check token structure
    expect(gui.tokensParsed.color['$customAccent']).toMatchObject({
      isVar: true,
      key: '$customAccent',
      name: 'c-color-customAccent',
      val: '#ff00ff',
      variable: 'var(--c-color-customAccent)',
    })

    // All themes should have the custom color
    expect(gui.themeConfig.themes.light.customAccent.val).toBe('#ff00ff')
    expect(gui.themeConfig.themes.dark.customAccent.val).toBe('#ff00ff')
    expect(gui.themeConfig.themes.light_blue.customAccent.val).toBe('#ff00ff')
    expect(gui.themeConfig.themes.dark_blue.customAccent.val).toBe('#ff00ff')
  })
})
