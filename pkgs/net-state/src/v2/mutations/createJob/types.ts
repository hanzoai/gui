import { type Token } from '@hanzo_network/hanzo-message-ts/api/general/types';
import {
  type JobConfig,
  type Path,
} from '@hanzo_network/hanzo-message-ts/api/jobs/types';

export type CreateJobInput = Token & {
  nodeAddress: string;
  llmProvider: string;
  sheetId?: string;
  content: string;
  isHidden: boolean;
  toolKey?: string;
  files?: File[];
  selectedVRFiles?: Path[];
  selectedVRFolders?: Path[];
  chatConfig?: JobConfig;
};

export type CreateJobOutput = {
  jobId: string;
};
