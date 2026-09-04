import * as StaticWorker from '@hanzogui/static-worker'
import type { GuiOptions } from '@hanzogui/types'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { Compiler, RuleSetRule } from 'webpack'
import webpack from 'webpack'
import { requireResolve } from './requireResolve.ts'

export type PluginOptions = GuiOptions & {
  isServer?: boolean
  exclude?: RuleSetRule['exclude']
  test?: RuleSetRule['test']
  jsLoader?: any
  disableEsbuildLoader?: boolean
  disableModuleJSXEntry?: boolean
  disableWatchConfig?: boolean
  disableAliases?: boolean
  useGuiSVG?: boolean
}

export class GuiPlugin {
  pluginName = 'GuiPlugin'

  constructor(
    public options: PluginOptions = {
      platform: 'web',
      components: ['@hanzogui/core'],
    }
  ) {}

  safeResolves = (resolves: [string, string][], multiple = false) => {
    const res: string[][] = []
    for (const [out, mod] of resolves) {
      if (out.endsWith('$')) {
        res.push([out, mod])
        continue
      }
      try {
        res.push([out, requireResolve(mod)])
        if (multiple) {
          res.push([out, requireResolve(mod)])
        }
      } catch (err) {
        if (out.includes(`@gorhom/bottom-sheet`)) {
          continue
        }
        if (process.env.DEBUG?.startsWith('hanzogui')) {
          console.info(`  withGui skipping resolving ${out}`, err)
        }
      }
    }
    return res
  }

  get componentsFullPaths() {
    return this.safeResolves(
      this.options.components?.map(
        (moduleName) => [moduleName, moduleName] as [string, string]
      ) || [],
      true
    )
  }

  get componentsBaseDirs() {
    return this.componentsFullPaths.map(([_, fullPath]) => {
      let rootPath = dirname(fullPath as string)
      while (rootPath.length > 1) {
        const pkg = join(rootPath, 'package.json')
        const hasPkg = existsSync(pkg)
        if (hasPkg) {
          return rootPath
        }
        rootPath = join(rootPath, '..')
      }
      throw new Error(`Couldn't find package.json in any path above: ${fullPath}`)
    })
  }

  isInComponentModule = (fullPath: string) => {
    return this.componentsBaseDirs.some((componentDir) =>
      fullPath.startsWith(componentDir)
    )
  }

  get defaultAliases() {
    return Object.fromEntries(
      this.safeResolves([
        ['@hanzogui/core/reset.css', '@hanzogui/core/reset.css'],

        // fixes https://github.com/kentcdodds/mdx-bundler/issues/143
        // `react/jsx-runtime` and `react/jsx-dev-runtime` will break the build in nextjs 15 + app router
        ['react/jsx-runtime.js', 'react/jsx-runtime'],
        ['react/jsx-dev-runtime.js', 'react/jsx-dev-runtime'],

        ...(this.options.useGuiSVG
          ? [['react-native-svg', '@hanzogui/react-native-svg'] as [string, string]]
          : ([] as any)),

        ...(this.options.useReactNativeWebLite
          ? [
              ['react-native$', '@hanzogui/react-native-web-lite'],
              ['react-native-web$', '@hanzogui/react-native-web-lite'],
            ]
          : [
              ['react-native$', 'react-native-web'],
              ['react-native-web$', 'react-native-web'],
            ]),
      ])
    )
  }

