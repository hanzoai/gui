import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Minimal Tamagui-on-web wiring: hanzogui's `browser`/`module` export already
// resolves to its web build (react-native pre-swapped), so we only need the
// React plugin, the env defines the runtime reads, and the RN→web alias for any
// transitive `react-native` import.
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.TAMAGUI_TARGET': JSON.stringify('web'),
    'process.env.GUI_TARGET': JSON.stringify('web'),
  },
  resolve: {
    alias: {
      'react-native': '@hanzogui/react-native-web-lite',
    },
  },
  // Tauri: fixed port, no clearScreen so cargo sees Vite logs.
  clearScreen: false,
  server: { port: 5175, strictPort: true },
})
