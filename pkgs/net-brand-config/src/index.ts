// Brand-neutral brand registry + injection.
//
// This package bundles NO brands. Every host app supplies its own BrandConfig:
//   • desktop (single brand): <HanzoAI {...brandConfig}/> (injects via setBrand)
//   • web (multi-tenant):     registerBrands([...]) then resolve by hostname
//
// Adding a brand is a config object in the host app — zero edits here. Nothing
// is hardcoded to any one brand (no 'hanzo'|'zoo'|'lux' union, no presets).

/** Open brand id, e.g. 'hanzo' | 'zoo' | 'lux' | '<your-brand>'. */
export type Brand = string;

export interface BrandConfig {
  brand: Brand;
  name: string;
  productName: string;
  /** Legal / company name. */
  company: string;
  identifier: string;
  logo: { light: string; dark: string; favicon: string };
  colors: { primary: string; bg: string; fg: string };
  hosts: string[];
  storeUrl: { mac: string; win: string; ios: string; android: string };
  // Native chain identity. RPC submits AI-mining proof to the precompile
  // (aiMining at 0x0300...0000 on the brand's primary EVM/A-chain).
  network: {
    rpc: string;
    chainId: number;
    token: string;
    aiMiningPrecompile: `0x${string}`;
    blockExplorer: string;
  };
  // Decentralized cloud overlay (zero-trust edge controller).
  overlayController: string;
  // Cloud AI inference endpoint (chat completions / embeddings).
  inferenceEndpoint: string;
  // OAuth IAM provider used by "Login with <Brand>".
  iam: {
    baseUrl: string;
    clientId: string;
    redirectUri: string;
    callbackEvent: string;
  };
  /**
   * Whether the Machines / Containers / K8s / Network pages render. Config-
   * driven (no hardcoded brand check); falls back to VITE_ENABLE_MACHINES.
   */
  machinesEnabled?: boolean;
  /**
   * On-device node daemon (hanzod/zood/luxd) + local inference engine ports.
   * THE single source of truth for the localhost node address — every frontend
   * localhost node/engine URL derives from here so each app runs its own node on
   * its own port (no hardcoded :3690/:9850/:4000). ws/p2p/https/zap = apiPort+1..+4;
   * embed engine = enginePort+1. Optional for back-compat with already-built apps.
   */
  node?: {
    apiPort: number; // node HTTP API — hanzod 3690, zood 2000, luxd 9630
    enginePort: number; // local inference engine (chat completions)
  };
}

// --- registry (multi-tenant / hostname resolution) -------------------------
const _registry: BrandConfig[] = [];

/** Register brands for hostname/env resolution (web multi-tenant hosts). */
export function registerBrands(brands: BrandConfig[]): void {
  for (const b of brands) {
    if (!_registry.some((r) => r.brand === b.brand)) _registry.push(b);
  }
}

export function getBrandFromHostname(h: string): BrandConfig | undefined {
  const host = h.toLowerCase();
  return _registry.find((c) =>
    c.hosts.some((d) => host === d || host.endsWith('.' + d)),
  );
}

// --- injection (single-brand desktop) --------------------------------------
//
// <HanzoAI {...brandConfig}/> calls setBrand(brandConfig) once, synchronously,
// before the app tree mounts. Call sites then read it via useBrand() / getBrand()
// — a PLAIN module getter, NOT a React hook (it is called from module scope,
// utils and event handlers, so it must never touch a hook).
let _injected: BrandConfig | null = null;

/** Inject the active brand (called by <HanzoAI> before mount). */
export function setBrand(b: BrandConfig): void {
  _injected = b;
}

function envVar(key: string): string | undefined {
  const env =
    typeof import.meta !== 'undefined'
      ? (import.meta as ImportMeta & {
          env?: Record<string, string | undefined>;
        }).env
      : undefined;
  return env ? env[key] : undefined;
}

/** Read the active brand: injected prop, else env/hostname via the registry. */
export function getBrand(): BrandConfig {
  if (_injected) return _injected;
  const viteBrand = envVar('VITE_BRAND');
  if (viteBrand) {
    const byId = _registry.find((c) => c.brand === viteBrand);
    if (byId) return byId;
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const byHost = getBrandFromHostname(window.location.hostname);
    if (byHost) return byHost;
  }
  if (_registry.length) return _registry[0];
  throw new Error(
    'No brand configured. Pass <HanzoAI {...brandConfig}/> (desktop) or call ' +
      'registerBrands([...]) before reading the brand (web).',
  );
}

export function useBrand(): BrandConfig {
  return getBrand();
}

export function isMachinesEnabled(cfg: BrandConfig = getBrand()): boolean {
  if (typeof cfg.machinesEnabled === 'boolean') return cfg.machinesEnabled;
  const flag = envVar('VITE_ENABLE_MACHINES');
  return flag === 'true' || flag === '1';
}
