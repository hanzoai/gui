// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config').MetroConfig}
 */
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
})

// Enable Hanzogui and add nice web support with optimizing compiler + CSS extraction
const { withHanzogui } = require('@hanzogui/metro-plugin')
module.exports = withHanzogui(config, {
  components: ['hanzogui'],
  config: './hanzogui.config.ts',
})

config.resolver.sourceExts.push('mjs')

module.exports = config

// REMOVE THIS (just for hanzogui internal devs to work in monorepo):
console.info(`Starting metro`)
if (process.env.IS_TAMAGUI_DEV && __dirname.includes('hanzogui')) {
  console.info('🧑‍💻 using monorepo packages')
  const fs = require('fs')
  const path = require('path')
  const projectRoot = __dirname
  const monorepoRoot = path.resolve(projectRoot, '../..')
  config.watchFolders = [monorepoRoot]
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ]
  // have to manually de-deupe
  try {
    fs.rmSync(path.join(projectRoot, 'node_modules', '@hanzogui'), {
      recursive: true,
      force: true,
    })
  } catch {}
  // try {
  //   fs.rmSync(path.join(projectRoot, 'node_modules', 'hanzogui'), {
  //     recursive: true,
  //     force: true,
  //   })
  // } catch {}
  try {
    fs.rmSync(path.join(projectRoot, 'node_modules', 'react'), {
      recursive: true,
      force: true,
    })
  } catch {}
  try {
    fs.rmSync(path.join(projectRoot, 'node_modules', 'react-dom'), {
      recursive: true,
      force: true,
    })
  } catch {}
}
