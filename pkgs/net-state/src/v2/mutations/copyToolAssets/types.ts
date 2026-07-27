import { type Token } from '@hanzo_network/hanzo-message-ts/api/general/types';
import {
  type CopyToolAssetsRequest,
  type CopyToolAssetsResponse,
} from '@hanzo_network/hanzo-message-ts/api/tools/types';

export type CopyToolAssetsInput = Token & {
  nodeAddress: string;
  currentToolKeyPath: CopyToolAssetsRequest['first_path'];
  xAppId: CopyToolAssetsRequest['second_path'];
};

export type CopyToolAssetsOutput = CopyToolAssetsResponse;
