import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { url } from '../here.ts'

const need = createRequire(url)
// @ts-ignore why
import { Color, colorLog } from '@hanzogui/cli-color'
import type { CLIResolvedOptions, CLIUserOptions, GuiOptions } from '@hanzogui/types'
import type { GuiInternalConfig } from '@hanzogui/web'
import esbuild from 'esbuild'
import * as esbuildWasm from 'esbuild-wasm'
import fsExtra from 'fs-extra'

import { SHOULD_DEBUG } from '../constants.ts'
import { requireGuiCore } from '../helpers/requireGuiCore.ts'
import { getNameToPaths, registerRequire } from '../registerRequire.ts'
import {
  type GuiProjectInfo,
  getBundledConfig,
  getLoadedConfig,
  hasBundledConfigChanged,
  loadComponentsSync,
  writeGuiCSS,
} from './bundleConfig.ts'
import { getGuiConfigPathFromOptionsConfig } from './getGuiConfigPathFromOptionsConfig.ts'
import {
  generateGuiThemes,
  regenerateConfig,
  regenerateConfigSync,
} from './regenerateConfig.ts'

const getFilledOptions = (propsIn: Partial<GuiOptions>): GuiOptions => ({
  // defaults
  platform: (process.env.GUI_TARGET as any) || 'web',
  config: 'hanzogui.config.ts',
  components: ['@hanzo/gui'],
  ...(propsIn as Partial<GuiOptions>),
})

let isLoadingPromise: null | Promise<any>

export async function loadGui(
  propsIn: Partial<GuiOptions>
): Promise<GuiProjectInfo | null> {
  if (isLoadingPromise) return await isLoadingPromise

  let resolvePromise
  let rejectPromise
  isLoadingPromise = new Promise((res, rej) => {
    resolvePromise = res
    rejectPromise = rej
  })

  try {
    const props = getFilledOptions(propsIn)

    const bundleInfo = await getBundledConfig(props)
    if (!bundleInfo) {
      console.warn(
        `No bundled config generated, maybe an error in bundling. Set DEBUG=hanzogui and re-run to get logs.`
      )
      resolvePromise(null)
      return null
    }

    // this affects the bundled config so run it first
    await generateThemesAndLog(props)

    // if they accidently pass in a config without createGui called,call it
    const maybeGuiConfig = bundleInfo.hanzoguiConfig as GuiInternalConfig
    if (maybeGuiConfig && !maybeGuiConfig.parsed) {
      const { createGui } = requireGuiCore(props.platform || 'web')
      bundleInfo.hanzoguiConfig = createGui(bundleInfo.hanzoguiConfig as any)
    }

    if (!hasBundledConfigChanged()) {
      resolvePromise(bundleInfo)
      return bundleInfo
    }

    await regenerateConfig(props, bundleInfo)

    resolvePromise(bundleInfo)
    return bundleInfo
  } catch (err) {
    rejectPromise()
    throw err
  } finally {
    isLoadingPromise = null
  }
}

// debounce a bit
let waiting = false

export const generateThemesAndLog = async (options: GuiOptions, force = false) => {
  if (waiting) return
  if (!options.themeBuilder) return
  try {
    waiting = true
    await new Promise((res) => setTimeout(res, 30))
    const didGenerate = await generateGuiThemes(options, force)

    // only logs when changed
    if (didGenerate) {
      const whitespaceBefore = `  `
      colorLog(
        Color.FgYellow,
        `${whitespaceBefore}➡ [hanzogui] generated themes: ${relative(
          process.cwd(),
          options.themeBuilder.output
        )}`
      )

      if (options.outputCSS) {
        const loadedConfig = getLoadedConfig()
        if (loadedConfig) {
          await writeGuiCSS(options.outputCSS, loadedConfig)
        }
      }
    }
  } finally {
    waiting = false
  }
}

const last: Record<string, GuiProjectInfo | null> = {}
const lastVersion: Record<string, string> = {}

// esbuild-wasm state - initialized once per process
let esbuildWasmInitialized = false

/**
 * Load hanzogui.build.ts config using esbuild-wasm transform
 * Uses WASM to avoid native esbuild service lifecycle issues (EPIPE errors)
 */
