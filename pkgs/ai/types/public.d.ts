// Public type surface for @hanzo/ai. Hand-authored + self-contained (only the
// react peer dep is referenced) — the app is bundled, so a raw tsc .d.ts tree
// would carry broken internal/@hanzo_network imports. The build copies this to
// dist/index.d.ts.
import type { ComponentType, ReactElement, ReactNode } from 'react';

export type Brand = 'hanzo' | 'zoo' | 'lux';

export interface BrandConfig {
  brand: Brand;
  name: string;
  productName: string;
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
}

export interface HostAdapter {
  invoke?: (cmd: string, args?: unknown) => Promise<unknown>;
  listen?: (event: string, cb: (e: unknown) => void) => Promise<() => void>;
  platform?: 'tauri' | 'web' | 'expo';
}

export interface HanzoAIProps extends BrandConfig {
  logo?: ComponentType<{ className?: string }> | string;
  cloud?: { overlay?: string; inference?: string };
  auth?: Partial<BrandConfig['iam']> & { provider?: 'iam' };
  features?: Partial<{
    chat: boolean; wallet: boolean; mining: boolean; tools: boolean;
    agents: boolean; vectorFs: boolean; machines: boolean;
  }>;
  i18n?: Record<string, unknown>;
  host?: HostAdapter;
}

/** The Hanzo AI app as one declarative component. Brand is a prop; platform is
 *  an injected host. Renders web / desktop (Tauri) / mobile (Expo) from one surface. */
export declare function HanzoAI(props: HanzoAIProps): ReactElement;
export default HanzoAI;

export declare const BrandProvider: (props: { brand?: BrandConfig; children: ReactNode }) => ReactElement;
/** Read the active brand. A plain getter, NOT a React hook — callable anywhere. */
export declare function useBrand(): BrandConfig;
/** Read the active brand: the injected one if set, else env/hostname (default hanzo). */
export declare function getBrand(): BrandConfig;
/** Resolve a brand from a hostname (hanzo / zoo / lux; defaults to hanzo). */
export declare function getBrandFromHostname(hostname: string): BrandConfig;
