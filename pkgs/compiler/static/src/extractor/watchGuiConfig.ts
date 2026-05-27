import type { GuiOptions } from '@hanzogui/types'
import { esbuildWatchFiles, generateThemesAndLog, getOptions } from './loadGui'
import { regenerateConfig } from './regenerateConfig'

let isWatching = false

export async function watchGuiConfig(guiOptions: GuiOptions) {
  if (process.env.NODE_ENV === 'production') {
    return {
      dispose() {},
    }
  }

  if (isWatching) {
    return
  }

  isWatching = true

  const options = await getOptions({ guiOptions })

  if (!options.guiOptions.config) {
    isWatching = false
    throw new Error(`No config`)
  }

  const disposeConfigWatcher = await esbuildWatchFiles(
    options.guiOptions.config,
    async () => {
      await generateThemesAndLog(options.guiOptions)
      await regenerateConfig(options.guiOptions, null, true)
    }
  )

  const themeBuilderInput = options.guiOptions.themeBuilder?.input
  let disposeThemesWatcher: Function | undefined

  if (themeBuilderInput) {
    let inputPath = themeBuilderInput
    try {
      inputPath = require.resolve(themeBuilderInput)
    } catch {
      // ok
    }
    disposeThemesWatcher = await esbuildWatchFiles(inputPath, async () => {
      await generateThemesAndLog(options.guiOptions)
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
