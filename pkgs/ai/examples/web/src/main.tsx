// hanzo.chat — the same app on the web. No host prop = web defaults.
import { createRoot } from 'react-dom/client';
import HanzoAI from '@hanzo/ai';
import brand from '@hanzo/brand';

createRoot(document.getElementById('root')!).render(
  <HanzoAI {...brand} features={{ chat: true, wallet: true, agents: true }} />,
);
