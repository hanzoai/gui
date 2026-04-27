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
