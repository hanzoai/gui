import type { GuiOptions, ExtractedResponse } from '@hanzogui/static-worker'
import * as Static from '@hanzogui/static-worker'
import { getPragmaOptions } from '@hanzogui/static-worker'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin, PluginOption, ResolvedConfig, ViteDevServer } from 'vite'
import { normalizePath, transformWithEsbuild, type Environment } from 'vite'
import {
  loadGuiBuildConfig,
  getLoadPromise,
  getGuiOptions,
  ensureFullConfigLoaded,
} from './loadGui'

const resolve = (name: string) => fileURLToPath(import.meta.resolve(name))

// shared cache across all plugin instances/environments via globalThis
type CacheEntry = {
  js: string
  map: any
  cssImport: string | null
}

const CACHE_KEY = '__gui_vite_cache__'
const CACHE_SIZE_KEY = '__gui_vite_cache_size__'
const PENDING_KEY = '__gui_vite_pending__'

function getSharedCache(): Record<string, CacheEntry> {
  if (!(globalThis as any)[CACHE_KEY]) {
    ;(globalThis as any)[CACHE_KEY] = {}
  }
  return (globalThis as any)[CACHE_KEY]
}

function getSharedCacheSize(): number {
  return (globalThis as any)[CACHE_SIZE_KEY] || 0
}

function setSharedCacheSize(size: number) {
  ;(globalThis as any)[CACHE_SIZE_KEY] = size
}

function clearSharedCache() {
  ;(globalThis as any)[CACHE_KEY] = {}
  ;(globalThis as any)[CACHE_SIZE_KEY] = 0
}

// pending extractions map - dedupes concurrent requests for same file
function getPendingExtractions(): Map<string, Promise<CacheEntry | null>> {
  if (!(globalThis as any)[PENDING_KEY]) {
    ;(globalThis as any)[PENDING_KEY] = new Map()
  }
  return (globalThis as any)[PENDING_KEY]
}

type AliasOptions = {
  /** use @hanzogui/react-native-web-lite, 'without-animated' for smaller bundle */
  rnwLite?: boolean | 'without-animated'
  /** alias react-native-svg to @hanzogui/react-native-svg */
  svg?: boolean
}

type AliasEntry = { find: string | RegExp; replacement: string }

/**
 * returns vite-compatible aliases for gui
 * use this when you need control over alias ordering in your config
 */
export function guiAliases(options: AliasOptions = {}): AliasEntry[] {
  const aliases: AliasEntry[] = []

  if (options.svg) {
    aliases.push({
      find: 'react-native-svg',
      replacement: resolve('@hanzogui/react-native-svg'),
    })
  }

  if (options.rnwLite) {
    // entry point for main import (may be without-animated variant)
    const rnwl = resolve(
      options.rnwLite === 'without-animated'
        ? '@hanzogui/react-native-web-lite/without-animated'
        : '@hanzogui/react-native-web-lite'
    )
    // base package path for subpath imports (package directory, not entry file)
    const rnwlBase = path.dirname(resolve('@hanzogui/react-native-web-lite/package.json'))
    aliases.push(
      {
        // map deep RNW paths like dist/exports/StyleSheet/preprocess to rnw-lite's flat structure
        // extracts the final path segment (e.g. "preprocess" or "createReactDOMStyle")
        find: /^react-native(?:-web)?\/dist\/(?:exports|modules)\/.*\/([^/]+)$/,
        replacement: `${rnwlBase}/dist/esm/$1.mjs`,
      },
      {
        find: /^react-native$/,
        replacement: rnwl,
      },
      {
        find: /^react-native\/(Libraries\/Utilities\/codegenNativeComponent|Libraries\/Utilities\/codegenNativeCommand)$/,
        replacement: `${rnwlBase}/$1`,
      },
      {
        find: 'react-native/package.json',
        replacement: resolve('@hanzogui/react-native-web-lite/package.json'),
      },
      {
        find: /^react-native-web$/,
        replacement: rnwl,
      }
    )
  }

  return aliases
}

