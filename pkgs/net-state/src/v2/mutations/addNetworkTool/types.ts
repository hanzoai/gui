import { type Token } from '@hanzo_network/hanzo-message-ts/api/general/types';
import { type NetworkTool } from '@hanzo_network/hanzo-message-ts/api/tools/types';

export type AddNetworkToolInput = Token & {
  nodeAddress: string;
  networkTool: NetworkTool;
};
export type AddNetworkToolOutput = any;
