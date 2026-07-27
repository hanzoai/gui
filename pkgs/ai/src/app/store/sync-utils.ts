import { debug } from '@tauri-apps/plugin-log';
import { useEffect } from 'react';

import { isLocalNode } from '../lib/node-manager/node-manager-windows-utils';
import {
  currentWindowLabel,
  safeEmit,
  safeInvoke,
  safeListen,
} from '../utils/tauri-check';
import { type Auth, useAuth } from './auth';
import { useExperimental } from './experimental';
import { useSettings } from './settings';
import { useNodeManager } from './node-manager';

export type RehydrateStorageEvent = {
  triggeredBy: string;
  stores: string[];
};

const stores = new Map(
  [useAuth, useSettings, useNodeManager, useExperimental].map((s) => [
    s.persist.getOptions().name,
    s,
  ]),
);

const rehydrateStore = (targetStores: string[]) => {
  targetStores.forEach((storeName) =>
    stores.get(storeName)?.persist.rehydrate(),
  );
};

export const useSyncStorageSecondary = () => {
  useEffect(() => {
    const label = currentWindowLabel();

    void debug('using sync storage secondary');

    const handleRehydrate = (triggeredBy: string, targetStores: string[]) => {
      void debug(
        `${label} rehydrating stores:${targetStores?.join(',')} triggeredBy:${triggeredBy}`,
      );
      rehydrateStore(targetStores);
    };

    const unlistenRehydrateStorage = safeListen<RehydrateStorageEvent>(
      'rehydrate-storage',
      (event) =>
        handleRehydrate(event.payload.triggeredBy, event.payload.stores),
    );

    return () => {
      unlistenRehydrateStorage
        .then((fn) => fn?.())
        .catch(() => {
          // Ignore cleanup errors - this can happen if the process ends quickly
        });
    };
  }, []);
};

const handleAuthSideEffect = async (
  auth: Auth | null,
  prevAuth: Auth | null,
) => {
  void debug(`prev auth: ${prevAuth} --- new auth ${auth}`);
  const label = currentWindowLabel();
  // SignOut case
  if (prevAuth && !auth) {
    void debug(
      `setting prevAuth:${JSON.stringify(prevAuth)} auth:${JSON.stringify(auth)}`,
    );
    useSettings.getState().resetSettings();
    useNodeManager.getState().setIsInUse(false);
    void safeEmit('rehydrate-storage', {
      triggeredBy: label,
      stores: ['settings', 'hanzo-node-options'],
    });
    return;
  }

  if (!prevAuth) {
    const isLocal = isLocalNode(auth?.node_address || '');
    const isRunning = (await safeInvoke<boolean>('node_is_running')) ?? false;
    void debug(`setting is in use isLocal:${isLocal} isRunning:${isRunning}`);
    useNodeManager.getState().setIsInUse(isLocal && isRunning);
    void safeEmit('rehydrate-storage', {
      triggeredBy: label,
      stores: ['settings', 'hanzo-node-options'],
    });
  }
};

export const useSyncStorageSideEffects = () => {
  void debug('using useSyncStorageSideEffects');
  useEffect(() => {
    const authUnsubscribe = useAuth.subscribe((state, prevState) => {
      void debug('auth state changed');
      void handleAuthSideEffect(state.auth, prevState.auth);
    });
    return () => {
      authUnsubscribe();
    };
  }, []);
};

export const useSyncStorageMain = () => {
  useEffect(() => {
    const label = currentWindowLabel();
    void debug('using sync storage main');
    const handleStorageChange = (event: StorageEvent) => {
      void debug(
        `${label} storage:${event.key} changed by ${event.url}, emitting rehydrate-storage...`,
      );
      void safeEmit('rehydrate-storage', {
        triggeredBy: label,
        stores: [event.key],
      });
    };

    window?.addEventListener('storage', (event: StorageEvent) =>
      handleStorageChange(event),
    );

    return () => {
      window?.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};
