import { getBrand } from '@hanzo_network/brand-config';

import config from '../config';

/** Brand store URL. Dev → local store; otherwise brand-driven (links.store),
 *  then the VITE_HANZO_STORE_URL env override, then the hanzo.ai default. A
 *  getter (not a module-eval const) so getBrand() runs after brand injection. */
export const storeUrl = (): string => {
  if (config.isDev) return 'http://localhost:3000';
  return (
    getBrand().links?.store ||
    import.meta.env.VITE_HANZO_STORE_URL ||
    'https://store.hanzo.ai'
  );
};
