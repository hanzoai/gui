// @hanzo/ai — the Hanzo AI app, as one declarative SDK component.
//
//   import HanzoAI from '@hanzo/ai'
//   import chain   from '@luxfi/chain'
//   render(<HanzoAI {...chain} features={{ chat:true, wallet:true }} />)
//
// Mirrors @luxfi/exchange's <Exchange {...chain} />: chain is a prop, one way,
// one place. hanzo/zoo/lux desktop+mobile apps all collapse to an ~80-line shim.
import React from 'react';
import { setAppName } from '@hanzo_network/hanzo-i18n';
import { ChainProvider, setChain } from './chain-context';
import { setHost } from './host/runtime';
import App from './app/App';
import type { HanzoAIProps } from './types';

// The migrated shinkai-fork app root (./app/App). getChain() → useChain();
// the 44 @tauri-apps imports route through the host shim via the build alias.
const AppRoot: React.ComponentType = App;

export function HanzoAI(props: HanzoAIProps): React.ReactElement {
  const { logo, cloud, auth, features, i18n, host, ...chain } = props;
  // Register the platform adapter (web default, or the injected tauri/expo host)
  // before the app tree mounts — so the app's native calls route correctly.
  setHost(host);
  // Chain + optional overrides flow to the app via context (one source of truth).
  const resolved = {
    ...chain,
    overlayController: cloud?.overlay ?? chain.overlayController,
    inferenceEndpoint: cloud?.inference ?? chain.inferenceEndpoint,
    iam: { ...chain.iam, ...auth },
  };
  // Set the module-level chain synchronously, before any child module reads it.
  setChain(resolved);
  // Feed the chain's product name to i18n's {{appName}} interpolation so
  // chain-neutral copy ('Welcome to {{appName}}', '{{appName}} Node', …) renders
  // per-chain — no per-chain locale overlay, no frozen-VITE_BRAND leak.
  setAppName(resolved.name);
  return React.createElement(
    ChainProvider as React.ComponentType<{ chain: typeof resolved; children: React.ReactNode }>,
    { chain: resolved },
    React.createElement(AppRoot),
  );
}

export default HanzoAI;
export { ChainProvider, useChain, getChain } from './chain-context';
// Re-export the chain resolvers so a thin shim needs no separate chain pkg for
// the default case: `import HanzoAI, { getChain } from '@hanzo/ai'`. Custom
// brands still flow in as props (<HanzoAI {...myBrand}/>).
export { getChainFromHostname, getChainByName } from '@hanzo_network/chain-config';
export type { ChainConfig, HanzoAIProps, HostAdapter, Chain } from './types';