export async function loadGuiBuildConfigAsync(
  hanzoguiOptions: Partial<GuiOptions> | undefined
): Promise<GuiOptions> {
  const buildFilePath = hanzoguiOptions?.buildFile ?? './hanzogui.build.ts'
  const absolutePath =
    buildFilePath[0] === '.' ? join(process.cwd(), buildFilePath) : buildFilePath

  if (fsExtra.existsSync(absolutePath)) {
    try {
      const source = await fsExtra.readFile(absolutePath, 'utf-8')

      // initialize esbuild-wasm once
      if (!esbuildWasmInitialized) {
        await esbuildWasm.initialize({})
        esbuildWasmInitialized = true
      }

      // use esbuild-wasm.transform to compile this one small config file. note
      // that in node, even esbuild-wasm's transform spawns a long-lived
      // `--service --ping` child via ensureServiceIsRunning, so we tear it down
      // below - otherwise every plugin instance leaks a persistent esbuild
      // process for the lifetime of the dev server.
      const result = await esbuildWasm.transform(source, {
        loader: 'ts',
        format: 'cjs',
        target: 'node18',
        sourcefile: absolutePath,
      })

      // evaluate the compiled code to get the exports
      // pass process so process.env works in the config
      const module = { exports: {} as any }
      const fn = new Function('module', 'exports', 'require', 'process', result.code)
      fn(module, module.exports, need, process)

      const out = module.exports.default || module.exports
      if (!out || typeof out !== 'object') {
        throw new Error(`No default export found in ${buildFilePath}: ${out}`)
      }

      hanzoguiOptions = {
        ...hanzoguiOptions,
        ...out,
      }
    } catch (err) {
      console.error(`[hanzogui] Error loading ${buildFilePath}:`, err)
      throw err
    } finally {
      // this is a one-shot transform - don't keep the esbuild-wasm service
      // running for the rest of the process. it gets lazily re-spawned if
      // transform is ever called again.
      try {
        esbuildWasm.stop()
        esbuildWasmInitialized = false
      } catch {
        // ok - service may already be gone
      }
    }
  }

  if (!hanzoguiOptions) {
    throw new Error(
      `No hanzogui build options found either via input props or at hanzogui.build.ts`
    )
  }

  return {
    config: 'hanzogui.config.ts',
    components: ['@hanzo/gui', '@hanzogui/core'],
    ...hanzoguiOptions,
  } as GuiOptions
}

/**
 * @deprecated Use loadGuiBuildConfigAsync instead to avoid EPIPE errors
 */
export function loadGuiBuildConfigSync(hanzoguiOptions: Partial<GuiOptions> | undefined) {
  const buildFilePath = hanzoguiOptions?.buildFile ?? './hanzogui.build.ts'
  if (fsExtra.existsSync(buildFilePath)) {
    const registered = registerRequire('web')
    try {
      const out = need(
        buildFilePath[0] === '.' ? join(process.cwd(), buildFilePath) : buildFilePath
      ).default
      if (!out) {
        throw new Error(`No default export found in ${buildFilePath}: ${out}`)
      }

      hanzoguiOptions = {
        ...hanzoguiOptions,
        ...out,
      }
    } finally {
      registered.unregister()
    }
  }
  if (!hanzoguiOptions) {
    throw new Error(
      `No hanzogui build options found either via input props or at hanzogui.build.ts`
    )
  }
  return {
    config: 'hanzogui.config.ts',
    components: ['@hanzo/gui', '@hanzogui/core'],
    ...hanzoguiOptions,
  } as GuiOptions
}

// loads in-process using esbuild-register
export function loadGuiSync({
  forceExports,
  cacheKey,
  ...propsIn
}: Partial<GuiOptions> & {
  forceExports?: boolean
  cacheKey?: string
}): GuiProjectInfo {
  const key = JSON.stringify(propsIn)

  if (last[key] && !hasBundledConfigChanged()) {
    if (!lastVersion[key] || lastVersion[key] === cacheKey) {
      return last[key]!
    }
  }

  lastVersion[key] = cacheKey || ''

  const props = getFilledOptions(propsIn)

  // lets shim require and avoid importing react-native + react-native-web
  // we just need to read the config around them
  process.env.IS_STATIC = 'is_static'
  process.env.GUI_IS_SERVER = 'true'

  const { unregister } = registerRequire(props.platform || 'web', {
    proxyWormImports: !!forceExports,
  })

  try {
    const devValueOG = globalThis['__DEV__' as any]
    globalThis['__DEV__' as any] = process.env.NODE_ENV === 'development'

    try {
      // config
      let hanzoguiConfig: GuiInternalConfig | null = null
      if (propsIn.config) {
        const configPath = getGuiConfigPathFromOptionsConfig(propsIn.config)
        const exp = need(configPath)

        if (!exp || exp._isProxyWorm) {
          throw new Error(`Got a empty / proxied config!`)
        }

        hanzoguiConfig = (exp['default'] || exp['config'] || exp) as GuiInternalConfig

        if (!hanzoguiConfig || !hanzoguiConfig.parsed) {
          const confPath = need.resolve(configPath)
          throw new Error(`Can't find valid config in ${confPath}:
          
  Be sure you "export default" or "export const config" the config.`)
        }

        // set up core
        if (hanzoguiConfig) {
          const { createGui } = requireGuiCore(props.platform || 'web')
          createGui(hanzoguiConfig as any)
        }
      }

      // components
      const components = loadComponentsSync(props, forceExports)
      if (!components) {
        throw new Error(`No components loaded`)
      }
      if (process.env.DEBUG === 'hanzogui') {
        console.info(`components`, components)
      }

      // undo shims
      process.env.IS_STATIC = undefined
      globalThis['__DEV__' as any] = devValueOG

      const info = {
        components,
        hanzoguiConfig,
        nameToPaths: getNameToPaths(),
      } satisfies GuiProjectInfo

      if (hanzoguiConfig) {
        const { outputCSS } = props
        if (outputCSS) {
          writeGuiCSS(outputCSS, hanzoguiConfig)
        }

        regenerateConfigSync(props, info)
      }

      last[key] = {
        ...info,
        cached: true,
      }

      return info as any
    } catch (err) {
      if (err instanceof Error) {
        if (!SHOULD_DEBUG && !forceExports) {
          console.warn(
            `Error loading hanzogui.config.ts (set DEBUG=hanzogui to see full stack), running hanzogui without custom config`
          )
          console.info(`\n\n    ${err.message}\n\n`)
        } else {
          if (SHOULD_DEBUG) {
            console.error(err)
          }
        }
      } else {
        console.error(`Error loading hanzogui.config.ts`, err)
      }

      return {
        components: [],
        hanzoguiConfig: null,
        nameToPaths: {},
      }
    }
  } finally {
    unregister()
  }
}

