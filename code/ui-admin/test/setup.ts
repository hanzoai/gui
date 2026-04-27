// Node 25 ships an experimental built-in `localStorage` that is a
// plain Object — it has no `.setItem` / `.getItem` / `.clear`. When
// vitest spawns workers, that global lands on `globalThis` *before*
// jsdom installs its own `window.localStorage`. The jsdom one becomes
// shadowed, so tests touching `localStorage.setItem(...)` blow up
// with `is not a function`.
//
// Fix: replace `globalThis.localStorage` with a real Map-backed
// Storage shim once, before any test module loads.

if (typeof globalThis.localStorage === 'undefined' || typeof (globalThis.localStorage as Storage).setItem !== 'function') {
  const store = new Map<string, string>()
  const shim: Storage = {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.has(key) ? (store.get(key) as string) : null
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(key, String(value))
    },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: shim,
  })
}

// jsdom omits `window.matchMedia`. Hanzo GUI's `<Select>` (via
// @hanzogui/select) reads it at module-load to wire responsive
// triggers — without a shim every test that imports a component
// touching Select crashes at "matchMedia is not a function".
if (typeof globalThis.matchMedia !== 'function') {
  Object.defineProperty(globalThis, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  })
}
