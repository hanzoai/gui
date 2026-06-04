// zoo-desktop — the entire app, as a thin shim over @hanzo/ai. Decomplected:
//   • brand    = a build axis  (VITE_BRAND=zoo → getBrand() returns the zoo config)
//   • platform = an injected prop (host={tauriHost})
//   • app      = @hanzo/ai (one surface; web/desktop/mobile share it)
// To use a published brand package instead of VITE_BRAND, spread it as props:
//   import brand from '@zooai/brand'; <HanzoAI {...brand} host={tauriHost}/>
import { createRoot } from 'react-dom/client';
import HanzoAI, { getBrand } from '@hanzo/ai';
import { tauriHost } from '../../tauri-host';

createRoot(document.getElementById('root')!).render(
  <HanzoAI {...getBrand()}
    host={tauriHost}
    features={{ chat: true, wallet: true, mining: true, tools: true, agents: true }}
  />,
);
