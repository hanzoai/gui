// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config').MetroConfig}
 */
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
})

// Enable Hanzo GUI and add nice web support with optimizing compiler + CSS extraction
const { withGui } = require('@hanzogui/metro-plugin')
module.exports = withGui(config, {
  components: ['@hanzo/gui'],
  config: './gui.config.ts',
})

config.resolver.sourceExts.push('mjs')

module.exports = config

// REMOVE THIS (just for hanzo-gui internal devs to work in monorepo):
console.info(`Starting metro`)
if (process.env.IS_GUI_DEV && __dirname.includes('@hanzo/gui')) {
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
    fs.rmSync(path.join(projectRoot, 'node_modules', '@gui'), {
      recursive: true,
      force: true,
    })
  } catch {}
  // try {
  //   fs.rmSync(path.join(projectRoot, 'node_modules', '@hanzo/gui'), {
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
