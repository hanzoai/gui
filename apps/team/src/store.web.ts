// WEB key/value store — localStorage, matching the async store.ts signature.

export async function getItem(key: string): Promise<string | null> {
  return globalThis.localStorage?.getItem(key) ?? null
}
export async function setItem(key: string, value: string): Promise<void> {
  globalThis.localStorage?.setItem(key, value)
}
export async function removeItem(key: string): Promise<void> {
  globalThis.localStorage?.removeItem(key)
}
