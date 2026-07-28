import { openToolInCodeEditor as openToolInCodeEditorApi } from '@hanzo_network/hanzo-message-ts/api/tools/index';

import { type OpenToolInCodeEditorInput, type OpenToolInCodeEditorOutput } from './types';

export const openToolInCodeEditor = async ({
  nodeAddress,
  token,
  language,
  xAppId,
  xToolId,
  xLLMProvider,
}: OpenToolInCodeEditorInput): Promise<OpenToolInCodeEditorOutput> => {
  const response = await openToolInCodeEditorApi(
    nodeAddress,
    token,
    { language },
    xAppId,
    xToolId,
    xLLMProvider,
  );
  return response;
};
