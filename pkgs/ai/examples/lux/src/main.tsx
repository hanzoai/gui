// lux-desktop — the entire app, as a thin shim over @hanzo/ai's DESKTOP build
// (real @tauri-apps native APIs; chain via VITE_BRAND=lux at build).
import { createRoot } from 'react-dom/client';
import HanzoAI from '@hanzo/ai/desktop';
import { brandConfig } from './chain.config';

createRoot(document.getElementById('root')!).render(
  <HanzoAI {...brandConfig}
    features={{ chat: true, wallet: true, mining: true, tools: true, agents: true }}
  />,
);
