// ensure gui config is created before any component imports
import './src/gui.config'

// setup native features - just import, no function calls needed
import '@hanzogui/native/setup-zeego'
import '@hanzogui/native/setup-teleport'
import '@hanzogui/native/setup-gesture-handler'
// import '@hanzogui/native/setup-safe-area'
import '@hanzogui/native/setup-keyboard-controller'
// TODO this causes crash on Select demo?
// import '@hanzogui/native/setup-burnt'

import { registerRootComponent } from 'expo'

const App = require('./src/App').default

registerRootComponent(() => <App />)
