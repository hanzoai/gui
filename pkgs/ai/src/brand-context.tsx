// Brand store — the prop-driven replacement for the env `getBrand()`.
//
// CRITICAL: this is a PLAIN module-level getter, NOT a React hook. The
// migrated app calls getBrand()/useBrand() from many non-component sites
// (module scope, plain utils, event handlers), so it must not call any
// React hook — otherwise "invalid hook call". HanzoAI sets the brand via
// setBrand() before the app mounts (same pattern as setHost()).
import React from 'react';
import type { BrandConfig } from './types';

let _brand: BrandConfig | null = null;

export function setBrand(b: BrandConfig): void { _brand = b; }

/** Returns the brand injected by <HanzoAI>. Callable anywhere (not a hook). */
export function getBrand(): BrandConfig {
  if (!_brand) throw new Error('brand not set — render inside <HanzoAI {...brand}/>');
  return _brand;
}

/** Back-compat alias for migrated call sites that were rewritten to useBrand().
 *  Intentionally NOT a hook — it just reads the module-level brand. */
export const useBrand = getBrand;

/** Optional passthrough provider (the store is module-level, so this just
 *  renders children). Kept so existing <BrandProvider> usage compiles. */
export const BrandProvider: React.FC<{ brand?: BrandConfig; children: React.ReactNode }> = ({
  brand,
  children,
}) => {
  if (brand) setBrand(brand);
  return React.createElement(React.Fragment, null, children);
};
