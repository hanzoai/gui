// ensure tamagui config is created before any component imports
import './src/tamagui.config'

// setup native features - just import, no function calls needed
import '@hanzo/gui-native/setup-zeego'
import '@hanzo/gui-native/setup-teleport'
import '@hanzo/gui-native/setup-gesture-handler'
// import '@hanzo/gui-native/setup-safe-area'
import '@hanzo/gui-native/setup-keyboard-controller'
// TODO this causes crash on Select demo?
// import '@hanzo/gui-native/setup-burnt'

import { registerRootComponent } from 'expo'

const App = require('./src/App').default

registerRootComponent(() => <App />)
