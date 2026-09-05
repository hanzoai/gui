import { createRequire } from 'node:module'
import type { GuiOptions } from '@hanzogui/types'
import { esbuildWatchFiles, generateThemesAndLog, getOptions } from './loadGui.ts'
import { regenerateConfig } from './regenerateConfig.ts'
import { url } from '../here.ts'

const need = createRequire(url)

let isWatching = false

export async function watchGuiConfig(hanzoguiOptions: GuiOptions) {
  // when the compiler is disabled there's nothing to regenerate, so don't boot
  // a persistent esbuild watch service just to track the config graph. this is
  // the common dev setup (e.g. `disable: NODE_ENV === 'development'`) where the
  // plugin should be a no-op - otherwise every dev server leaks a long-lived
  // esbuild `--service` child watching a config it never compiles.
  if (process.env.NODE_ENV === 'production' || hanzoguiOptions.disable) {
    return {
      dispose() {},
    }
  }

  if (isWatching) {
    return
  }

  isWatching = true

  const options = await getOptions({ hanzoguiOptions })

  if (!options.hanzoguiOptions.config) {
    isWatching = false
    throw new Error(`No config`)
  }

  const disposeConfigWatcher = await esbuildWatchFiles(
    options.hanzoguiOptions.config,
    async () => {
      await generateThemesAndLog(options.hanzoguiOptions)
      await regenerateConfig(options.hanzoguiOptions, null, true)
    }
  )

  const themeBuilderInput = options.hanzoguiOptions.themeBuilder?.input
  let disposeThemesWatcher: Function | undefined

  if (themeBuilderInput) {
    let inputPath = themeBuilderInput
    try {
      inputPath = need.resolve(themeBuilderInput)
    } catch {
      // ok
    }
    disposeThemesWatcher = await esbuildWatchFiles(inputPath, async () => {
      await generateThemesAndLog(options.hanzoguiOptions)
    })
  }

  return {
    dispose() {
      isWatching = false
      disposeConfigWatcher()
      disposeThemesWatcher?.()
    },
  }
}
