declare global {
  var __DEV__: boolean | undefined
}

if (typeof globalThis.__DEV__ === 'undefined') {
  globalThis.__DEV__ = process.env.NODE_ENV === 'development'
}

export {}