export async function getOptions({
  root = process.cwd(),
  tsconfigPath = 'tsconfig.json',
  hanzoguiOptions,
  host,
  debug,
}: Partial<CLIUserOptions> = {}): Promise<CLIResolvedOptions> {
  const dotDir = join(root, '.hanzogui')
  let pkgJson = {}

  try {
    pkgJson = await fsExtra.readJSON(join(root, 'package.json'))
  } catch (err) {
    // ok
  }

  return {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    root,
    host: host || '127.0.0.1',
    pkgJson,
    debug,
    tsconfigPath,
    hanzoguiOptions: {
      platform: (process.env.GUI_TARGET as any) || 'web',
      components: ['@hanzo/gui'],
      ...hanzoguiOptions,
      config:
        hanzoguiOptions?.config ??
        (await getDefaultGuiConfigPath(root, hanzoguiOptions?.config)),
    },
    paths: {
      root,
      dotDir,
      conf: join(dotDir, 'hanzogui.config.json'),
      types: join(dotDir, 'types.json'),
    },
  }
}

export function resolveWebOrNativeSpecificEntry(entry: string, platform?: string) {
  const workspaceRoot = resolve()
  const resolved = need.resolve(entry, { paths: [workspaceRoot] })
  const ext = extname(resolved)
  const fileName = basename(resolved).replace(ext, '')
  const target = platform || process.env.GUI_TARGET || 'web'
  const specificExt = target === 'web' ? 'web' : 'native'
  const specificFile = join(dirname(resolved), fileName + '.' + specificExt + ext)
  if (fsExtra.existsSync(specificFile)) {
    return specificFile
  }
  return entry
}

const defaultPaths = ['hanzogui.config.ts', join('src', 'hanzogui.config.ts')]
let hasWarnedOnce = false

async function getDefaultGuiConfigPath(root: string, configPath?: string) {
  const searchPaths = [
    ...new Set(
      [configPath, ...defaultPaths].filter(Boolean).map((p) => join(root, p as string))
    ),
  ]

  for (const path of searchPaths) {
    if (await fsExtra.pathExists(path)) {
      return path
    }
  }

  if (!hasWarnedOnce) {
    hasWarnedOnce = true
    console.warn(`Warning: couldn't find hanzogui.config.ts in the following paths given configuration "${configPath}":
    ${searchPaths.join(`\n  `)}
  `)
  }
}

export type { GuiProjectInfo }

export async function esbuildWatchFiles(entry: string, onChanged: () => void) {
  let hasRunOnce = false

  /**
   * We're just (ab)using this as a file watcher, so bundle = true to follow paths
   * and then write: false and logLevel silent to avoid all errors
   */

  const context = await esbuild.context({
    bundle: true,
    entryPoints: [entry],
    resolveExtensions: ['.ts', '.tsx', '.js', '.mjs'],
    logLevel: 'silent',
    write: false,

    alias: {
      '@react-native/normalize-color': '@hanzogui/proxy-worm',
      'react-native-web': '@hanzogui/react-native-web-lite',
      'react-native': '@hanzogui/proxy-worm',
    },

    plugins: [
      // to log what its watching:
      // {
      //   name: 'test',
      //   setup({ onResolve }) {
      //     onResolve({ filter: /.*/ }, (args) => {
      //       console.log('wtf', args.path)
      //     })
      //   },
      // },

      {
        name: `on-rebuild`,
        setup({ onEnd, onResolve }) {
          // external node modules
          let filter = /^[^./]|^\.[^./]|^\.\.[^/]/ // Must not start with "/" or "./" or "../"
          onResolve({ filter }, (args) => ({ path: args.path, external: true }))

          onEnd(() => {
            if (!hasRunOnce) {
              hasRunOnce = true
            } else {
              onChanged()
            }
          })
        },
      },
    ],
  })

  // just returns after dispose is called i think
  void context.watch()

  return () => {
    context.dispose()
  }
}
