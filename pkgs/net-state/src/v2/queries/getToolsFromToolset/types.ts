import { type Token } from '@hanzo_network/hanzo-message-ts/api/general/types';
import { type ToolHeader, type ToolType } from '@hanzo_network/hanzo-message-ts/api/tools/types';

export type GetToolsFromToolsetInput = Token & {
  nodeAddress: string;
  tool_set_key: string;
};

export type GetToolsFromToolsetOutput = {
  type: ToolType;
  content: [ToolHeader, boolean];
}[];
