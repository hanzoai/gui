import { uploadPlaygroundToolFiles as uploadPlaygroundToolFilesApi } from '@hanzo_network/hanzo-message-ts/api/tools/index';

import { type UploadPlaygroundToolFilesInput } from './types';

export const uploadPlaygroundToolFiles = async ({
  nodeAddress,
  token,
  files,
  xAppId,
  xToolId,
}: UploadPlaygroundToolFilesInput) => {
  const response = await uploadPlaygroundToolFilesApi(
    nodeAddress,
    token,
    xAppId,
    xToolId,
    files,
  );

  return response;
};
