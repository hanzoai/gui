import { useSetOAuthToken } from '@hanzo_network/hanzo-node-state/v2/mutations/setOAuthToken/index';
import { useEffect } from 'react';

import { useAuth } from '../store/auth';
import { safeEmit, safeListen } from '../utils/tauri-check';

export const useOAuthDeepLinkSet = () => {
  const { mutateAsync: setOAuthToken } = useSetOAuthToken({
    onSuccess: async (data) => {
      console.log('oauth-success', data);
      await safeEmit('oauth-success', { state: data.state, code: data.code });
    },
  });
  const auth = useAuth((s) => s.auth);

  useEffect(() => {
    const unlisten = safeListen('oauth-deep-link', (event) => {
      if (!auth) return;

      const payload = event.payload as { state: string; code: string };
      void setOAuthToken({
        state: payload.state,
        code: payload.code,
        nodeAddress: auth.node_address ?? '',
        token: auth.api_v2_key ?? '',
      });
    });

    return () => {
      void unlisten.then((fn) => fn?.());
    };
  }, [setOAuthToken, auth]);
};

export const useOAuthSuccess = (
  callback: (payload: { state: string; code: string }) => void,
) => {
  useEffect(() => {
    const unlisten = safeListen('oauth-success', (event) => {
      const payload = event.payload as { state: string; code: string };
      callback(payload);
    });

    return () => {
      void unlisten.then((fn) => fn?.());
    };
  }, [callback]);
};
