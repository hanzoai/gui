import { dirname, join } from 'node:path'

import { generateThemes, writeGeneratedThemes } from '@hanzogui/generate-themes'
import type { HanzoguiOptions } from '@hanzogui/types'
import * as FS from 'fs-extra'

import { requireHanzoguiCore } from '../helpers/requireHanzoguiCore'
import type { HanzoguiPlatform } from '../types'
import type { BundledConfig } from './bundleConfig'
import { getBundledConfig } from './bundleConfig'

const hanzoguiDir = join(process.cwd(), '.hanzogui')
const confFile = join(hanzoguiDir, 'hanzogui.config.json')

/**
 * Sort of a super-set of bundleConfig(), this code needs some refactoring ideally
 */

export async function regenerateConfig(
  hanzoguiOptions: HanzoguiOptions,
  configIn?: BundledConfig | null,
  rebuild = false
) {
  try {
    // this has a side effect of rebuilding config and css!
    // need to improve code here:
    const config = configIn ?? (await getBundledConfig(hanzoguiOptions, rebuild))
    if (!config) return
    const out = transformConfig(config, hanzoguiOptions.platform || 'web')

    await FS.ensureDir(dirname(confFile))
    await FS.writeJSON(confFile, out, {
      spaces: 2,
    })
  } catch (err) {
    if (process.env.DEBUG?.includes('hanzogui') || process.env.IS_TAMAGUI_DEV) {
      console.warn('regenerateConfig error', err)
    }
    // ignore for now
  }
}

export function regenerateConfigSync(
  _hanzoguiOptions: HanzoguiOptions,
  config: BundledConfig
) {
  try {
    FS.ensureDirSync(dirname(confFile))
    FS.writeJSONSync(
      confFile,
      transformConfig(config, _hanzoguiOptions.platform || 'web'),
      {
        spaces: 2,
      }
    )
  } catch (err) {
    if (process.env.DEBUG?.includes('hanzogui') || process.env.IS_TAMAGUI_DEV) {
      console.warn('regenerateConfig error', err)
    }
    // ignore for now
  }
}

export async function generateHanzoguiThemes(
  hanzoguiOptions: HanzoguiOptions,
  force = false
) {
  if (!hanzoguiOptions.themeBuilder) {
    return
  }

  const { input, output } = hanzoguiOptions.themeBuilder
  const inPath = resolveRelativePath(input)
  const outPath = resolveRelativePath(output)
  const generatedOutput = await generateThemes(inPath)

  // because this runs in parallel (its cheap) lets avoid logging a bunch, so check to see if changed:
  const hasChanged =
    force ||
    (await (async () => {
      try {
        if (!generatedOutput) return false
        const next = generatedOutput.generated
        const current = await FS.readFile(outPath, 'utf-8')
        return next !== current
      } catch (err) {
        // ok
      }
      return true
    })())

  if (hasChanged) {
    await writeGeneratedThemes(hanzoguiDir, outPath, generatedOutput)
  }

  return hasChanged
}

const resolveRelativePath = (inputPath: string) =>
  inputPath.startsWith('.') ? join(process.cwd(), inputPath) : require.resolve(inputPath)

function cloneDeepSafe(x: any, excludeKeys = {}) {
  if (!x) return x
  if (Array.isArray(x)) return x.map((_) => cloneDeepSafe(_))
  if (typeof x === 'function') return `Function`
  if (typeof x !== 'object') return x
  if ('$$typeof' in x) return 'Component'
  return Object.fromEntries(
    Object.entries(x).flatMap(([k, v]) => (excludeKeys[k] ? [] : [[k, cloneDeepSafe(v)]]))
  )
}

function transformConfig(config: BundledConfig, platform: HanzoguiPlatform) {
  if (!config) {
    return null
  }

  const { getVariableValue } = requireHanzoguiCore(platform)

  // ensure we don't mangle anything in the original
  const next = cloneDeepSafe(config, {
    validStyles: true,
  }) as BundledConfig

  const { components, nameToPaths, hanzoguiConfig } = next
  const { themes, tokens } = hanzoguiConfig

  // reduce down to usable, smaller json

  // slim themes, add name
  for (const key in themes) {
    const theme = themes[key]
    // @ts-ignore
    theme.id = key
    for (const tkey in theme) {
      theme[tkey] = getVariableValue(theme[tkey])
    }
  }

  // flatten variables
  for (const key in tokens) {
    const token = { ...tokens[key] }
    for (const tkey in token) {
      token[tkey] = getVariableValue(token[tkey])
    }
  }

  // remove bulky stuff in components
  for (const component of components) {
    for (const _ in component.nameToInfo) {
      // avoid mutating
      const compDefinition = { ...component.nameToInfo[_] }
      component.nameToInfo[_] = compDefinition

      const { parentStaticConfig, ...rest } = compDefinition.staticConfig
      compDefinition.staticConfig = rest
    }
  }

  // set to array
  next.nameToPaths = {}
  for (const key in nameToPaths) {
    next.nameToPaths[key] = [...nameToPaths[key]]
  }

  // remove stuff we dont need to send
  const {
    fontsParsed,
    getCSS,
    tokensParsed,
    themeConfig,
    shorthands: _shorthands,
    userShorthands,
    ...cleanedConfig
  } = next.hanzoguiConfig

  return {
    components,
    nameToPaths,
    hanzoguiConfig: {
      ...cleanedConfig,
      // Output userShorthands as shorthands (excludes built-ins)
      shorthands: userShorthands,
    },
  }
}
