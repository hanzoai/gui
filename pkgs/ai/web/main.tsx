// hanzo.chat / hanzo.app — the web entry. The SAME @hanzo/ai surface that
// ships to desktop (Tauri) and mobile (Expo); here the host stays the web
// default. Brand comes from env/hostname via getBrand() (VITE_BRAND or the
// hanzo/zoo/lux domain), spread as props — one way, one place.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HanzoAI } from '../src/index';
import { getBrand } from '@hanzo_network/brand-config';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  render() {
    if (this.state.err) {
      return React.createElement('pre', {
        style: { color: '#f66', background: '#111', padding: 16, font: '12px ui-monospace,monospace',
                 whiteSpace: 'pre-wrap', height: '100vh', margin: 0, overflow: 'auto' },
      }, String(this.state.err.stack || this.state.err.message));
    }
    return this.props.children;
  }
}

const brand = getBrand();
// Per-brand document title + favicon (index.html ships a generic default).
document.title = brand.productName || brand.name;
if (brand.logo?.favicon) {
  const link =
    document.querySelector<HTMLLinkElement>('link[rel~="icon"]') ??
    (document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon' })) as HTMLLinkElement);
  link.href = brand.logo.favicon;
}

createRoot(document.getElementById('root')!).render(
  React.createElement(ErrorBoundary, null,
    React.createElement(HanzoAI, { ...brand, features: { chat: true, wallet: true, agents: true } })),
);
