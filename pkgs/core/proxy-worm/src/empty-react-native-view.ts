import { View } from 'react-native'

export default new Proxy(
  {
    get default() {
      return View
    },
  },
  {
    get(_, key) {
      return key === 'createAnimatedComponent' ? (x: unknown) => x : View
    },
  }
)
