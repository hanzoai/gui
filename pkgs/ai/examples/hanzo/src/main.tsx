// hanzo-desktop — the entire app, as a thin shim over @hanzo/ai's DESKTOP build
// (real @tauri-apps native APIs; brand via VITE_BRAND=hanzo at build).
import { createRoot } from 'react-dom/client';
import HanzoAI, { getBrand } from '@hanzo/ai/desktop';

createRoot(document.getElementById('root')!).render(
  <HanzoAI {...getBrand()}
    features={{ chat: true, wallet: true, mining: true, tools: true, agents: true }}
  />,
);
