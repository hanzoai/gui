import { getFileProtocol as getFileProtocolApi } from '@hanzo_network/hanzo-message-ts/api/tools/index';

import { generateFilePreview } from '../../utils/file-preview';
import  {
  type GetFileProtocolInput,
  type GetFilesProtocolInput,
} from './types';

export const getFileProtocol = async ({
  nodeAddress,
  token,
  file,
}: GetFileProtocolInput) => {
  const result = await getFileProtocolApi(nodeAddress, token, {
    file,
  });
  return result;
};

export const getFilesProtocol = async ({
  nodeAddress,
  token,
  files,
}: GetFilesProtocolInput) => {
  const results = await Promise.all(
    files.map(async (file) => {
      const result = await getFileProtocolApi(nodeAddress, token, {
        file,
      });
      return generateFilePreview(file, result);
    }),
  );

  return results;
};
