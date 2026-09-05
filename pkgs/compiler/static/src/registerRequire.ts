import { register } from 'esbuild-register/dist/node'
import Module, { createRequire } from 'node:module'
import proxyWorm from '@hanzogui/proxy-worm'

import { esbuildIgnoreFilesRegex } from './extractor/bundle.ts'
import { requireGuiCore } from './helpers/requireGuiCore.ts'
import type { GuiPlatform } from './types.ts'
import { url } from './here.ts'

const nameToPaths = {}

export const getNameToPaths = () => nameToPaths

const require = createRequire(url)

let isRegistered = false
let og: any

const whitelisted = {
  react: true,
}

const compiled = {}
export function setRequireResult(name: string, result: any) {
  compiled[name] = result
}

function getStaticExtractionStub(path: string) {
  switch (path) {
    case 'expo-constants':
      return {
        __esModule: true,
        default: {
          executionEnvironment: null,
        },
        ExecutionEnvironment: {
          Bare: 'bare',
          Standalone: 'standalone',
          StoreClient: 'storeClient',
        },
      }
    case 'expo-updates':
      return {
        __esModule: true,
        default: {
          isEnabled: false,
          isUsingEmbeddedAssets: true,
        },
        checkForUpdateAsync: async () => ({ isAvailable: false }),
        fetchUpdateAsync: async () => ({ isNew: false }),
        reloadAsync: async () => {},
      }
    default:
      return null
  }
}

