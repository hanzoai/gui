// hanzo.chat — same @hanzo/ai surface on web. With error surfacing for debug.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HanzoAI } from '../src/index';
import { getBrand } from '@hanzo_network/brand-config';

function show(msg: string) {
  const el = document.getElementById('root')!;
  el.innerHTML = '<pre style="color:#ff6b6b;background:#111;padding:20px;font:12px monospace;white-space:pre-wrap;overflow:auto;height:100vh;margin:0">'
    + msg.replace(/</g,'&lt;') + '</pre>';
}
window.addEventListener('error', (e) => show('window.error: ' + e.message + '\n' + (e.error?.stack || '')));
window.addEventListener('unhandledrejection', (e) => show('unhandledrejection: ' + (e.reason?.stack || e.reason)));

class EB extends React.Component<{children: React.ReactNode}, {e?: Error}> {
  state: {e?: Error} = {};
  static getDerivedStateFromError(e: Error) { return { e }; }
  render() { return this.state.e ? show('React render error:\n' + this.state.e.stack) as unknown as null
    : this.props.children; }
}

try {
  createRoot(document.getElementById('root')!).render(
    <EB><HanzoAI {...getBrand()} features={{ chat: true, wallet: true, agents: true }} /></EB>,
  );
} catch (e) { show('mount error:\n' + (e as Error).stack); }
