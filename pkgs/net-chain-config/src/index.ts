// Chain-neutral chain registry + injection.
//
// This package bundles NO brands. Every host app supplies its own ChainConfig:
//   • desktop (single chain): <HanzoAI {...brandConfig}/> (injects via setChain)
//   • web (multi-tenant):     registerBrands([...]) then resolve by hostname
//
// Adding a chain is a config object in the host app — zero edits here. Nothing
// is hardcoded to any one chain (no 'hanzo'|'zoo'|'lux' union, no presets).

/** Open chain id, e.g. 'hanzo' | 'zoo' | 'lux' | '<your-chain>'. */
export type Chain = string;

export interface ChainConfig {
  chain: Chain;
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
  // (aiMining at 0x0300...0000 on the chain's primary EVM/A-chain).
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
  // OAuth IAM provider used by "Login with <Chain>".
  iam: {
    baseUrl: string;
    clientId: string;
    redirectUri: string;
    callbackEvent: string;
  };
  /**
   * Whether the Machines / Containers / K8s / Network pages render. Config-
   * driven (no hardcoded chain check); falls back to VITE_ENABLE_MACHINES.
   */
  machinesEnabled?: boolean;
}

// --- registry (multi-tenant / hostname resolution) -------------------------
const _registry: ChainConfig[] = [];

/** Register brands for hostname/env resolution (web multi-tenant hosts). */
export function registerBrands(brands: ChainConfig[]): void {
  for (const b of brands) {
    if (!_registry.some((r) => r.chain === b.chain)) _registry.push(b);
  }
}

export function getChainFromHostname(h: string): ChainConfig | undefined {
  const host = h.toLowerCase();
  return _registry.find((c) =>
    c.hosts.some((d) => host === d || host.endsWith('.' + d)),
  );
}

// --- injection (single-chain desktop) --------------------------------------
//
// <HanzoAI {...brandConfig}/> calls setChain(brandConfig) once, synchronously,
// before the app tree mounts. Call sites then read it via useChain() / getChain()
// — a PLAIN module getter, NOT a React hook (it is called from module scope,
// utils and event handlers, so it must never touch a hook).
// Stored on globalThis, NOT a module-level `let`. Rollup/vite can DUPLICATE a
// small module across output chunks; a module-level `let` then has two copies
// (setChain writes one, getChain reads the other → null → getChain throws →
// BLANK app). A globalThis key is a true cross-chunk singleton.
const CHAIN_KEY = '__hanzoNetworkInjectedChain__';
type ChainGlobal = typeof globalThis & { [CHAIN_KEY]?: ChainConfig | null };

