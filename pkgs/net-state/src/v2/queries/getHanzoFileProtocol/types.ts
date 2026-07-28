import { type Token } from '@hanzo_network/hanzo-message-ts/api/general/types';

import { type Attachment } from '../getChatConversation/types';

export type GetFileProtocolInput = Token & {
  nodeAddress: string;
  file: string;
};

export type GetFileProtocolOutput = Blob;

export type GetFilesProtocolInput = Token & {
  nodeAddress: string;
  files: string[];
};

export type GetFilesProtocolOutput = Attachment[];
