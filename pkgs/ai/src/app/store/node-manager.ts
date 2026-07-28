import { debug } from '@tauri-apps/plugin-log';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { type NodeOptions } from '../lib/node-manager/node-manager-client-types';

type NodeManagerStore = {
  isInUse: boolean | null;
  setIsInUse: (value: boolean) => void;
  nodeOptions: Partial<NodeOptions> | null;
  setNodeOptions: (
    nodeOptions: Partial<NodeOptions> | null,
  ) => void;
};

export const useNodeManager = create<NodeManagerStore>()(
  devtools(
    persist(
      (set) => ({
        isInUse: false,
        nodeOptions: null,
        setNodeOptions: (nodeOptions) => {
          void debug('setting hanzo-node options');
          set({ nodeOptions });
        },
        setIsInUse: (value: boolean) => {
          void debug('setting is in use');
          set({ isInUse: value });
        },
      }),
      {
        name: 'hanzo-node-options',
      },
    ),
  ),
);
