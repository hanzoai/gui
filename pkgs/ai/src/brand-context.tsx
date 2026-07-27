// Brand store — re-exported from @hanzo_network/brand-config so there is ONE
// source of truth. The app's call sites import useBrand from brand-config
// directly; <AI> writes that same module-level store via setBrand().
//
// CRITICAL: getBrand()/useBrand() are PLAIN module getters, NOT React hooks.
// The migrated app calls them from non-component scope (module init, utils,
// event handlers), so they must never call a hook — else "invalid hook call".
// (Importing useBrand from the @hanzo/ai PACKAGE instead of here would pull the
// built dist back into the source graph — a cycle + a duplicate React. Don't.)
import React from 'react';
import { setBrand, getBrand, useBrand } from '@hanzo_network/brand-config';
import type { BrandConfig } from './types';

export { setBrand, getBrand, useBrand };

/** Optional passthrough provider (the store is module-level, so this just
 *  sets the brand and renders children). Kept so existing usage compiles. */
export const BrandProvider: React.FC<{ brand?: BrandConfig; children: React.ReactNode }> = ({
  brand,
  children,
}) => {
  if (brand) setBrand(brand as unknown as Parameters<typeof setBrand>[0]);
  return React.createElement(React.Fragment, null, children);
};
