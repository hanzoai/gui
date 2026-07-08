/**
 * Chain metadata + RPC wiring for the wallet, sourced from @luxwallet/chains
 * (the one registry) and the desktop brand config.
 *
 * EVM chains with a `ready` tx builder are fully operational (create / list /
 * balance / send). Non-EVM families (Lux X/P/Q/Z chains) are registry-only
 * stubs upstream — surfaced honestly as "coming soon", never faked.
 */
import { getBrand } from '@hanzo_network/brand-config';
import { allChains, getChain, type ChainEntry } from '@luxwallet/chains';
import { RpcClient, type RpcConfig } from '@luxwallet/rpc';

/** Every EVM chain whose unsigned-tx builder is `ready` (fully working). */
export function evmChains(): ChainEntry[] {
  return allChains().filter(
    (c) => c.family === 'evm' && c.builderStatus === 'ready',
  );
}

/** Non-EVM / not-yet-ready chains — shown as "coming soon", not operational. */
export function comingSoonChains(): ChainEntry[] {
  return allChains().filter(
    (c) => c.family !== 'evm' || c.builderStatus !== 'ready',
  );
}

export function chainById(id: string | number): ChainEntry | undefined {
  return getChain(id);
}

/**
 * The wallet's default chain: the brand's own primary EVM chain if it is in
 * the registry (Lux C-Chain, Hanzo, Zoo), else the first ready EVM chain.
 */
export function defaultChainId(): number {
  const first = evmChains()[0];
  const fallback = first?.evmChainId ?? 1;
  // getBrand() throws until the host injects a brand; stay import-safe.
  try {
    const brandChainId = getBrand().network.chainId;
    const match = evmChains().find((c) => c.evmChainId === brandChainId);
    return match?.evmChainId ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Build the RPC config from the active brand. Chains route through the default
 * gateway (`https://api.hanzo.ai/v1/rpc/<route>`); the brand's own chain gets a
 * direct-RPC override from brand-config so its balances work even if the
 * gateway route is not yet provisioned.
 */
export function brandRpcConfig(): RpcConfig {
  const overrides: Record<number, string> = {};
  try {
    const brand = getBrand();
    if (brand.network.chainId && brand.network.rpc) {
      overrides[brand.network.chainId] = brand.network.rpc;
    }
  } catch {
    /* brand not injected yet — default gateway still resolves */
  }
  return { overrides };
}

/** A JSON-RPC client bound to `chainId` via the brand gateway. */
export function rpcClient(chainId: number): RpcClient {
  return new RpcClient(chainId, brandRpcConfig());
}

export type { ChainEntry };
