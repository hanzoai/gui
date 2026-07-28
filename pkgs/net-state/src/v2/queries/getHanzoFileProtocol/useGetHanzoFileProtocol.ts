import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { FunctionKeyV2 } from '../../constants';
import {
  type GetFileProtocolInput,
  type GetFileProtocolOutput,
} from './types';
import { getFileProtocol } from './index';

export type UseGetFileProtocol = [
  FunctionKeyV2.GET_HANZO_FILE_PROTOCOL,
  GetFileProtocolInput,
];
type Options = QueryObserverOptions<
  GetFileProtocolOutput,
  Error,
  GetFileProtocolOutput,
  GetFileProtocolOutput,
  UseGetFileProtocol
>;

export const useGetFileProtocol = (
  input: GetFileProtocolInput,
  options?: Omit<Options, 'queryKey' | 'queryFn'>,
) => {
  const response = useQuery({
    queryKey: [FunctionKeyV2.GET_HANZO_FILE_PROTOCOL, input],
    queryFn: () => getFileProtocol(input),
    ...options,
  });
  return response;
};
