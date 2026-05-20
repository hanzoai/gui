// admin-auto-stub — minimal Vite scaffold for the @hanzogui/admin
// reference consumer. Mirrors apps/admin-base for one-way consistency.
//
// dev: `bun run dev` boots a Vite server at :5179 that proxies all
// non-/_/ paths to https://auto.hanzo.ai. The SPA itself is served
// under /_/ so deep links survive a reload.

import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { hanzoguiPlugin } from '@hanzogui/vite-plugin'

// Default: canonical Base instance at base.hanzo.ai. Override via
// VITE_BASE_TARGET for local Base servers (e.g. http://localhost:8090)
// or other deployments (auto.hanzo.ai, commerce.hanzo.ai, ...).
const TARGET = process.env.VITE_BASE_TARGET ?? 'https://base.hanzo.ai'

export default defineConfig({
  plugins: [
    hanzoguiPlugin({
      components: ['hanzogui'],
      config: path.resolve(__dirname, 'gui.config.ts'),
    }),
    react(),
  ],
  base: '/',
  define: {
    __DEV__: process.env.NODE_ENV !== 'production' ? 'true' : 'false',
    'process.env.HANZOGUI_TARGET': JSON.stringify('web'),
    'process.env.HANZOGUI_REACT_19': '"1"',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-svg': '@hanzogui/react-native-svg',
    },
    conditions: ['source', 'browser', 'module', 'import', 'default'],
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
    target: 'es2020',
  },
  server: {
    port: 5179,
    proxy: {
      // /v1/auto/* and /v1/iam/* go to auto.hanzo.ai so the dev server
      // looks identical to the deployed surface. Useful for verifying
      // the OIDC dance without copying a real bearer into localStorage.
      '/v1': {
        target: TARGET,
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
