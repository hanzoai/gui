// @hanzo/ai — the Hanzo AI app, as one declarative SDK component.
//
//   import HanzoAI from '@hanzo/ai'
//   import brand   from '@luxfi/brand'
//   render(<HanzoAI {...brand} features={{ chat:true, wallet:true }} />)
//
// Mirrors @luxfi/exchange's <Exchange {...brand} />: brand is a prop, one way,
// one place. hanzo/zoo/lux desktop+mobile apps all collapse to an ~80-line shim.
import React from 'react';
import { BrandProvider, setBrand } from './brand-context';
import { setHost } from './host/runtime';
import App from './app/App';
import type { HanzoAIProps } from './types';

// The migrated shinkai-fork app root (./app/App). getBrand() → useBrand();
// the 44 @tauri-apps imports route through the host shim via the build alias.
const AppRoot: React.ComponentType = App;

export function HanzoAI(props: HanzoAIProps): React.ReactElement {
  const { logo, cloud, auth, features, i18n, host, ...brand } = props;
  // Register the platform adapter (web default, or the injected tauri/expo host)
  // before the app tree mounts — so the app's native calls route correctly.
  setHost(host);
  // Brand + optional overrides flow to the app via context (one source of truth).
  const resolved = {
    ...brand,
    overlayController: cloud?.overlay ?? brand.overlayController,
    inferenceEndpoint: cloud?.inference ?? brand.inferenceEndpoint,
    iam: { ...brand.iam, ...auth },
  };
  // Set the module-level brand synchronously, before any child module reads it.
  setBrand(resolved);
  return React.createElement(
    BrandProvider as React.ComponentType<{ brand: typeof resolved; children: React.ReactNode }>,
    { brand: resolved },
    React.createElement(AppRoot),
  );
}

export default HanzoAI;
export { BrandProvider, useBrand } from './brand-context';
export type { BrandConfig, HanzoAIProps, HostAdapter, Brand } from './types';
