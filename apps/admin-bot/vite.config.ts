import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { hanzoguiPlugin } from '@hanzogui/vite-plugin'

// Hanzo Bot admin app.
//
// Lives inside the gui workspace so the @hanzo/gui umbrella +
// @hanzogui/core + @hanzo/admin all resolve cleanly.
//
// Build target: a Vite SPA served at /_/bot/ by the hanzo-bot Node
// runtime (the bot is the Node-runtime exception to the Go binary
// contract — see ~/work/hanzo/HANZO_BINARY.md). The base path /_/bot/
// matches what Node's static handler strips before delegating to the
// SPA shell, so deep links survive a reload.
//
// Static extractor MUST stay enabled. Without the resolved theme CSS,
// runtime getThemeProxied() throws "Missing theme" and renders blank.

const APP_VERSION = process.env.VITE_APP_VERSION ?? '0.1.0'

export default defineConfig({
  plugins: [
    hanzoguiPlugin({
      components: ['hanzogui'],
      // Absolute path — keeps the extractor from getting confused
      // when it copies the config into a `.hanzogui/` temp dir.
      config: path.resolve(__dirname, 'hanzogui.config.ts'),
    }),
    react(),
  ],
  base: '/_/bot/',
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(APP_VERSION),
    __DEV__: process.env.NODE_ENV !== 'production' ? 'true' : 'false',
    'process.env.HANZOGUI_TARGET': JSON.stringify('web'),
    'process.env.HANZOGUI_REACT_19': '"1"',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-svg': '@hanzogui/react-native-svg',
    },
    dedupe: [
      'react',
      'react-dom',
      'react-native-web',
      'hanzogui',
      '@hanzogui/core',
      '@hanzogui/web',
      '@hanzogui/themes',
      '@hanzogui/use-element-layout',
    ],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react-native-web',
      'hanzogui',
      '@hanzogui/core',
      '@hanzogui/web',
      '@hanzogui/themes',
      '@hanzogui/helpers-icon',
      '@hanzogui/sizable-context',
      '@hanzogui/use-element-layout',
      '@hanzogui/lucide-icons-2',
    ],
    esbuildOptions: {
      resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
      loader: { '.js': 'jsx' },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    assetsInlineLimit: 16 * 1024,
    target: 'es2020',
  },
  server: {
    port: 5175,
    proxy: {
      '/v1/bot': 'http://127.0.0.1:18789',
    },
  },
})
