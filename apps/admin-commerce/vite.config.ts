import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { hanzoguiPlugin } from '@hanzogui/vite-plugin'

// Hanzo Commerce admin app.
//
// Ships as a Vite SPA at admin.commerce.hanzo.ai (and embedded in
// commerced at /_/commerce/ui/). React Router uses basename
// "/_/commerce/ui" so deep links survive a refresh through either
// the standalone deploy or the in-binary embed.

const APP_VERSION = process.env.VITE_APP_VERSION ?? '1.38.0'

export default defineConfig({
  plugins: [
    hanzoguiPlugin({
      components: ['hanzogui'],
      config: path.resolve(__dirname, 'hanzogui.config.ts'),
    }),
    react(),
  ],
  base: '/_/commerce/ui/',
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
      '/v1/commerce': 'http://127.0.0.1:8090',
    },
  },
})
