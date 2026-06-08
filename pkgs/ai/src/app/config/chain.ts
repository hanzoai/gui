// Chain-neutral. The active chain comes from the injected/registered config
// (@hanzo_network/chain-config) — never hardcoded here. `BRAND` forwards every
// field access to the active chain, so existing `BRAND.name` / `BRAND.company` /
// `BRAND.productName` call sites read the live chain with no per-file changes.
import { getChain, type ChainConfig } from '@hanzo_network/chain-config';

export type Chain = ChainConfig;

export const BRAND: ChainConfig = new Proxy({} as ChainConfig, {
  get: (_target, prop) =>
    (getChain() as unknown as Record<string | symbol, unknown>)[prop],
}) as ChainConfig;

export default BRAND;