/** Inject the active chain (called by <HanzoAI> before mount). */
export function setChain(b: ChainConfig): void {
  (globalThis as ChainGlobal)[CHAIN_KEY] = b;
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

/** Read the active chain: injected prop, else env/hostname via the registry. */
export function getChain(): ChainConfig {
  const _injected = (globalThis as ChainGlobal)[CHAIN_KEY];
  if (_injected) return _injected;
  const viteBrand = envVar('VITE_BRAND');
  if (viteBrand) {
    const byId = _registry.find((c) => c.chain === viteBrand);
    if (byId) return byId;
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const byHost = getChainFromHostname(window.location.hostname);
    if (byHost) return byHost;
  }
  if (_registry.length) return _registry[0];
  throw new Error(
    'No chain configured. Pass <HanzoAI {...brandConfig}/> (desktop) or call ' +
      'registerBrands([...]) before reading the chain (web).',
  );
}

export function useChain(): ChainConfig {
  return getChain();
}

export function isMachinesEnabled(cfg: ChainConfig = getChain()): boolean {
  if (typeof cfg.machinesEnabled === 'boolean') return cfg.machinesEnabled;
  const flag = envVar('VITE_ENABLE_MACHINES');
  return flag === 'true' || flag === '1';
}

// --- built-in chain presets (desktop shims: <HanzoAI {...getChainByName('lux')}/>) ---
// Convenience presets so a thin desktop shim needs no separate config package.
// Custom chains still flow in as props or via registerBrands(); these add nothing
// to the chain-neutral core above.
const HANZO: ChainConfig = {
  chain: 'hanzo', name: 'Hanzo', productName: 'Hanzo Desktop', company: 'Hanzo AI, Inc.',
  identifier: 'com.hanzo.desktop',
  logo: { light: 'libs/hanzo-logo/assets/hanzo/hanzo-logo.svg', dark: 'libs/hanzo-logo/assets/hanzo/hanzo-logo.svg', favicon: 'libs/hanzo-logo/assets/hanzo/hanzo-icon.svg' },
  colors: { primary: '#000000', bg: '#000000', fg: '#ffffff' },
  hosts: ['hanzo.ai', 'hanzo.network'],
  storeUrl: { mac: 'https://github.com/hanzoai/desktop/releases/latest', win: 'https://github.com/hanzoai/desktop/releases/latest', ios: '', android: '' },
  network: { rpc: 'https://rpc.hanzo.network', chainId: 36900, token: '$AI', aiMiningPrecompile: '0x0300000000000000000000000000000000000000', blockExplorer: 'https://explorer.hanzo.network' },
  overlayController: 'https://edge.hanzo.network', inferenceEndpoint: 'https://gateway.hanzo.ai',
  iam: { baseUrl: 'https://hanzo.id', clientId: 'hanzo-app-client-id', redirectUri: 'hanzo://oauth/hanzo', callbackEvent: 'hanzo-iam-callback' },
  machinesEnabled: true,
};
const ZOO: ChainConfig = {
  chain: 'zoo', name: 'Zoo', productName: 'Zoo Desktop', company: 'Zoo Labs, Inc.',
  identifier: 'com.zoo.desktop',
  logo: { light: 'libs/hanzo-logo/assets/zoo/zoo-logo.svg', dark: 'libs/hanzo-logo/assets/zoo/zoo-logo.svg', favicon: 'libs/hanzo-logo/assets/zoo/zoo-icon.svg' },
  colors: { primary: '#000000', bg: '#000000', fg: '#ffffff' },
  hosts: ['zoo.ngo', 'zoo.network', 'zoo.cloud'],
  storeUrl: { mac: 'https://github.com/zooai/desktop/releases/latest', win: 'https://github.com/zooai/desktop/releases/latest', ios: '', android: '' },
  network: { rpc: 'https://rpc.zoo.network', chainId: 200200, token: '$ZOO', aiMiningPrecompile: '0x0300000000000000000000000000000000000000', blockExplorer: 'https://explorer.zoo.network' },
  overlayController: 'https://edge.zoo.cloud', inferenceEndpoint: 'https://gateway.hanzo.ai',
  iam: { baseUrl: 'https://zoolabs.id', clientId: 'zoo-app-client-id', redirectUri: 'zoo://oauth/zoo', callbackEvent: 'zoo-iam-callback' },
  machinesEnabled: true,
};
const LUX: ChainConfig = {
  chain: 'lux', name: 'Lux', productName: 'Lux Desktop', company: 'Lux Industries, Inc.',
  identifier: 'com.lux.desktop',
  logo: { light: 'libs/hanzo-logo/assets/lux/lux-logo.svg', dark: 'libs/hanzo-logo/assets/lux/lux-logo.svg', favicon: 'libs/hanzo-logo/assets/lux/lux-icon.svg' },
  colors: { primary: '#000000', bg: '#000000', fg: '#ffffff' },
  hosts: ['lux.network', 'lux.cloud', 'lux.exchange', 'lux.ai'],
  storeUrl: { mac: 'https://github.com/luxfi/desktop/releases/latest', win: 'https://github.com/luxfi/desktop/releases/latest', ios: '', android: '' },
  network: { rpc: 'https://api.lux.network', chainId: 96369, token: '$LUX', aiMiningPrecompile: '0x0300000000000000000000000000000000000000', blockExplorer: 'https://explorer.lux.network' },
  overlayController: 'https://edge.lux.cloud', inferenceEndpoint: 'https://gateway.hanzo.ai',
  iam: { baseUrl: 'https://lux.id', clientId: 'lux-app-client-id', redirectUri: 'lux://oauth/lux', callbackEvent: 'lux-iam-callback' },
  machinesEnabled: true,
};
const _PRESETS: Record<string, ChainConfig> = { hanzo: HANZO, zoo: ZOO, lux: LUX };
registerBrands([HANZO, ZOO, LUX]);

/** Resolve a built-in chain preset by name: <HanzoAI {...getChainByName('lux')}/>. */
export function getChainByName(name: string): ChainConfig {
  return _PRESETS[name] ?? HANZO;
}
