// Chain store — re-exported from @hanzo_network/chain-config so there is ONE
// source of truth. The app's call sites import useChain from chain-config
// directly; <HanzoAI> writes that same module-level store via setChain().
//
// CRITICAL: getChain()/useChain() are PLAIN module getters, NOT React hooks.
// The migrated app calls them from non-component scope (module init, utils,
// event handlers), so they must never call a hook — else "invalid hook call".
// (Importing useChain from the @hanzo/ai PACKAGE instead of here would pull the
// built dist back into the source graph — a cycle + a duplicate React. Don't.)
import React from 'react';
import { setChain, getChain, useChain } from '@hanzo_network/chain-config';
import type { ChainConfig } from './types';

export { setChain, getChain, useChain };

/** Optional passthrough provider (the store is module-level, so this just
 *  sets the chain and renders children). Kept so existing usage compiles. */
export const ChainProvider: React.FC<{ chain?: ChainConfig; children: React.ReactNode }> = ({
  chain,
  children,
}) => {
  if (chain) setChain(chain as unknown as Parameters<typeof setChain>[0]);
  return React.createElement(React.Fragment, null, children);
};
