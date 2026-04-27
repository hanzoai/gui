import type { HanzoguiOptions } from '@hanzogui/types'
import { esbuildWatchFiles, generateThemesAndLog, getOptions } from './loadHanzogui'
import { regenerateConfig } from './regenerateConfig'

let isWatching = false

export async function watchHanzoguiConfig(hanzoguiOptions: HanzoguiOptions) {
  if (process.env.NODE_ENV === 'production') {
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
      inputPath = require.resolve(themeBuilderInput)
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