export function guiPlugin({
  disableResolveConfig,
  ...guiOptionsIn
}: GuiOptions & {
  disableResolveConfig?: boolean
} = {}): PluginOption {
  // extraction ON by default, set disableExtraction: true to opt out
  let shouldExtract = !guiOptionsIn.disableExtraction
  let watcher: Promise<{ dispose: () => void } | void | undefined> | undefined

  // TODO temporary fix
  const enableNativeEnv = !!globalThis.__vxrnEnableNativeEnv

  const extensions = [
    `.web.mjs`,
    `.web.js`,
    `.web.jsx`,
    `.web.ts`,
    `.web.tsx`,
    '.mjs',
    '.js',
    '.mts',
    '.ts',
    '.jsx',
    '.tsx',
    '.json',
  ]

  // start loading immediately but don't block
  loadGuiBuildConfig(guiOptionsIn)

  // helper to await load when needed
  const ensureLoaded = async () => {
    const promise = getLoadPromise()
    if (promise) await promise
    const options = getGuiOptions()
    // update shouldExtract from loaded config (gui.build.ts)
    if (options) {
      shouldExtract = !options.disableExtraction
    }
    return options
  }

  // extract plugin state
  const getHash = (input: string) => createHash('sha1').update(input).digest('base64')

  // use shared cache across environments
  const memoryCache = getSharedCache()

  const cssMap = new Map<string, string>()
  let config: ResolvedConfig
  let server: ViteDevServer
  const virtualExt = `.gui.css`

  const getAbsoluteVirtualFileId = (filePath: string) => {
    if (filePath.startsWith(config.root)) {
      return filePath
    }
    return normalizePath(path.join(config.root, filePath))
  }

  function isNotClient(environment?: Environment) {
    return environment?.name && environment.name !== 'client'
  }

  function isNative(environment?: Environment) {
    return (
      environment?.name && (environment.name === 'ios' || environment.name === 'android')
    )
  }

  function invalidateModule(absoluteId: string) {
    if (!server) return

    const { moduleGraph } = server
    const modules = moduleGraph.getModulesByFile(absoluteId)

    if (modules) {
      for (const module of modules) {
        moduleGraph.invalidateModule(module)
        module.lastHMRTimestamp = module.lastInvalidationTimestamp || Date.now()
      }
    }
  }

  const basePlugin: Plugin = {
    name: 'hanzo-gui',
    enforce: 'pre',

    configureServer(_server) {
      server = _server
    },

    async buildEnd() {
      await watcher?.then((res) => {
        res?.dispose()
      })
    },

    async transform(code, id) {
      if (id.includes('expo-linear-gradient')) {
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      }
    },

    async config(_, env) {
      const options = await ensureLoaded()

      if (!options) {
        throw new Error(`No hanzo-gui options loaded`)
      }

      // start watching config if enabled
      if (!options.disableWatchGuiConfig) {
        watcher = Static.watchGuiConfig({
          components: ['@hanzo/gui'],
          config: './src/gui.config.ts',
          ...options,
        }).catch((err) => {
          console.error(` [GUI] Error watching config: ${err}`)
        })
      }

      return {
        envPrefix: ['GUI_'],

        environments: {
          client: {
            define: {
              'process.env.GUI_IS_CLIENT': JSON.stringify(true),
              'process.env.GUI_ENVIRONMENT': '"client"',
            },
          },
        },

        define: {
          // reanimated support
          _frameTimestamp: undefined,
          _WORKLET: false,
          __DEV__: `${env.mode === 'development'}`,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || env.mode),
          'process.env.ENABLE_RSC': JSON.stringify(process.env.ENABLE_RSC || ''),
          'process.env.ENABLE_STEPS': JSON.stringify(process.env.ENABLE_STEPS || ''),
          'process.env.IS_STATIC': JSON.stringify(false),
          ...(env.mode === 'production' && {
            'process.env.GUI_OPTIMIZE_THEMES': JSON.stringify(true),
          }),
        },
        resolve:
          disableResolveConfig || enableNativeEnv
            ? {}
            : {
                extensions,
                alias: {
                  ...(options.platform !== 'native' && {
                    'react-native/Libraries/Renderer/shims/ReactFabric':
                      resolve('@hanzogui/proxy-worm'),
                    'react-native/Libraries/Utilities/codegenNativeComponent':
                      resolve('@hanzogui/proxy-worm'),
                    'react-native-svg': resolve('@hanzogui/react-native-svg'),
                    ...(!options?.useReactNativeWebLite && {
                      'react-native': resolve('react-native-web'),
                    }),
                  }),
                },
              },
      }
    },
  }

  const rnwLitePlugin: Plugin = {
    name: 'gui-rnw-lite',

    config() {
      if (enableNativeEnv) {
        return {}
      }

      const options = getGuiOptions()
      if (!options?.useReactNativeWebLite) {
        return {}
      }

      return {
        resolve: {
          alias: guiAliases({ rnwLite: options.useReactNativeWebLite }),
        },
      }
    },
  }

  // extract plugin for optimize mode
  // always included, but checks shouldExtract dynamically after config loads
  const extractPlugin: Plugin = {
    name: 'gui-extract',
    enforce: 'pre',

    async config(userConf) {
      // wait for config to load to know if we should extract
      const options = await ensureLoaded()

      userConf.optimizeDeps ||= {}
      userConf.optimizeDeps.include ||= []

      // inline-style-prefixer is CJS with __esModule and breaks without pre-bundling
      // (ReferenceError: exports is not defined). always include it.
      userConf.optimizeDeps.include.push('inline-style-prefixer')

      if (!shouldExtract) return

      userConf.optimizeDeps.include.push('@hanzogui/core/inject-styles')
    },

    async configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async resolveId(source) {
      if (!shouldExtract) return

      if (isNative(this.environment)) {
        return
      }

      if (isNotClient(this.environment)) {
        return
      }

      const [validId, query] = source.split('?')

      if (!validId.endsWith(virtualExt)) {
        return
      }

      const absoluteId = source.startsWith(config.root)
        ? source
        : getAbsoluteVirtualFileId(validId)

      if (cssMap.has(absoluteId)) {
        return absoluteId + (query ? `?${query}` : '')
      }
    },

    async load(id) {
      if (!shouldExtract) return

      const options = getGuiOptions()
      if (options?.disable) {
        return
      }

      if (isNative(this.environment)) {
        return
      }

      if (isNotClient(this.environment)) {
        return
      }

      const [validId] = id.split('?')
      return cssMap.get(validId)
    },

    transform: {
      order: 'pre',
      async handler(code, id) {
        // ensure hanzo-gui is loaded before transform
        const options = await ensureLoaded()

        // ensure full config (heavy bundling) is loaded before extraction
        await ensureFullConfigLoaded()

        // fully disabled = no extraction AND no debug attrs
        if (options?.disable) {
          return
        }

        if (isNative(this.environment)) {
          return
        }

        const [validId] = id.split('?')
        if (!validId.endsWith('.tsx')) {
          return
        }

        const { shouldDisable, shouldPrintDebug } = await getPragmaOptions({
          source: code,
          path: validId,
        })

        if (shouldPrintDebug) {
          console.trace(
            `Current file: ${id} in environment: ${this.environment?.name}, shouldDisable: ${shouldDisable}`
          )
          console.info(`\n\nOriginal source:\n${code}\n\n`)
        }

        if (shouldDisable) {
          return
        }

        const isSSR = isNotClient(this.environment)

        // cache key without environment - share compiled JS between SSR/client
        const cacheKey = getHash(`${code}${id}`)
        const pending = getPendingExtractions()

        // helper to format result based on environment
        const formatResult = (entry: CacheEntry) => {
          const finalCode =
            !isSSR && entry.cssImport ? `${entry.js}\n${entry.cssImport}` : entry.js
          return { code: finalCode, map: entry.map }
        }

        // check cache first
        const cached = memoryCache[cacheKey]
        if (cached) {
          if (process.env.DEBUG_GUI_CACHE) {
            console.info(
              `[gui-cache] HIT ${this.environment?.name || 'unknown'} ${id.split('/').pop()} key=${cacheKey.slice(0, 8)}`
            )
          }
          return formatResult(cached)
        }

        // check if another request is already extracting this file
        const pendingExtraction = pending.get(cacheKey)
        if (pendingExtraction) {
          if (process.env.DEBUG_GUI_CACHE) {
            console.info(
              `[gui-cache] WAIT ${this.environment?.name || 'unknown'} ${id.split('/').pop()} key=${cacheKey.slice(0, 8)}`
            )
          }
          const result = await pendingExtraction
          if (result) {
            return formatResult(result)
          }
          return
        }

        if (process.env.DEBUG_GUI_CACHE) {
          console.info(
            `[gui-cache] EXTRACT ${this.environment?.name || 'unknown'} ${id.split('/').pop()} key=${cacheKey.slice(0, 8)}`
          )
        }

        // create extraction promise and store it for deduplication
        const extractionPromise = (async (): Promise<CacheEntry | null> => {
          let extracted: ExtractedResponse | null
          try {
            extracted = await Static!.extractToClassNames({
              source: code,
              sourcePath: validId,
              options: options!,
              shouldPrintDebug,
            })
          } catch (err) {
            if (process.env.DEBUG_GUI_CACHE) {
              console.info(`[gui-cache] ERROR extracting ${id.split('/').pop()}:`, err)
            }
            console.error(err instanceof Error ? err.message : String(err))
            return null
          }

          if (!extracted) {
            if (process.env.DEBUG_GUI_CACHE) {
              console.info(`[gui-cache] no extraction result for ${id.split('/').pop()}`)
            }
            return null
          }

          const rootRelativeId = `${validId}${virtualExt}`
          const absoluteId = getAbsoluteVirtualFileId(rootRelativeId)

          let cssImport: string | null = null

          // store CSS and prepare import (but don't include in cached JS)
          if (extracted.styles) {
            this.addWatchFile(rootRelativeId)

            if (server && cssMap.has(absoluteId)) {
              invalidateModule(rootRelativeId)
            }

            cssImport = `import "${rootRelativeId}";`
            cssMap.set(absoluteId, extracted.styles)
          }

          // cache the JS separately from CSS import
          const jsCode = extracted.js.toString()
          const cacheEntry: CacheEntry = {
            js: jsCode,
            map: extracted.map,
            cssImport,
          }

          // track cache size and clear if too large (64MB)
          const newSize = getSharedCacheSize() + jsCode.length
          if (newSize > 67108864) {
            clearSharedCache()
          } else {
            setSharedCacheSize(newSize)
          }
          memoryCache[cacheKey] = cacheEntry

          if (process.env.DEBUG_GUI_CACHE) {
            console.info(
              `[gui-cache] WRITE key=${cacheKey.slice(0, 8)} cacheSize=${Object.keys(memoryCache).length}`
            )
          }

          return cacheEntry
        })()

        // store pending promise for deduplication
        pending.set(cacheKey, extractionPromise)

        try {
          const result = await extractionPromise
          if (result) {
            return formatResult(result)
          }
          return
        } finally {
          // clean up pending map
          pending.delete(cacheKey)
        }
      },
    },
  }

  return [basePlugin, rnwLitePlugin, extractPlugin]
}
