import type { CSSProperties, ReactNode } from 'react'
import { createElement, forwardRef } from 'react'

// Mock react-native components that render as plain elements react-test-renderer
// serialises by name.
type Props = { children?: ReactNode; style?: CSSProperties } & Record<string, unknown>
const mock = (name: string) => {
  const Component = forwardRef<Element, Props>(({ children, style, ...rest }, ref) =>
    createElement(name, { ...rest, style, ref }, children as ReactNode)
  )
  Component.displayName = name
  return Component
}

const empty = () => null
const usePressability = () => ({})

type Worm = Record<string, unknown>

function worm(): Worm {
  const base: Worm = {
    StyleSheet: { create() {} },
    Platform: { OS: 'web' },
    Image: empty,
    View: mock('View'),
    Text: mock('Text'),
    TextInput: mock('TextInput'),
    ScrollView: mock('ScrollView'),
    Dimensions: {
      get: () => ({ width: 1024, height: 768 }),
      addEventListener: () => ({ remove: () => {} }),
    },
    Appearance: {
      getColorScheme: () => 'light',
      addChangeListener: () => {},
      removeChangeListener: () => {},
    },
    addPoolingTo() {},
    Libraries: { Pressability: { usePressability: { default: usePressability } } },
  }
  return new Proxy(base, {
    get(target, key) {
      return Reflect.get(target, key) || worm()
    },
    apply() {
      return worm()
    },
  })
}

const proxy = worm()

export const Platform = proxy.Platform
export const StyleSheet = proxy.StyleSheet
export const Image = proxy.Image
export const View = proxy.View
export const Text = proxy.Text
export const TextInput = proxy.TextInput
export const ScrollView = proxy.ScrollView
export const Dimensions = proxy.Dimensions
export const Pressable = proxy.Pressable
export const Animated = proxy.Animated
export const Easing = proxy.Easing
export const Appearance = proxy.Appearance
export const findNodeHandle = proxy.findNodeHandle
export const unstable_batchedUpdates = proxy.unstable_batchedUpdates

export default proxy
