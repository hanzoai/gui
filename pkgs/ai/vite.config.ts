// @hanzo/ai build — library mode. The key move: alias every @tauri-apps/*
// module to the injectable host shim, so the migrated app's 48 native
// import sites resolve to web/tauri/expo-agnostic code with ZERO source
// edits. Platform becomes an injected prop (<HanzoAI host={...}/>), not a
// hard dependency — the same app surface ships to hanzo.chat / hanzo.app /
// mobile / desktop.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const h = (m: string) => resolve(__dirname, `src/host/${m}`);
const tauriAlias = {
  '@tauri-apps/api/core': h('core'),
  '@tauri-apps/api/event': h('event'),
  '@tauri-apps/api/window': h('window'),
  '@tauri-apps/api/app': h('app'),
  '@tauri-apps/api': h('index'),
  '@tauri-apps/plugin-fs': h('fs'),
  '@tauri-apps/plugin-log': h('log'),
  '@tauri-apps/plugin-dialog': h('dialog'),
  '@tauri-apps/plugin-shell': h('shell'),
  '@tauri-apps/plugin-process': h('process'),
  '@tauri-apps/plugin-os': h('os'),
  '@tauri-apps/plugin-opener': h('opener'),
  '@tauri-apps/plugin-updater': h('updater'),
  '@tauri-apps/plugin-notification': h('notification'),
  '@tauri-apps/plugin-http': h('http'),
};

// Resolve the migrated @hanzo_network/* libs to their src so Vite handles
// subpaths/dirs/extensions naturally (instead of strict exports maps).
const p = (d: string) => resolve(__dirname, `../${d}/src`);
const libAlias = {
  '@hanzo_network/hanzo-ui': p('net-ui'),
  '@hanzo_network/hanzo-node-state': p('net-state'),
  '@hanzo_network/hanzo-i18n': p('net-i18n'),
  '@hanzo_network/hanzo-message-ts': p('net-message-ts'),
  '@hanzo_network/brand-config': p('net-brand-config'),
  '@hanzo_network/hanzo-logo': p('net-logo'),
  '@hanzo_network/hanzo-artifacts': p('net-artifacts'),
};

export default defineConfig({
  plugins: [react()],
  worker: { format: 'es' },
  resolve: { alias: { '@': resolve(__dirname, 'src/app'), ...tauriAlias, ...libAlias }, dedupe: ['react','react-dom'] },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['es', 'cjs'],
      fileName: (f) => (f === 'es' ? 'index.js' : 'index.cjs'),
    },
    // Library build: externalize every npm dep (the consuming web/desktop
    // shim bundles them). Only @hanzo/ai's own source + the moved app + the
    // net-* libs (aliases rewrite those to absolute paths) get bundled.
    rollupOptions: {
      external: (id: string) =>
        !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0') && !/^[A-Za-z]:[\\/]/.test(id),
    },
  },
});
