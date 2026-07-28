import { t } from '@hanzo_network/hanzo-i18n';
import { cn } from '@hanzo_network/hanzo-ui/utils';
import React from 'react';
import { type ExternalToast, toast } from 'sonner';

import { BRAND } from '../../config/brand';
import { openNodeManagerWindow } from './node-manager-windows-utils';

export const modelNameMap: Record<string, string> = {
  'embeddinggemma:300m': "Embedding Gemma 300M",
  'llama3.1:8b-instruct-q4_1': 'Llama 3.1 8B',
  'gemma2:2b-instruct-q4_1': 'Gemma 2 2B',
  'command-r7b:7b-12-2024-q4_K_M': 'Command R 7B',
  'mistral-small3.2:24b-instruct-2506-q4_K_M': 'Mistral Small 3.2',
};

const NodeLogsLabel = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('cursor-pointer text-white', className)}
      onClick={async () => {
        await openNodeManagerWindow();
      }}
      {...props}
    >
      logs
    </span>
  );
};

export const NODE_MANAGER_TOAST_ID = 'node-manager-toast-id';
const defaultToastOptions: ExternalToast = {
  id: NODE_MANAGER_TOAST_ID,
  position: 'top-right',
};

export const startingNodeToast = () => {
  return toast.loading(t('node.notifications.startingNode'), {
    ...defaultToastOptions,
  });
};
export const nodeStartedToast = () => {
  return toast.success(t('node.notifications.runningNode'), {
    ...defaultToastOptions,
  });
};
export const nodeStartErrorToast = () => {
  toast.error(
    <div>
      Error starting your local Node, see <NodeLogsLabel /> for
      more information
    </div>,
    {
      ...defaultToastOptions,
    },
  );
};

export const stoppingNodeToast = () => {
  return toast.loading(t('node.notifications.stopNode'), {
    ...defaultToastOptions,
  });
};
export const nodeStopErrorToast = () => {
  toast.error(
    <div>
      Error stopping your local Node, see <NodeLogsLabel /> for
      more information
    </div>,
    {
      ...defaultToastOptions,
    },
  );
};
export const nodeStoppedToast = () => {
  return toast.success(t('node.notifications.stoppedNode'), {
    ...defaultToastOptions,
  });
};

export const successRemovingNodeStorageToast = () => {
  return toast.success(t('node.notifications.removedNote'), {
    ...defaultToastOptions,
  });
};

export const errorRemovingNodeStorageToast = () => {
  return toast.error(
    <div>
      Error removing your local {BRAND.name} Node storage, see{' '}
      <NodeLogsLabel /> for more information
    </div>,
    { ...defaultToastOptions },
  );
};

export const successNodeSetDefaultOptionsToast = () => {
  return toast.success(t('node.notifications.optionsRestored'), {
    ...defaultToastOptions,
  });
};

export const pullingModelStartToast = (model: string) => {
  return toast.loading(
    t('node.notifications.startingDownload', { modelName: model }),
    {
      ...defaultToastOptions,
    },
  );
};
export const pullingModelProgressToast = (model: string, progress: number) => {
  return toast.loading(
    t('node.notifications.downloadingModel', {
      modelName: model,
      progress,
    }),
    {
      ...defaultToastOptions,
    },
  );
};
export const pullingModelDoneToast = (model: string) => {
  return toast.success(
    t('node.notifications.downloadedModel', {
      modelName: modelNameMap[model],
    }),
    { duration: 3000 },
  );
};

export const pullingModelErrorToast = (model: string) => {
  return toast.error(
    <div>
      Error downloading AI model {model}, see <NodeLogsLabel /> for more
      information
    </div>,
    {
      ...defaultToastOptions,
    },
  );
};
