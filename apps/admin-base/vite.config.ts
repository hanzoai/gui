import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { guiPlugin } from '@hanzogui/vite-plugin'

// Hanzo Base admin SPA.
//
// Mirrors admin-tasks shape (same gui static-extractor pipeline,
// same dedupe list, same optimizeDeps include set). One way across
// every admin surface.
//
// Build target: a Vite SPA served from base.hanzo.ai under /_/. The
// base path /_/ matches what based's Go HTTP handler strips before
// delegating to the SPA shell, so deep links survive a reload.
//
// Static extractor MUST stay enabled. Without the resolved theme CSS,
// runtime getThemeProxied() throws "Missing theme" and renders blank.

const APP_VERSION = process.env.VITE_APP_VERSION ?? '0.4.0'

// Single mount-prefix knob shared with the server (`BASE_API_PREFIX`).
// Default `/v1`; team-go style multi-app deployments use `/v1/team`
// etc. The dev proxy forwards exactly this prefix to the Base origin.
const RAW_API_PREFIX = process.env.VITE_API_PREFIX ?? '/v1'
const API_PREFIX = '/' + RAW_API_PREFIX.replace(/^\/+|\/+$/g, '')

// IAM is a sibling mount at `/v1/iam` regardless of API_PREFIX, so
// proxy it separately. Override target via VITE_IAM_URL (defaults to
// VITE_BASE_URL — single host running both).
const BASE_TARGET = process.env.VITE_BASE_URL ?? 'http://localhost:8090'
const IAM_TARGET = process.env.VITE_IAM_URL ?? BASE_TARGET

export default defineConfig({
  plugins: [
    guiPlugin({
      components: ['gui'],
      config: path.resolve(__dirname, 'gui.config.ts'),
    }),
    react(),
  ],
  base: '/_/',
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(APP_VERSION),
    // Vite only auto-loads VITE_* vars from .env* files; CLI env passed
    // via process.env needs explicit forwarding so import.meta.env sees
    // it both in dev and in the //go:embed prod bundle.
    'import.meta.env.VITE_API_PREFIX': JSON.stringify(API_PREFIX),
    'import.meta.env.VITE_IAM_SERVER_URL': JSON.stringify(
      process.env.VITE_IAM_SERVER_URL ?? '',
    ),
    'import.meta.env.VITE_BRAND_NAME': JSON.stringify(
      process.env.VITE_BRAND_NAME ?? 'Hanzo Base',
    ),
    'import.meta.env.VITE_BRAND_SUBTITLE': JSON.stringify(
      process.env.VITE_BRAND_SUBTITLE ?? 'Self-Hosted',
    ),
    'import.meta.env.VITE_BRAND_MARK_URL': JSON.stringify(
      process.env.VITE_BRAND_MARK_URL ?? '',
    ),
    __DEV__: process.env.NODE_ENV !== 'production' ? 'true' : 'false',
    'process.env.GUI_TARGET': JSON.stringify('web'),
    'process.env.GUI_REACT_19': '"1"',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-svg': '@hanzogui/react-native-svg',
    },
    // Pick the `source` export condition so unbuilt workspace packages
    // (e.g. `@hanzogui/admin`, which ships its TypeScript directly) load
    // from their `./src/index.ts` instead of an absent `./dist`.
    conditions: ['source', 'browser', 'module', 'import', 'default'],
    dedupe: [
      'react',
      'react-dom',
      'react-native-web',
      'gui',
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
      'gui',
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
    port: 5173,
    proxy: {
      // IAM is always a fixed sibling at /v1/iam, even when the app
      // itself mounts at /v1/<app>. Configure it first so it takes
      // precedence over the app prefix proxy below.
      '/v1/iam': {
        target: IAM_TARGET,
        changeOrigin: true,
        ws: true,
      },
      [API_PREFIX]: {
        target: BASE_TARGET,
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
