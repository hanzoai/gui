import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { hanzoguiPlugin } from '@hanzogui/vite-plugin'

// Hanzo Agents admin app.
//
// Operator chrome: orgs, API keys, billing, observability. Lives
// alongside the existing 79k LOC product UI (workflow viz, react-flow
// editor, xterm console) inside the agentd binary. Different mount:
//   - product UI  → '/'        (web/client/dist)
//   - admin chrome → '/_/agents/' (admin/dist, this app)
//
// Static extractor MUST stay enabled. Without the resolved theme CSS,
// runtime getThemeProxied() throws "Missing theme" and renders blank.

const APP_VERSION = process.env.VITE_APP_VERSION ?? '0.1.0'

export default defineConfig({
  plugins: [
    hanzoguiPlugin({
      components: ['hanzogui'],
      config: path.resolve(__dirname, 'hanzogui.config.ts'),
    }),
    react(),
  ],
  base: '/_/agents/',
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(APP_VERSION),
    __DEV__: process.env.NODE_ENV !== 'production' ? 'true' : 'false',
    'process.env.HANZOGUI_TARGET': JSON.stringify('web'),
    'process.env.HANZOGUI_REACT_19': '"1"',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      // Stop transitive react-native-svg from pulling fabric/codegen
      // native components (which try to import paths that don't exist
      // on react-native-web). Hanzo's shim is web-safe — same alias
      // admin-tasks uses.
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
      '/v1/agents': 'http://127.0.0.1:8080',
    },
  },
})
