import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { hanzoguiPlugin } from '@hanzogui/vite-plugin'

// Hanzo Tasks admin app.
//
// Lives inside the gui workspace so the @hanzo/gui umbrella +
// @hanzogui/core + @hanzo/admin all resolve cleanly — @hanzo/gui from
// npm, @hanzo/admin via workspace:*. That's what lets the static
// extractor's bundled-config worker re-resolve those imports when it
// copies hanzogui.config.ts into the .hanzogui temp dir.
//
// Build target: a Vite SPA served from tasks.hanzo.ai. The base path
// /_/tasks/ matches what tasksd's Go server strips before delegating
// to the SPA shell, so deep links survive a reload through either
// the standalone deploy or any future embed.
//
// Static extractor MUST stay enabled. Without the resolved theme CSS,
// runtime getThemeProxied() throws "Missing theme" and renders blank.

const APP_VERSION = process.env.VITE_APP_VERSION ?? '2.49.0'

export default defineConfig({
  plugins: [
    hanzoguiPlugin({
      components: ['hanzogui'],
      // Absolute path — keeps the extractor from getting confused
      // when it copies the config into a `.hanzogui/` temp dir and
      // tries to re-resolve workspace deps from there.
      config: path.resolve(__dirname, 'gui.config.ts'),
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
      // Stop transitive react-native-svg from pulling fabric/codegen
      // native components (which try to import paths that don't exist
      // on react-native-web). Hanzo's shim is web-safe.
      'react-native-svg': '@hanzogui/react-native-svg',
    },
    // Pick the `source` export condition so unbuilt workspace packages
    // (e.g. `@hanzogui/admin`, which ships its TypeScript directly) load
    // from their `./src/index.ts` instead of an absent `./dist`.
    conditions: ['source', 'browser', 'module', 'import', 'default'],
    // Force every workspace package to resolve `@hanzo/gui` and the
    // @hanzogui/* primitives from THIS app's node_modules, not from
    // a sibling workspace's nested copy. Without dedupe the dev server
    // serves two parallel module graphs (one for admin-tasks, one
    // for @hanzo/admin), each with its own TamaguiProvider context
    // — children rendered through the @hanzo/admin Sidebar don't see
    // the provider mounted in admin-tasks's main.tsx, throw "Can't
    // find Hanzogui configuration", page goes blank.
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
    // Force ALL hanzogui packages through ONE pre-bundled ESM module
    // graph. Without this, the @hanzo/gui umbrella and direct
    // `@hanzogui/core` imports (e.g. via @hanzogui/lucide-icons-2 →
    // @hanzogui/helpers-icon → @hanzogui/core's Text) end up as
    // separate module instances. Each has its own React Context for
    // theme; the Provider sets ctx A, the <Text> in an icon reads
    // ctx B, useTheme returns null, render throws "no parent theme
    // context".
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
    port: 5174,
    proxy: {
      '/v1/tasks': 'http://127.0.0.1:7243',
    },
  },
})
