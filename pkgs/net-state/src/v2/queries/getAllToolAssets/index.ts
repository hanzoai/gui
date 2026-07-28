import { getAllToolAssets as getAllToolAssetsApi } from '@hanzo_network/hanzo-message-ts/api/tools/index';

import  { type GetAllToolAssetsInput } from './types';

export const getAllToolAssets = async ({
  nodeAddress,
  token,
  xAppId,
  xToolId,
}: GetAllToolAssetsInput) => {
  const result = await getAllToolAssetsApi(
    nodeAddress,
    token,
    xAppId,
    xToolId,
  );
  return result;
};
