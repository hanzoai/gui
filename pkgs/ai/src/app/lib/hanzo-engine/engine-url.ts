/**
 * Resolve the local inference engine base URL for the active brand.
 *
 * ONE place that maps brand → native engine URL. Each app runs its own engine
 * on its own port (hanzo 36900 / zoo 36910 / lux 36920); the port is declared
 * in the brand config (`node.enginePort`) — never hardcoded in the rendered
 * flow. Falls back to `ENGINE_BASE_URL` (VITE override / 36900) when a brand
 * config without a `node` block is injected (e.g. an older built app copy).
 */
import { getBrand } from '@hanzo_network/brand-config';

import { ENGINE_BASE_URL } from './client';

/** Native engine base URL (chat completions), e.g. http://127.0.0.1:36920. */
export function getEngineUrl(): string {
  try {
    const port = getBrand().node?.enginePort;
    if (port) return `http://127.0.0.1:${port}`;
  } catch {
    // No brand injected yet — fall through to the static default.
  }
  return ENGINE_BASE_URL;
}

/** Native embeddings engine base URL (embed engine = enginePort + 1). */
export function getEmbeddingEngineUrl(): string {
  try {
    const port = getBrand().node?.enginePort;
    if (port) return `http://127.0.0.1:${port + 1}`;
  } catch {
    // No brand injected yet — fall through.
  }
  return ENGINE_BASE_URL;
}

/**
 * Native node-daemon API base URL for the active brand, e.g.
 * http://127.0.0.1:9630 (hanzo 3690 / zoo 2000 / lux 9630 via `node.apiPort`).
 * THE single brand-derived default for an absent auth node_address — replaces
 * the hardcoded `http://localhost:3690` fallbacks that pinned every brand to
 * hanzo's port.
 */
export function getNodeUrl(): string {
  try {
    const port = getBrand().node?.apiPort;
    if (port) return `http://127.0.0.1:${port}`;
  } catch {
    // No brand injected yet — fall through to the static default.
  }
  return 'http://127.0.0.1:3690';
}
