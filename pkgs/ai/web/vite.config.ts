import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
const a = resolve(__dirname, '..');           // pkgs/ai
const h = (m: string) => `${a}/src/host/${m}`;
const p = (d: string) => resolve(__dirname, `../../${d}/src`);
export default defineConfig(({ command }) => ({
  root: __dirname,
  plugins: [react()],
  worker: { format: 'es' },
  server: {
    port: 1500, strictPort: true, host: '0.0.0.0',
    // Same-origin proxy to a hanzo-node API so the browser avoids CORS: the app
    // talks to its own origin (nodeAddress = http://<host>:1500) and vite
    // forwards /v2 + /ws to the node. Point VITE_NODE_API/VITE_NODE_WS at a
    // healthy node; the node is already wired to the zen engine (agent
    // `zen_engine` -> http://localhost:36900, embeddings -> :36901/:11436).
    proxy: {
      '/v1': { target: process.env.VITE_NODE_API || 'http://127.0.0.1:3700', changeOrigin: true },
      '/v2': { target: process.env.VITE_NODE_API || 'http://127.0.0.1:3700', changeOrigin: true },
      '/ws': { target: process.env.VITE_NODE_WS || 'ws://127.0.0.1:3701', ws: true, changeOrigin: true },
      // The hanzo-engine client (lib/hanzo-engine) fetches the engine directly;
      // on web that's cross-origin → CORS. Route it same-origin via the proxy.
      // Set VITE_ENGINE_BASE_URL=/engine-api for the web build.
      '/engine-api': {
        target: process.env.VITE_ENGINE_API || 'http://127.0.0.1:36906',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/engine-api/, ''),
      },
    },
  },
  build: { outDir: 'dist', minify: 'esbuild', chunkSizeWarningLimit: 8000, rollupOptions: { onwarn(w,d){ if(w.code==='MODULE_LEVEL_DIRECTIVE')return; d(w);} } },
  optimizeDeps: {
    include: ['react','react-dom','react-dom/client','react/jsx-runtime','libsodium-wrappers-sumo','@tanstack/react-query','lucide-react','zustand'],
    exclude: ['pyodide'],
    esbuildOptions: { jsx: 'automatic' },
  },
  resolve: { dedupe: ['react','react-dom'], alias: {
    'libsodium-wrappers-sumo': resolve(a, '../../node_modules/libsodium-wrappers-sumo/dist/modules-sumo/libsodium-wrappers.js'),
    // DEV-only (command === 'serve'): stub the streamdown markdown stack (see
    // streamdown-stub.tsx). The prod build (rollup) skips these and uses the
    // real packages, resolving their nested micromark correctly.
    ...(command === 'serve'
      ? {
          'streamdown': `${__dirname}/streamdown-stub.tsx`,
          '@streamdown/code': `${__dirname}/streamdown-stub.tsx`,
          '@streamdown/math': `${__dirname}/streamdown-stub.tsx`,
          '@streamdown/mermaid': `${__dirname}/streamdown-stub.tsx`,
        }
      : {}),
    '@': `${a}/src/app`,
    '@tauri-apps/api/core': h('core'), '@tauri-apps/api/event': h('event'),
    '@tauri-apps/api/window': h('window'), '@tauri-apps/api/app': h('app'), '@tauri-apps/api': h('index'),
    '@tauri-apps/plugin-fs': h('fs'), '@tauri-apps/plugin-log': h('log'), '@tauri-apps/plugin-dialog': h('dialog'),
    '@tauri-apps/plugin-shell': h('shell'), '@tauri-apps/plugin-process': h('process'), '@tauri-apps/plugin-os': h('os'),
    '@tauri-apps/plugin-opener': h('opener'), '@tauri-apps/plugin-updater': h('updater'),
    '@tauri-apps/plugin-notification': h('notification'), '@tauri-apps/plugin-http': h('http'),
    '@hanzo_network/hanzo-ui': p('net-ui'), '@hanzo_network/hanzo-node-state': p('net-state'),
    '@hanzo_network/hanzo-i18n': p('net-i18n'), '@hanzo_network/hanzo-message-ts': p('net-message-ts'),
    '@hanzo_network/brand-config': p('net-brand-config'), '@hanzo_network/hanzo-logo': p('net-logo'),
    '@hanzo_network/hanzo-artifacts': p('net-artifacts'),
  }},
}));
