// The faces themselves. The kit names Zen in its font tokens; this is the one
// place the bytes are fetched, and without it every one of those names resolves
// to a fallback. Web entry only — native registers faces through expo-font.
import '@hanzo/font/css'
import { createRoot } from 'react-dom/client'

import App from './App'

// AppRegistry.registerComponent('main', () => App)
createRoot(document.querySelector('#root')!).render(<App />)
