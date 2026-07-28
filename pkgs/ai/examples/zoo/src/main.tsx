// zoo-desktop — the entire app, as a thin shim over @hanzo/app's DESKTOP build
// (real @tauri-apps native APIs; brand via VITE_BRAND=zoo at build).
import { createRoot } from 'react-dom/client';
import HanzoAI from '@hanzo/app/desktop';
import { brandConfig } from './brand.config';

createRoot(document.getElementById('root')!).render(
  <HanzoAI {...brandConfig}
    features={{ chat: true, wallet: true, mining: true, tools: true, agents: true }}
  />,
);
