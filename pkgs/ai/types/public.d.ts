// Public type surface for @hanzo/ai. Hand-authored + self-contained (only the
// react peer dep is referenced) — the app is bundled, so a raw tsc .d.ts tree
// would carry broken internal/@hanzo_network imports. The build copies this to
// dist/index.d.ts.
import type { ComponentType, ReactElement, ReactNode } from 'react';

export type Chain = string;

export interface ChainConfig {
  chain: Chain;
  name: string;
  productName: string;
  company: string;
  identifier: string;
  logo: { light: string; dark: string; favicon: string };
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
  overlayController: string;
  inferenceEndpoint: string;
  iam: { baseUrl: string; clientId: string; redirectUri: string; callbackEvent: string };
  machinesEnabled?: boolean;
}

export interface HostAdapter {
  invoke?: (cmd: string, args?: unknown) => Promise<unknown>;
  listen?: (event: string, cb: (e: unknown) => void) => Promise<() => void>;
  platform?: 'tauri' | 'web' | 'expo';
}

export interface HanzoAIProps extends ChainConfig {
  logo?: ComponentType<{ className?: string }> | string;
  cloud?: { overlay?: string; inference?: string };
  auth?: Partial<ChainConfig['iam']> & { provider?: 'iam' };
  features?: Partial<{
    chat: boolean; wallet: boolean; mining: boolean; tools: boolean;
    agents: boolean; vectorFs: boolean; machines: boolean;
  }>;
  i18n?: Record<string, unknown>;
  host?: HostAdapter;
}

/** The Hanzo AI app as one declarative component. Chain is a prop; platform is
 *  an injected host. Renders web / desktop (Tauri) / mobile (Expo) from one surface. */
export declare function HanzoAI(props: HanzoAIProps): ReactElement;
export default HanzoAI;

export declare const BrandProvider: (props: { chain?: ChainConfig; children: ReactNode }) => ReactElement;
/** Read the active chain. A plain getter, NOT a React hook — callable anywhere. */
export declare function useChain(): ChainConfig;
/** Read the active chain: the injected one if set, else env/hostname via the registry. */
export declare function getChain(): ChainConfig;
export declare function getChainByName(name: string): ChainConfig;
export declare function getChainFromHostname(h: string): ChainConfig | undefined;
/** Resolve a chain from a hostname using the registered brands. */
export declare function getChainFromHostname(hostname: string): ChainConfig | undefined;
/** Inject the active chain (called by <HanzoAI> before mount). */
export declare function setChain(chain: ChainConfig): void;
/** Register brands for hostname/env resolution (web multi-tenant). */
export declare function registerBrands(brands: ChainConfig[]): void;
/** Whether the Machines/Containers/K8s/Network pages render (config-driven). */
export declare function isMachinesEnabled(cfg?: ChainConfig): boolean;
