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

module.exports.Platform = proxy.Platform
module.exports.StyleSheet = proxy.StyleSheet
module.exports.Image = proxy.Image
module.exports.View = proxy.View
module.exports.Text = proxy.Text
module.exports.TextInput = proxy.TextInput
module.exports.ScrollView = proxy.ScrollView
module.exports.Dimensions = proxy.Dimensions
module.exports.Pressable = proxy.Pressable
module.exports.Animated = proxy.Animated
module.exports.Easing = proxy.Easing
module.exports.Appearance = proxy.Appearance
module.exports.findNodeHandle = proxy.findNodeHandle
module.exports.unstable_batchedUpdates = proxy.unstable_batchedUpdates

module.exports = proxy; module.exports.default = proxy
