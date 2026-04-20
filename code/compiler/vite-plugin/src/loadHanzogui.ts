import * as StaticWorker from '@hanzogui/static-worker'
import type { HanzoguiOptions } from '@hanzogui/types'

// use globalThis to share state across vite environments (SSR, client, etc.)
const LOAD_STATE_KEY = '__hanzogui_load_state__'

type LoadState = {
  loadPromise: Promise<HanzoguiOptions> | null
  loadedOptions: HanzoguiOptions | null
  fullConfigLoaded: boolean
  fullConfigLoadPromise: Promise<void> | null
}

function getLoadState(): LoadState {
  if (!(globalThis as any)[LOAD_STATE_KEY]) {
    ;(globalThis as any)[LOAD_STATE_KEY] = {
      loadPromise: null,
      loadedOptions: null,
      fullConfigLoaded: false,
      fullConfigLoadPromise: null,
    }
  }
  return (globalThis as any)[LOAD_STATE_KEY]
}

export function getHanzoguiOptions(): HanzoguiOptions | null {
  return getLoadState().loadedOptions
}

export function getLoadPromise(): Promise<HanzoguiOptions> | null {
  return getLoadState().loadPromise
}

/**
 * Load just the hanzogui.build.ts config (lightweight)
 * This doesn't bundle the full hanzogui config - call ensureFullConfigLoaded() for that
 */
export async function loadHanzoguiBuildConfig(
  optionsIn?: Partial<HanzoguiOptions>
): Promise<HanzoguiOptions> {
  const state = getLoadState()
  if (state.loadedOptions) return state.loadedOptions
  if (state.loadPromise) return state.loadPromise

  state.loadPromise = (async () => {
    const options = await StaticWorker.loadHanzoguiBuildConfig({
      ...optionsIn,
      platform: 'web',
    })

    state.loadedOptions = options
    return options
  })()

  return state.loadPromise
}

/**
 * Ensure the full hanzogui config is loaded (heavy - bundles config + components)
 * Call this lazily when transform/extraction is actually needed
 */
export async function ensureFullConfigLoaded(): Promise<void> {
  const state = getLoadState()

  if (state.fullConfigLoaded) return
  if (state.fullConfigLoadPromise) return state.fullConfigLoadPromise

  // set promise immediately to prevent race conditions
  // (don't await loadHanzoguiBuildConfig before setting this)
  state.fullConfigLoadPromise = (async () => {
    const options = await loadHanzoguiBuildConfig()

    // load full hanzogui config in worker (asynchronous)
    if (!options.disableWatchHanzoguiConfig && !options.disable) {
      await StaticWorker.loadHanzogui({
        components: ['hanzogui'],
        platform: 'web',
        ...options,
      })
    }
    state.fullConfigLoaded = true
  })()

  return state.fullConfigLoadPromise
}

export async function cleanup() {
  await StaticWorker.destroyPool()
  const state = getLoadState()
  state.loadPromise = null
  state.loadedOptions = null
  state.fullConfigLoaded = false
  state.fullConfigLoadPromise = null
}
