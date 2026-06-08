import { useChain } from '@hanzo_network/chain-config';
import { useEffect, useRef } from 'react';

import { useAuth } from '../store/auth';
import { useWallet } from '../store/wallet';
import { safeInvoke } from '../utils/tauri-check';

export const useMiningWithWallet = () => {
  const { wallet } = useWallet();
  const auth = useAuth((state) => state.auth);
  const hasStartedMining = useRef(false);

  useEffect(() => {
    const startMiningWithWallet = async () => {
      if (!auth || hasStartedMining.current) return;

      const chain = useChain();
      // DID-wallet unification: the node derives a real secp256k1 EVM keypair
      // from its ed25519 seed and exposes it at /v2/node_wallet — its DID id IS
      // that EVM address. Mine to the DID address so identity == wallet ==
      // payout. Fall back to a connected wallet, then the node's auto-address.
      let payoutAddress = wallet?.address ?? '';
      try {
        const res = await fetch(`${auth.node_address}/v2/node_wallet`);
        if (res.ok) {
          const nw = (await res.json()) as { address?: string; did?: string };
          if (nw.address) payoutAddress = nw.address;
        }
      } catch {
        // node may not expose /v2/node_wallet (older binary) — fall back.
      }

      await safeInvoke('mining_stop');
      await safeInvoke('mining_start', {
        walletAddress: payoutAddress,
        chainId: chain.network.chainId,
      });

      hasStartedMining.current = true;
    };

    void startMiningWithWallet();
  }, [wallet?.address, auth]);

  useEffect(() => {
    if (!auth) {
      hasStartedMining.current = false;
    }
  }, [auth]);
};
