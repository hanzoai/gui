import { type Token } from '@hanzo_network/hanzo-message-ts/api/general/types';
import {
  type Tool,
  type ToolType,
  type UpdateToolResponse,
} from '@hanzo_network/hanzo-message-ts/api/tools/types';

export type CreateToolOutput = UpdateToolResponse;

export type CreateToolInput = Token & {
  nodeAddress: string;
  toolType: ToolType;
  toolPayload: Tool;
  isToolEnabled: boolean;
};
