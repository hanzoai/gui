import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { FunctionKeyV2 } from '../../constants';
import {
  type GetFilesProtocolInput,
  type GetFilesProtocolOutput,
} from './types';
import { getFilesProtocol } from './index';

export type UseGetFilesProtocol = [
  FunctionKeyV2.GET_HANZO_FILE_PROTOCOLS,
  GetFilesProtocolInput,
];
type Options = QueryObserverOptions<
  GetFilesProtocolOutput,
  Error,
  GetFilesProtocolOutput,
  GetFilesProtocolOutput,
  UseGetFilesProtocol
>;

export const useGetFilesProtocol = (
  input: GetFilesProtocolInput,
  options?: Omit<Options, 'queryKey' | 'queryFn'>,
) => {
  const response = useQuery({
    queryKey: [FunctionKeyV2.GET_HANZO_FILE_PROTOCOLS, input],
    queryFn: () => getFilesProtocol(input),
    ...options,
  });
  return response;
};
