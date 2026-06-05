const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.resolver.unstable_enablePackageExports =
  process.env.GUI_PACKAGE_EXPORTS !== 'false'

// block unnecessary directories from metro file crawling
config.resolver.blockList = [
  /code\/gui\.dev\//,
  /code\/.*\/__tests__\//,
  /code\/.*\/\.maestro\//,
]

config.watchFolders = [monorepoRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

// no withGui, no unstable_conditionNames - pure vanilla
module.exports = config
