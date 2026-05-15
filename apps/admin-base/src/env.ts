// Runtime env shim — one bridge over Vite (`import.meta.env.VITE_*`) and
// Expo / Metro (`process.env.EXPO_PUBLIC_*`). The admin-base source is
// authored once and consumed by both apps/admin-base (Vite SPA) and
// apps/admin-base-go (Expo iOS/Android/web) via a tsconfig path alias.
//
// Direct `import.meta.env` reads crash Metro / Hermes: the Expo babel
// preset's `import-meta-transform-plugin` rejects the syntax outright,
// before any try/catch can run. Wrapping the read in `new Function`
// hides the token from the static parser, so babel and Hermes treat
// it as opaque runtime code. On the Vite side, `import.meta.env.VITE_X`
// is still inlined at build time because Vite scans for the literal
// substring in source — the substring lives inside the `Function` body
// string and is matched there.
//
// Add a new key by:
//   1. Listing it under `define` in vite.config.ts as VITE_X.
//   2. Listing it in EAS env config as EXPO_PUBLIC_X (or expo-constants).
//   3. Adding one line to `env` below.

declare const process: { env: Record<string, string | undefined> } | undefined

const importMetaEnv: Record<string, string | undefined> | undefined = (() => {
  try {
    // `new Function` hides `import.meta` from Babel/Hermes static analysis.
    // Vite still sees `import.meta.env` as a literal substring at bundle
    // time and inlines the values; Metro evaluates this lazily and the
    // function throws under CJS, so we fall through to Expo's process.env.
    return new Function('return import.meta && import.meta.env')() as
      | Record<string, string | undefined>
      | undefined
  } catch {
    return undefined
  }
})()

function fromVite(key: string): string | undefined {
  return importMetaEnv?.[`VITE_${key}`]
}

function fromExpo(key: string): string | undefined {
  try {
    return (globalThis as any)?.process?.env?.[`EXPO_PUBLIC_${key}`] as
      | string
      | undefined
  } catch {
    return undefined
  }
}

export const env = {
  APP_VERSION: fromVite('APP_VERSION') ?? fromExpo('APP_VERSION') ?? '0.4.0',
}
