import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { hanzoguiPlugin } from '@hanzogui/vite-plugin'

// Hanzo Tasks admin app.
//
// Lives inside the gui workspace so hanzogui umbrella + @hanzogui/core
// + @hanzogui/admin all resolve via workspace:* — that's what lets the
// static extractor's bundled-config worker re-resolve those imports
// when it copies hanzogui.config.ts into the .hanzogui temp dir.
//
// Build target: a Vite SPA served from tasks.hanzo.ai. The base path
// /_/tasks/ matches what tasksd's Go server strips before delegating
// to the SPA shell, so deep links survive a reload through either
// the standalone deploy or any future embed.
//
// Static extractor MUST stay enabled. Without the resolved theme CSS,
// runtime getThemeProxied() throws "Missing theme" and renders blank.

const APP_VERSION = process.env.VITE_APP_VERSION ?? '2.45.3'

export default defineConfig({
  plugins: [
    hanzoguiPlugin({
      components: ['hanzogui'],
      // Absolute path — keeps the extractor from getting confused
      // when it copies the config into a `.hanzogui/` temp dir and
      // tries to re-resolve workspace deps from there.
      config: path.resolve(__dirname, 'hanzogui.config.ts'),
      // Extraction is required for production. If the temp-dir
      // workspace-resolution still bites, we'll inline a stub at
      // build time, never disable.
    }),
    react(),
  ],
  base: '/_/tasks/',
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(APP_VERSION),
    __DEV__: process.env.NODE_ENV !== 'production' ? 'true' : 'false',
    'process.env.HANZOGUI_TARGET': JSON.stringify('web'),
    'process.env.HANZOGUI_REACT_19': '"1"',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    // Force every workspace package to resolve `hanzogui` and the
    // @hanzogui/* primitives from THIS app's node_modules, not from
    // a sibling workspace's nested copy. Without dedupe the dev server
    // serves two parallel hanzogui module graphs (one for admin-tasks,
    // one for @hanzogui/admin), each with its own TamaguiProvider
    // context — children rendered through the @hanzogui/admin Sidebar
    // don't see the provider mounted in admin-tasks's main.tsx, throw
    // "Can't find Hanzogui configuration", page goes blank.
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
    include: ['react', 'react-dom', 'react-native-web', 'hanzogui'],
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
    port: 5174,
    proxy: {
      '/v1/tasks': 'http://127.0.0.1:7243',
    },
  },
})
