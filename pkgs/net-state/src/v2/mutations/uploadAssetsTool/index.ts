import { uploadAssetsToTool as uploadAssetsToToolApi } from '@hanzo_network/hanzo-message-ts/api/tools/index';

import { type UploadAssetsToToolInput } from './types';

export const uploadAssetsToTool = async ({
  nodeAddress,
  token,
  files,
  xAppId,
  xToolId,
}: UploadAssetsToToolInput) => {
  const response = await uploadAssetsToToolApi(
    nodeAddress,
    token,
    xAppId,
    xToolId,
    files,
  );

  return response;
};
