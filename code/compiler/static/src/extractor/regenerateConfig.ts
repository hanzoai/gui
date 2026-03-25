import { dirname, join } from 'node:path'

import { generateThemes, writeGeneratedThemes } from '@hanzogui/generate-themes'
import type { GuiOptions } from '@hanzogui/types'
import * as FS from 'fs-extra'

import { requireGuiCore } from '../helpers/requireGuiCore'
import type { GuiPlatform } from '../types'
import type { BundledConfig } from './bundleConfig'
import { getBundledConfig } from './bundleConfig'

const guiDir = join(process.cwd(), '.gui')
const confFile = join(guiDir, 'gui.config.json')

/**
 * Sort of a super-set of bundleConfig(), this code needs some refactoring ideally
 */

export async function regenerateConfig(
  guiOptions: GuiOptions,
  configIn?: BundledConfig | null,
  rebuild = false
) {
  try {
    // this has a side effect of rebuilding config and css!
    // need to improve code here:
    const config = configIn ?? (await getBundledConfig(guiOptions, rebuild))
    if (!config) return
    const out = transformConfig(config, guiOptions.platform || 'web')

    await FS.ensureDir(dirname(confFile))
    await FS.writeJSON(confFile, out, {
      spaces: 2,
    })
  } catch (err) {
    if (process.env.DEBUG?.includes('@hanzo/gui') || process.env.IS_HANZO_GUI_DEV) {
      console.warn('regenerateConfig error', err)
    }
    // ignore for now
  }
}

export function regenerateConfigSync(_guiOptions: GuiOptions, config: BundledConfig) {
  try {
    FS.ensureDirSync(dirname(confFile))
    FS.writeJSONSync(confFile, transformConfig(config, _guiOptions.platform || 'web'), {
      spaces: 2,
    })
  } catch (err) {
    if (process.env.DEBUG?.includes('@hanzo/gui') || process.env.IS_HANZO_GUI_DEV) {
      console.warn('regenerateConfig error', err)
    }
    // ignore for now
  }
}

export async function generateGuiThemes(guiOptions: GuiOptions, force = false) {
  if (!guiOptions.themeBuilder) {
    return
  }

  const { input, output } = guiOptions.themeBuilder
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
    await writeGeneratedThemes(guiDir, outPath, generatedOutput)
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

function transformConfig(config: BundledConfig, platform: GuiPlatform) {
  if (!config) {
    return null
  }

  const { getVariableValue } = requireGuiCore(platform)

  // ensure we don't mangle anything in the original
  const next = cloneDeepSafe(config, {
    validStyles: true,
  }) as BundledConfig

  const { components, nameToPaths, guiConfig } = next
  const { themes, tokens } = guiConfig

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
  } = next.guiConfig

  return {
    components,
    nameToPaths,
    guiConfig: {
      ...cleanedConfig,
      // Output userShorthands as shorthands (excludes built-ins)
      shorthands: userShorthands,
    },
  }
}
