const emptyComponent = () => null

function proxyWorm() {
  // Target MUST be a function for the apply trap to work.
  // Without this, codegenNativeComponent() throws "proxy is not a function".
  const target = Object.assign(function() { return emptyComponent }, {
    StyleSheet: { create(s) { return s }, flatten(s) { return s } },
    Platform: { OS: 'web', select: (o) => o.web ?? o.default },
    Image: emptyComponent,
    View: emptyComponent,
    Text: emptyComponent,
    TextInput: emptyComponent,
    ScrollView: emptyComponent,
    Dimensions: { addEventListener() {}, get() { return { width: 0, height: 0 } } },
    Appearance: {
      getColorScheme: () => 'light',
      addChangeListener: () => {},
      removeChangeListener: () => {},
    },
    addPoolingTo() {},
  })

  return new Proxy(target, {
    get(target, key) {
      return Reflect.get(target, key) || proxyWorm()
    },
    apply() {
      return proxyWorm()
    },
  })
}

const proxy = proxyWorm()

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
export const Touchable = proxy.Touchable
export const TurboModuleRegistry = proxy.TurboModuleRegistry
export const NativeEventEmitter = proxy.NativeEventEmitter
export const processColor = proxy.processColor
export const PanResponder = proxy.PanResponder
export const PixelRatio = proxy.PixelRatio
export const AppRegistry = proxy.AppRegistry
export const NativeModules = proxy.NativeModules
export const Linking = proxy.Linking
export const Alert = proxy.Alert
export const AppState = proxy.AppState
export const LogBox = proxy.LogBox

export default proxy
