import Module from 'node:module'
import * as React from 'react'
import 'vitest-axe/extend-expect'

import { expect } from 'vitest'
// @ts-ignore
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

globalThis.React = React

// Intercept CJS requires for react-native to avoid loading flow-syntax react-native/index.js
const originalRequire = (Module as any).prototype.require
;(Module as any).prototype.require = function (id: string, ...args: any[]) {
  if (id === 'react-native' || id.startsWith('react-native/')) {
    const isNative =
      !process.env.DISABLE_REACT_NATIVE &&
      !process.env.DISABLE_NATIVE_TEST &&
      process.env.GUI_TARGET !== 'web'
    const target = isNative
      ? '@hanzogui/fake-react-native'
      : '@hanzogui/react-native-web-lite'
    return originalRequire.call(this, target)
  }
  return originalRequire.apply(this, [id, ...args])
}

// mock matchMedia for jsdom/happy-dom environments
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
