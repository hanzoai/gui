// hanzo.app — the whole app, consumed as a published SDK. Chain from the
// bundled resolver (env/hostname); platform is the web default (no host prop).
import { createRoot } from 'react-dom/client';
import HanzoAI, { getChain } from '@hanzo/ai';

createRoot(document.getElementById('root')!).render(
  <HanzoAI {...getChain()} features={{ chat: true, wallet: true, agents: true }} />,
);
