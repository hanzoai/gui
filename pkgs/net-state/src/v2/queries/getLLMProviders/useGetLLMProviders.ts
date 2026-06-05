import { useQuery } from '@tanstack/react-query';

import { FunctionKeyV2 } from '../../constants';
import { type GetLLMProvidersInput, type Options } from './types';
import { getLLMProviders } from './index';

export const useGetLLMProviders = (
  input: GetLLMProvidersInput,
  options?: Omit<Options, 'queryKey' | 'queryFn'>,
) => {
  const { enabled, ...restOptions } = options ?? {};
  const response = useQuery({
    queryKey: [FunctionKeyV2.GET_LLM_PROVIDERS, input],
    queryFn: () => getLLMProviders(input),
    // Don't fire until both the node address and the auth token are present —
    // otherwise the request goes out with an empty Bearer and the node 401s
    // (the query mounts during onboarding, before auth is established).
    enabled: Boolean(input.nodeAddress && input.token) && (enabled ?? true),
    ...restOptions,
  });
  return { ...response, llmProviders: response.data ?? [] };
};
