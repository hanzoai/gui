import { GuiProvider } from 'hanzogui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import guiConfig from '../gui.config'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GuiProvider config={guiConfig} defaultTheme="dark">
      <App />
    </GuiProvider>
  </StrictMode>
)
