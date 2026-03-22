export function createGlobalState<T extends { enabled: boolean }>(
  key: string,
  defaultValue: T
): {
  get: () => T
  set: (next: T) => void
} {
  const GLOBAL_KEY = `__gui_${key}__`

  type GuiGlobal = typeof globalThis & {
    [GLOBAL_KEY]?: T
  }

  function getGlobalState(): T {
    const g = globalThis as GuiGlobal
    if (!g[GLOBAL_KEY]) {
      // reset on module load so reloadReactNative gets a clean state
      // (globalThis persists across reloads but module scope re-evaluates)
      g[GLOBAL_KEY] = defaultValue
    }
    return g[GLOBAL_KEY]!
  }

  function setGlobalState(newState: T): void {
    ;(globalThis as GuiGlobal)[GLOBAL_KEY] = newState
  }

  return {
    get: getGlobalState,
    set: setGlobalState,
  }
}
