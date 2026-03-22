import * as StaticWorker from '@hanzo/gui-static-worker'
import type { GuiOptions } from '@hanzo/gui-types'

// use globalThis to share state across vite environments (SSR, client, etc.)
const LOAD_STATE_KEY = '__gui_load_state__'

type LoadState = {
  loadPromise: Promise<GuiOptions> | null
  loadedOptions: GuiOptions | null
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

export function getGuiOptions(): GuiOptions | null {
  return getLoadState().loadedOptions
}

export function getLoadPromise(): Promise<GuiOptions> | null {
  return getLoadState().loadPromise
}

/**
 * Load just the gui.build.ts config (lightweight)
 * This doesn't bundle the full gui config - call ensureFullConfigLoaded() for that
 */
export async function loadGuiBuildConfig(
  optionsIn?: Partial<GuiOptions>
): Promise<GuiOptions> {
  const state = getLoadState()
  if (state.loadedOptions) return state.loadedOptions
  if (state.loadPromise) return state.loadPromise

  state.loadPromise = (async () => {
    const options = await StaticWorker.loadGuiBuildConfig({
      ...optionsIn,
      platform: 'web',
    })

    state.loadedOptions = options
    return options
  })()

  return state.loadPromise
}

/**
 * Ensure the full gui config is loaded (heavy - bundles config + components)
 * Call this lazily when transform/extraction is actually needed
 */
export async function ensureFullConfigLoaded(): Promise<void> {
  const state = getLoadState()

  if (state.fullConfigLoaded) return
  if (state.fullConfigLoadPromise) return state.fullConfigLoadPromise

  // set promise immediately to prevent race conditions
  // (don't await loadGuiBuildConfig before setting this)
  state.fullConfigLoadPromise = (async () => {
    const options = await loadGuiBuildConfig()

    // load full gui config in worker (asynchronous)
    if (!options.disableWatchGuiConfig && !options.disable) {
      await StaticWorker.loadGui({
        components: ['@hanzo/gui'],
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
