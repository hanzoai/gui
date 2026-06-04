// hanzo.app — the whole app, consumed as a published SDK. Brand from the
// bundled resolver (env/hostname); platform is the web default (no host prop).
import { createRoot } from 'react-dom/client';
import HanzoAI, { getBrand } from '@hanzo/ai';

createRoot(document.getElementById('root')!).render(
  <HanzoAI {...getBrand()} features={{ chat: true, wallet: true, agents: true }} />,
);
