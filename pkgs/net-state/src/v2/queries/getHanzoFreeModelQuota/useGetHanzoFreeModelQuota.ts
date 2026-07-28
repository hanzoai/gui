import { useQuery } from '@tanstack/react-query';

import { FunctionKeyV2 } from '../../constants';
import { type GetFreeModelQuotaInput, type Options } from './types';
import { getFreeModelQuota } from '.';

export const useGetFreeModelQuota = (
  input: GetFreeModelQuotaInput,
  options?: Omit<Options, 'queryKey' | 'queryFn'>,
) => {
  const response = useQuery({
    queryKey: [FunctionKeyV2.GET_HANZO_FREE_MODEL_QUOTA, input] as const,
    queryFn: async () => await getFreeModelQuota(),
    ...options,
  });
  return response;
};
