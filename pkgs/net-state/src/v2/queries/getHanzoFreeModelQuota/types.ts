import { type Token } from '@hanzo_network/hanzo-message-ts/api/general/types';
import { type QueryObserverOptions } from '@tanstack/react-query';

import { type FunctionKeyV2 } from '../../constants';

export type GetFreeModelQuotaInput = Token & {
  nodeAddress: string;
};
export type UseGetFreeModelQuota = [
  FunctionKeyV2.GET_HANZO_FREE_MODEL_QUOTA,
  GetFreeModelQuotaInput,
];
// Cloud free-tier is retired (local-only). The query resolves to `null` and the
// "Free Hanzo AI Usage" UI is simply not rendered.
export type GetFreeModelQuotaOutput = {
  hasQuota: boolean;
  remainingMessages: number;
  totalMessages: number;
  resetTime: number;
  usedTokens: number;
  tokensQuota: number;
} | null;

export type Options = QueryObserverOptions<
  GetFreeModelQuotaOutput,
  Error,
  GetFreeModelQuotaOutput,
  GetFreeModelQuotaOutput,
  UseGetFreeModelQuota
>;
