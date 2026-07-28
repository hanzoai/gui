import { type Token } from '@hanzo_network/hanzo-message-ts/api/general/types';
import {
  type Tool,
  type ToolType,
  type UpdateToolResponse,
} from '@hanzo_network/hanzo-message-ts/api/tools/types';

export type UpdateToolOutput = UpdateToolResponse;

export type UpdateToolInput = Token & {
  nodeAddress: string;
  toolKey: string;
  toolType: ToolType;
  toolPayload: Tool;
  isToolEnabled: boolean;
};
