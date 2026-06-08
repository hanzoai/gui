/// <reference types="vitest" />
// Test config for @hanzo/ai. Mirrors the web build's alias graph so app + net-*
// imports resolve, runs in jsdom, and stubs the streamdown markdown stack (same
// reason as the dev web build — esbuild can't resolve its nested micromark).
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const a = __dirname;
const h = (m: string) => `${a}/src/host/${m}`;
const p = (d: string) => resolve(__dirname, `../${d}/src`);

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': `${a}/src/app`,
      'libsodium-wrappers-sumo': resolve(__dirname, '../../node_modules/libsodium-wrappers-sumo/dist/modules-sumo/libsodium-wrappers.js'),
      'streamdown': `${a}/web/streamdown-stub.tsx`,
      '@streamdown/code': `${a}/web/streamdown-stub.tsx`,
      '@streamdown/math': `${a}/web/streamdown-stub.tsx`,
      '@streamdown/mermaid': `${a}/web/streamdown-stub.tsx`,
      '@tauri-apps/api/core': h('core'), '@tauri-apps/api/event': h('event'),
      '@tauri-apps/api/window': h('window'), '@tauri-apps/api/app': h('app'), '@tauri-apps/api': h('index'),
      '@tauri-apps/plugin-fs': h('fs'), '@tauri-apps/plugin-log': h('log'), '@tauri-apps/plugin-dialog': h('dialog'),
      '@tauri-apps/plugin-shell': h('shell'), '@tauri-apps/plugin-process': h('process'), '@tauri-apps/plugin-os': h('os'),
      '@tauri-apps/plugin-opener': h('opener'), '@tauri-apps/plugin-updater': h('updater'),
      '@tauri-apps/plugin-notification': h('notification'), '@tauri-apps/plugin-http': h('http'),
      '@hanzo_network/hanzo-ui': p('net-ui'), '@hanzo_network/hanzo-node-state': p('net-state'),
      '@hanzo_network/hanzo-i18n': p('net-i18n'), '@hanzo_network/hanzo-message-ts': p('net-message-ts'),
      '@hanzo_network/chain-config': p('net-chain-config'), '@hanzo_network/hanzo-logo': p('net-logo'),
      '@hanzo_network/hanzo-artifacts': p('net-artifacts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // pyodide pulls a 30MB wasm runtime and hits the network — skip in unit runs.
    exclude: ['**/node_modules/**', '**/dist/**', '**/*pyodide*', '**/python-code-runner/**'],
    testTimeout: 20000,
  },
});
