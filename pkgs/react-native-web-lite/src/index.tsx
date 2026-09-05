import { createContext } from 'react'

export {
  AccessibilityUtil,
  canUseDOM,
  clickProps,
  createDOMProps,
  dismissKeyboard,
  flattenStyle,
  ImageLoader,
  InteractionManager,
  isWebColor,
  LocaleProvider,
  mergeRefs,
  normalizeColor,
  Platform,
  processColor,
  processStyle,
  StyleSheet,
  TextAncestorContext,
  UIManager,
  useEvent,
  useHover,
  useLayoutEffect,
  useMergeRefs,
  usePlatformMethods,
} from '@hanzogui/react-native-web-internals'
export { createElement as unstable_createElement } from './createElement/index.tsx'
export { NativeModules } from './NativeModules/index.tsx'
export { render } from './render/index.tsx'

// animated - keep default as these are vendor files
export { default as Animated } from './vendor/react-native/Animated/Animated.js'
export { default as Easing } from './vendor/react-native/Animated/Easing.js'

// react-native - keep default as these are vendor files
export { default as NativeEventEmitter } from './vendor/react-native/EventEmitter/NativeEventEmitter.js'

// APIs
export { AccessibilityInfo } from './AccessibilityInfo/index.tsx'
export { Alert } from './Alert/index.tsx'
export { Appearance } from './Appearance/index.tsx'
export { AppRegistry } from './AppRegistry/index.tsx'
export { AppState } from './AppState/index.tsx'
export { BackHandler } from './BackHandler/index.tsx'
export { Clipboard } from './Clipboard/index.tsx'
export { DeviceEmitter, DeviceEmitter as DeviceEventEmitter } from './DeviceEmitter.ts'
export { DeviceInfo } from './DeviceInfo/index.tsx'
export { Dimensions } from './Dimensions/index.tsx'
export { I18nManager } from './I18nManager/index.tsx'
export { Keyboard } from './Keyboard/index.tsx'

export { Linking } from './Linking/index.tsx'
export { PanResponder } from './PanResponder/index.tsx'
export { PixelRatio } from './PixelRatio/index.tsx'
export { Share } from './Share/index.tsx'
export { Vibration } from './Vibration/index.tsx'

// implemented components
export { FlatList } from './FlatList.tsx'
export { SectionList } from './SectionList.tsx'
export { VirtualizedList } from './VirtualizedList.tsx'
export { TouchableNativeFeedback } from './TouchableNativeFeedback.tsx'

// unimplemented
export {
  UnimplementedView as DrawerLayoutAndroid,
  UnimplementedView as Switch,
  UnimplementedView as TouchableHighlight,
} from './UnimplementedView.tsx'

export { TouchableOpacity as Touchable, TouchableOpacity } from './TouchableOpacity.tsx'
export { TouchableWithoutFeedback } from './TouchableWithoutFeedback.tsx'

// components
export { ActivityIndicator } from './ActivityIndicator/index.tsx'
export { Image } from './Image/index.tsx'
export { ImageBackground } from './ImageBackground/index.tsx'
export { KeyboardAvoidingView } from './KeyboardAvoidingView/index.tsx'
export { LogBox } from './LogBox/index.tsx'
export { Modal } from './Modal/index.js'
export { Pressable } from './Pressable/index.tsx'
export { RefreshControl } from './RefreshControl/index.tsx'
export { SafeAreaView } from './SafeAreaView/index.tsx'
export { ScrollView } from './ScrollView/index.tsx'
export type { ScrollViewRef, ScrollViewMethods } from './ScrollView/index.tsx'
export { StatusBar } from './StatusBar/index.tsx'
export { Text } from './Text/index.tsx'
export { TextInput } from './TextInput/index.tsx'
export { View } from './View/index.tsx'

// hooks
export { useColorScheme } from './useColorScheme/index.tsx'
export { useLocaleContext } from './useLocaleContext/index.tsx'
export { useWindowDimensions } from './useWindowDimensions/index.tsx'

export function requireNativeComponent(name: string) {
  return function FakeComponent() {
    return null
  }
}

export const findNodeHandle = (component: any) => {
  throw new Error('not supported - use ref instead')
}

// compat with rn:

export { unstable_batchedUpdates } from 'react-dom'

export const RootTagContext = createContext(null)
