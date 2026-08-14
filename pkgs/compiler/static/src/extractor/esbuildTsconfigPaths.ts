import type { Plugin } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import * as ts from 'typescript'

const name = 'tsconfig-paths'

/**
 * This package does not own the `typescript` it reads — it borrows whatever the
 * app installed, and what that means changed. `typescript@7` ships the native
 * compiler, and its root export is `{ version, versionMajorMinor }`: `sys`,
 * `findConfigFile` and `nodeModuleNameResolver` are gone. Reading `sys.fileExists`
 * off it threw `Cannot read properties of undefined` while BUNDLING THE GUI
 * CONFIG, so on any app that took TS 7 the whole compiler plugin died before it
 * could write a single rule — measured on hanzoai/chat.
 *
 * The API is therefore probed, not assumed. Without it this plugin stops
 * rewriting `compilerOptions.paths` and esbuild resolves on its own, which costs
 * a gui config that imports through a TS path alias and costs everything else
 * nothing. Losing an alias beats losing the stylesheet.
 */
const hasProgramApi = typeof (ts as any)?.sys?.fileExists === 'function'

let warned = false
function warnOnce() {
  if (warned) return
  warned = true
  console.warn(
    `  ➡ [hanzogui] typescript ${(ts as any)?.version ?? '(not found)'} has no program API ` +
      `(7.x removed it from the root export), so tsconfig "paths" are not applied when ` +
      `bundling the gui config. Imports resolve through node.`
  )
}

interface Tsconfig {
  compilerOptions?: {
    baseUrl?: string
    paths?: Record<string, string[]>
  }
}

export function TsconfigPathsPlugin(): Plugin {
  if (!hasProgramApi) {
    warnOnce()
    return { name, setup() {} }
  }

  const compilerOptions = loadCompilerOptionsFromTsconfig()

  return {
    name,
    setup({ onResolve }) {
      onResolve({ filter: /.*/ }, (args) => {
        // skip @hanzogui packages - they should be externalized, not resolved via tsconfig
        if (args.path.startsWith('@hanzogui/')) {
          return null
        }

        const paths = compilerOptions.paths || {}
        const hasMatchingPath = Object.keys(paths).some((p) =>
          new RegExp(p.replace('*', '\\w*')).test(args.path)
        )

        if (!hasMatchingPath) {
          return null
        }

        const { resolvedModule } = ts.nodeModuleNameResolver(
          args.path,
          args.importer,
          compilerOptions,
          ts.sys
        )

        if (!resolvedModule) {
          return null
        }

        const { resolvedFileName } = resolvedModule

        if (!resolvedFileName || resolvedFileName.endsWith('.d.ts')) {
          return null
        }

        return {
          path: resolvedFileName,
        }
      })
    },
  }
}

export function loadCompilerOptionsFromTsconfig(tsconfig?: Tsconfig | string) {
  if (!hasProgramApi) {
    warnOnce()
    return {}
  }

  if (!tsconfig) {
    const configPath =
      ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json') ||
      ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'jsconfig.json')

    if (configPath) {
      return parseTsconfig(configPath)
    }
    return {}
  }

  if (typeof tsconfig === 'string') {
    if (fs.existsSync(tsconfig)) {
      return parseTsconfig(tsconfig)
    } else {
      throw new Error(`Specified tsconfig file not found: ${tsconfig}`)
    }
  }

  const baseDir = process.cwd()
  const parsed = ts.parseJsonConfigFileContent(tsconfig, ts.sys, baseDir)
  return parsed.options
}

function parseTsconfig(configFilePath: string) {
  const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile)
  if (configFile.error) {
    throw new Error(
      `Error reading tsconfig file '${configFilePath}': ${configFile.error.messageText}`
    )
  }

  const baseDir = path.dirname(configFilePath)
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, baseDir)
  return parsed.options
}