export function registerRequire(
  platform: GuiPlatform,
  { proxyWormImports } = {
    proxyWormImports: false,
  }
) {
  // already registered
  if (isRegistered) {
    return {
      hanzoguiRequire: require,
      unregister: () => {},
    }
  }

  // capture original resolve BEFORE esbuild-register patches it
  // so we can use Node's native exports resolution for @hanzogui packages
  const mod = Module as any
  const originalResolveFilename = mod._resolveFilename

  const { unregister } = register({
    hookIgnoreNodeModules: false,
    // don't transform @hanzogui packages - they have pre-built dist files
    hookMatcher: (filename) => {
      if (
        filename.includes('@hanzogui') ||
        /\/hanzogui\/code\/(core|ui|packages)\//.test(filename)
      ) {
        return false
      }
      return true
    },
  })

  // esbuild-register's registerTsconfigPaths replaces Module._resolveFilename
  // but tsconfig paths resolution bypasses Node's package exports
  // we need to restore Node's native resolution for @hanzogui packages
  const tsconfigPatchedResolve = mod._resolveFilename
  mod._resolveFilename = function (request: string, ...args: any[]) {
    // for @hanzogui packages, use Node's native resolution (respects exports)
    if (request.startsWith('@hanzogui/')) {
      return originalResolveFilename.call(this, request, ...args)
    }
    // for everything else, use tsconfig-paths resolution
    return tsconfigPatchedResolve.call(this, request, ...args)
  }

  if (!og) {
    og = mod.prototype.require // capture esbuild require
  }

  isRegistered = true

  mod.prototype.require = hanzoguiRequire

  function hanzoguiRequire(this: any, path: string) {
    const staticExtractionStub = getStaticExtractionStub(path)
    if (staticExtractionStub) {
      return staticExtractionStub
    }

    if (path === 'hanzogui' && platform === 'native') {
      return og.apply(this, ['hanzogui/native'])
    }

    if (path === '@hanzogui/core') {
      return requireGuiCore(platform, (path) => {
        return og.apply(this, [path])
      })
    }

    if (
      path in knownIgnorableModules ||
      path.startsWith('react-native-reanimated') ||
      esbuildIgnoreFilesRegex.test(path)
    ) {
      return proxyWorm
    }

    if (path in compiled) {
      return compiled[path]
    }

    if (path === 'react-native-svg') {
      return og.apply(this, ['@hanzogui/react-native-svg'])
    }

    if (path === 'react-native/package.json') {
      return og.apply(this, ['react-native-web/package.json'])
    }

    if (
      path === '@hanzogui/react-native-web-lite' ||
      path === 'react-native' ||
      path.startsWith('react-native/') ||
      path === 'react-native-web' ||
      path.startsWith('react-native-web/')
    ) {
      try {
        return og.apply('react-native')
      } catch {
        return og.apply(this, ['@hanzogui/react-native-web-lite'])
      }
    }

    if (!whitelisted[path]) {
      if (proxyWormImports && !path.includes('.hanzogui-dynamic-eval')) {
        // allow hanzogui and its sub-packages through - they re-export components
        // with staticConfig needed for dynamic eval optimization.
        // also allow requires FROM within hanzogui packages (relative imports like ./Separator.cjs)
        const callerFile = this?.filename || this?.id || ''
        const isFromGuiPkg =
          callerFile.includes('@hanzogui') ||
          callerFile.includes('node_modules/hanzogui/') ||
          /\/hanzogui\/code\/(core|ui|packages)\//.test(callerFile)
        const isFromStaticLoader =
          !callerFile ||
          callerFile === '.' ||
          callerFile === '[eval]' ||
          callerFile.endsWith('/[eval]') ||
          callerFile.includes('/pkgs/compiler/static/') ||
          callerFile.includes('/.hanzogui/')
        // relative requires from within a whitelisted package's own files
        // (e.g. react/index.js does require('./cjs/react.development.js')).
        // proxy-worming these breaks the package's own internals.
        const isRelativeFromWhitelisted =
          path.startsWith('.') &&
          Object.keys(whitelisted).some((pkg) =>
            callerFile.includes(`/node_modules/${pkg}/`)
          )

        if (
          path === 'hanzogui' ||
          path.startsWith('@hanzogui/') ||
          isRelativeFromWhitelisted ||
          isFromGuiPkg ||
          isFromStaticLoader
        ) {
          return og.apply(this, [path])
        }
        return proxyWorm
      }
    }

    try {
      const out = og.apply(this, arguments)
      // only for studio disable for now
      // if (!nameToPaths[path]) {
      //   if (out && typeof out === 'object') {
      //     for (const key in out) {
      //       try {
      //         const conf = out[key]?.staticConfig as StaticConfig
      //         if (conf) {
      //           if (conf.componentName) {
      //             nameToPaths[conf.componentName] ??= new Set()
      //             const fullName = path.startsWith('.')
      //               ? join(`${this.path.replace(/dist(\/cjs)?/, 'src')}`, path)
      //               : path
      //             nameToPaths[conf.componentName].add(fullName)
      //           } else {
      //             // console.log('no name component', path)
      //           }
      //         }
      //       } catch {
      //         // ok
      //       }
      //     }
      //   }
      // }
      return out
    } catch (err: any) {
      if (
        !process.env.GUI_ENABLE_WARN_DYNAMIC_LOAD &&
        path.includes('hanzogui-dynamic-eval')
      ) {
        // ok, dynamic eval fails
        return
      }
      if (allowedIgnores[path] || IGNORES === 'true') {
        // ignore
      } else if (!process.env.GUI_SHOW_FULL_BUNDLE_ERRORS && !process.env.DEBUG) {
        if (hasWarnedForModules.has(path)) {
          // ignore
        } else {
          hasWarnedForModules.add(path)
        }
      } else {
        /**
         * Allow errors to happen, we're just reading config and components but sometimes external modules cause problems
         * We can't fix every problem, so just swap them out with proxyWorm which is a sort of generic object that can be read.
         */

        console.warn(
          `  [hanzogui] skipped "${path}" (set GUI_IGNORE_BUNDLE_ERRORS="${path}" to silence)`
        )
      }

      return proxyWorm
    }
  }

  return {
    hanzoguiRequire,
    unregister: () => {
      if (hasWarnedForModules.size) {
        console.info(
          `  [hanzogui] skipped loading ${hasWarnedForModules.size} module, see: https://hanzogui.dev/docs/intro/errors#warning-001`
        )
        hasWarnedForModules.clear()
      }

      unregister()
      isRegistered = false
      Module.prototype.require = og
    },
  }
}

const IGNORES = process.env.GUI_IGNORE_BUNDLE_ERRORS
const extraIgnores =
  IGNORES === 'true' ? [] : process.env.GUI_IGNORE_BUNDLE_ERRORS?.split(',')

const knownIgnorableModules = {
  '@gorhom/bottom-sheet': true,
  'expo-modules': true,
  solito: true,
  'expo-linear-gradient': true,
  '@expo/vector-icons': true,
  'hanzogui/linear-gradient': true,
  // animation libraries not needed for static extraction
  '@emotion/is-prop-valid': true,
  'framer-motion': true,
  motion: true,
  ...Object.fromEntries(extraIgnores?.map((k) => [k, true]) || []),
}

const hasWarnedForModules = new Set<string>()

const allowedIgnores = {
  'expo-constants': true,
  './ExpoHaptics': true,
  './js/MaskedView': true,
}
