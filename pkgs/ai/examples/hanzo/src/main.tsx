// hanzo-desktop — the entire app. Brand is a prop; platform is an injected host.
import { createRoot } from 'react-dom/client';
import HanzoAI from '@hanzo/ai';
import brand from '@hanzo/brand';
import { tauriHost } from '../../tauri-host';

createRoot(document.getElementById('root')!).render(
  <HanzoAI {...brand}
    host={tauriHost}
    features={{ chat: true, wallet: true, mining: true, tools: true, agents: true }}
  />,
);
