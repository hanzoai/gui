// ensure hanzogui config is created before any component imports
require('./src/hanzogui.config')

// setup native features - just import, no function calls needed
import '@hanzogui/native/setup-zeego'
import '@hanzogui/native/setup-teleport'
import '@hanzogui/native/setup-gesture-handler'
// import '@hanzogui/native/setup-safe-area'
import '@hanzogui/native/setup-keyboard-controller'
import '@hanzogui/native/setup-burnt'

import { registerRootComponent } from 'expo'

const App = require('./src/App').default

registerRootComponent(() => <App />)
