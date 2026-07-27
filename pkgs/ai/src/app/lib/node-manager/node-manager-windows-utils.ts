import { invoke } from '@tauri-apps/api/core';

export const openNodeManagerWindow = async () => {
  return invoke('show_node_manager_window');
};

export const isLocalNode = (nodeAddress: string) => {
  const isLocalNode =
    nodeAddress.includes('localhost') || nodeAddress.includes('127.0.0.1');
  return isLocalNode;
};

export const isHostingNode = (nodeAddress: string) => {
  return nodeAddress?.includes('hosting.hanzo.ai');
};
