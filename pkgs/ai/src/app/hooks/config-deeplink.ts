import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../store/auth';
import { safeListen } from '../utils/tauri-check';

export const CONFIG_DEEPLINK_EVENT = 'config-deep-link';
export type ConfigDeepLinkPayload = {
  tool_router_key: string;
};
export const useConfigDeepLink = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const unlisten = safeListen(CONFIG_DEEPLINK_EVENT, (event) => {
      if (!auth) return;

      const payload = event.payload as ConfigDeepLinkPayload;
      if (payload.tool_router_key) {
        void navigate(`/tools/${payload.tool_router_key}`);
      }
    });
    return () => {
      void unlisten.then((fn) => fn?.());
    };
  }, [auth, navigate]);
};