  apply(compiler: Compiler) {
    // Filter out non-serializable properties before passing to worker
    // Functions like shouldExtract, getCSS, etc. are used on the main thread only
    const serializableOptions = { ...this.options }
    for (const key in serializableOptions) {
      const value = serializableOptions[key as keyof typeof serializableOptions]
      if (typeof value === 'function') {
        delete serializableOptions[key as keyof typeof serializableOptions]
      }
    }

    // Load Gui config asynchronously in worker
    void StaticWorker.loadGui({
      components: ['@hanzo/gui'],
      platform: 'web',
      ...serializableOptions,
    })

    if (compiler.options.mode === 'development' && !this.options.disableWatchConfig) {
      void StaticWorker.watchGuiConfig(serializableOptions).then((watcher) => {
        // yes this is weirdly done promise...
        process.once('exit', () => {
          watcher?.dispose()
        })
      })
    }

    // Clean up worker pool on exit
    process.once('exit', () => {
      void StaticWorker.destroyPool()
    })

    // mark as side effect
    compiler.hooks.normalModuleFactory.tap(this.pluginName, (nmf) => {
      nmf.hooks.createModule.tap(
        this.pluginName,
        // No @ts-expect-error here: webpack now types createData precisely enough
        // that the suppression became unused, and TS2578 fails the build on an
        // unused one. Deleting it is the fix — re-adding it the moment webpack's
        // types regress is, too.
        (createData: { matchResource?: string; settings: { sideEffects?: boolean } }) => {
          if (createData.matchResource?.endsWith('.hanzogui.css')) {
            createData.settings.sideEffects = true
          }
        }
      )
    })

    // default exclude definition
    if (!this.options.disableAliases) {
      const existingAlias = compiler.options.resolve.alias
      if (Array.isArray(existingAlias)) {
        //
      } else if (typeof existingAlias === 'object') {
        Object.assign(existingAlias, this.defaultAliases)
      }
    }

    // explude react native web exports:
    const excludeExports = this.options.excludeReactNativeWebExports
    if (excludeExports) {
      if (Array.isArray(excludeExports)) {
        try {
          const regexStr = `react-native-web(-lite)?/.*(${excludeExports.join('|')}).*js`
          const regex = new RegExp(regexStr)

          compiler.hooks.environment.tap('MyPlugin', () => {
            // Here you create a new instance of the plugin you want to add
            const definePlugin = new webpack.NormalModuleReplacementPlugin(
              regex,
              requireResolve('@hanzogui/proxy-worm')
            )
            // Manually apply the plugin to the compiler
            definePlugin.apply(compiler)
          })
        } catch (err) {
          console.warn(
            `Invalid names provided to excludeReactNativeWebExports: ${excludeExports.join(
              ', '
            )}`
          )
        }
      }
    }

    compiler.options.resolve.extensions = [
      ...new Set([
        '.web.tsx',
        '.web.ts',
        '.web.js',
        '.ts',
        '.tsx',
        '.js',
        ...(compiler.options.resolve.extensions || []),
      ]),
    ]

    compiler.options.resolve.fallback ||= {}
    compiler.options.resolve.fallback['crypto'] ||= false

    // look for compiled js with jsx intact as specified by module:jsx
    const mainFields = compiler.options.resolve.mainFields
    if (mainFields) {
      compiler.options.resolve.mainFields = Array.isArray(mainFields)
        ? mainFields
        : [mainFields]
      if (!this.options.disableModuleJSXEntry) mainFields.unshift('module:jsx')
    }

    if (!compiler.options.module) {
      return
    }

    const { jsLoader } = this.options

    const existing = compiler.options.module.rules as any[]

    /**
     * EVERY `oneOf` group, not the first one that exists.
     *
     * Next 16 splits its rules into two `oneOf` groups and the CSS group comes
     * first, so `find(...)` landed on 13 stylesheet rules, matched no compiler
     * there, and left `didReplaceNextJS` false — which outside dev mode does
     * nothing at all. The loader was attached to nothing, static extraction
     * never ran, and every build stayed green: measured on hanzo.ai, where 238
     * of 239 atomic classes were still being authored at render time with the
     * plugin installed and configured.
     */
    const ruleSets: any[][] = existing
      .filter((x) => x && typeof x === 'object' && 'oneOf' in x)
      .map((x) => x.oneOf as any[])
    if (!ruleSets.length) ruleSets.push(existing)

    const hanzoguiLoader = {
      loader: requireResolve('@hanzogui/loader'),
      options: {
        ...this.options,
        _disableLoadGui: true,
      },
    }

    /**
     * Layers whose modules are not app UI. Everything else IS: under the app
     * router each of `rsc`, `ssr` and `app-pages-browser` is its own layer, so
     * skipping every rule that carries an `issuerLayer` — which is what this
     * used to do — skipped all app-authored JSX and kept only the rules that
     * see node_modules, which the loader itself then declines.
     */
    const SKIP_LAYERS = new Set(['api-node', 'api-edge', 'middleware', 'instrument'])

    let didReplaceNextJS = false

    for (const rules of ruleSets) {
      for (const [index, rule] of rules.entries()) {
        // ANY position in the chain, not just the first: Next puts
        // `next-flight-client-module-loader` ahead of `next-swc-loader` on the
        // client and ssr layers, and matching only `use[0]` missed both.
        const uses = Array.isArray(rule?.use) ? rule.use : rule?.use ? [rule.use] : []
        const shouldReplaceNextJSRule =
          uses.some(
            (u: any) => (typeof u === 'string' ? u : u?.loader) === 'next-swc-loader'
          ) && !SKIP_LAYERS.has(rule.issuerLayer)

        if (shouldReplaceNextJSRule) {
          didReplaceNextJS = true

          rules[index] = {
            ...rule,
            test: this.options.test ?? rule.test ?? /\.m?[jt]sx?$/,
            exclude: this.options.exclude ?? rule.exclude,
            use: [
              ...(jsLoader ? [jsLoader] : []),
              ...(rule.use ? [].concat(rule.use) : []),
              hanzoguiLoader,
            ],
          }
        }
      }
    }

    // for dev mode we need to match the data-at attributes else hydration
    if (!didReplaceNextJS) {
      if (compiler.options.mode === 'development') {
        existing.push({
          test: this.options.test ?? /\.tsx$/,
          exclude: this.options.exclude,
          use: [hanzoguiLoader],
        })
      }
    }
  }
}
