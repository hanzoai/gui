// @hanzo/ai — the declarative props contract for the Hanzo AI app SDK.
//
// This is the canonical shape every brand passes to <HanzoAI {...brand} />.
// It is the SAME `BrandConfig` that lived in hanzoai/desktop's
// libs/brand-config, lifted into the SDK so brand becomes a *prop* (one
// way, one place) instead of a build-time `VITE_BRAND` env lookup.

export type Brand = string;

export interface BrandConfig {
  brand: Brand;
  name: string;
  productName: string;
  identifier: string; // bundle id, e.g. com.lux.desktop
  logo: { light: string; dark: string; favicon: string };
  /** Optional small-caps tagline under the onboarding logo. Empty/absent for
   *  every brand by default — set it per-brand to opt in. (Replaces the old
   *  hardcoded "the way, the truth, the life".) */
  tagline?: string;
  colors: { primary: string; bg: string; fg: string };
  hosts: string[];
  storeUrl: { mac: string; win: string; ios: string; android: string };
  network: {
    rpc: string;
    chainId: number;
    token: string;
    aiMiningPrecompile: `0x${string}`;
    blockExplorer: string;
  };
  overlayController: string;   // decentralized cloud overlay, e.g. edge.lux.cloud
  inferenceEndpoint: string;   // AI inference gateway, e.g. gateway.hanzo.ai
  iam: { baseUrl: string; clientId: string; redirectUri: string; callbackEvent: string };
}

/** Optional, host-shell-provided capabilities. On Tauri these are the native
 *  adapters; on plain web they degrade gracefully. Keeps the SDK shell-agnostic
 *  (the 44 Tauri-coupled files get routed through this instead of importing
 *  @tauri-apps directly). */
export interface HostAdapter {
  invoke?: (cmd: string, args?: unknown) => Promise<unknown>;
  listen?: (event: string, cb: (e: unknown) => void) => Promise<() => void>;
  platform?: 'tauri' | 'web' | 'expo';
}

export interface HanzoAIProps extends BrandConfig {
  /** SVG/logo component override (brand ships its own marks). */
  logo?: React.ComponentType<{ className?: string }> | string;
  /** Per-env cloud overrides (defaults derive from overlayController/inferenceEndpoint). */
  cloud?: { overlay?: string; inference?: string };
  /** Auth override (defaults derive from `iam`). */
  auth?: Partial<BrandConfig['iam']> & { provider?: 'iam' };
  /** Feature toggles. */
  features?: Partial<{
    chat: boolean; wallet: boolean; mining: boolean; tools: boolean;
    agents: boolean; vectorFs: boolean; machines: boolean;
  }>;
  /** i18n bundles. */
  i18n?: Record<string, unknown>;
  /** Native host adapter (Tauri/Expo). Omit for plain web. */
  host?: HostAdapter;
}
