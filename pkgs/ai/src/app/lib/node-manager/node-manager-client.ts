import { setPreferences } from '@hanzo_network/hanzo-message-ts/api/general/index';
import {
  QueryClient,
  type QueryObserverOptions,
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { relaunch } from '@tauri-apps/plugin-process';

import { type HanzoNodeOptions } from './hanzo-node-manager-client-types';

// Client

export const nodeQueryClient = new QueryClient();

// Queries
export const useNodeIsRunningQuery = (
  options?: Omit<QueryObserverOptions, 'queryKey'>,
): UseQueryResult<boolean, Error> => {
  const query = useQuery({
    queryKey: ['node_is_running'],
    queryFn: (): Promise<boolean> => invoke('node_is_running'),
    ...options,
  });
  return { ...query } as UseQueryResult<boolean, Error>;
};
export const useNodeGetOptionsQuery = (
  options?: Omit<QueryObserverOptions, 'queryKey'>,
): UseQueryResult<HanzoNodeOptions, Error> => {
  const query = useQuery({
    queryKey: ['node_get_options'],
    queryFn: (): Promise<HanzoNodeOptions> =>
      invoke('node_get_options'),
    ...options,
  });
  return { ...query } as UseQueryResult<HanzoNodeOptions, Error>;
};
export const useNodeGetDefaultModel = (
  options?: QueryObserverOptions,
): UseQueryResult<string, Error> => {
  const query = useQuery({
    queryKey: ['node_get_default_model'],
    queryFn: (): Promise<string> => invoke('node_get_default_model'),
    ...options,
  });
  return { ...query } as UseQueryResult<string, Error>;
};
export const useNodeGetDefaultEmbeddingModelQuery = (
  options?: Omit<QueryObserverOptions, 'queryKey'>,
): UseQueryResult<string, Error> => {
  const query = useQuery({
    queryKey: ['node_get_default_embedding_model'],
    queryFn: (): Promise<string> => invoke('node_get_default_embedding_model'),
    staleTime: Infinity, // This is a static default value, never changes
    ...options,
  });
  return { ...query } as UseQueryResult<string, Error>;
};

// Mutations
export const useNodeSpawnMutation = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: () => {
      return invoke('node_spawn');
    },
    ...options,
    onSuccess: (...onSuccessParameters) => {
      void queryClient.invalidateQueries({
        queryKey: ['node_is_running'],
      });
      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParameters);
      }
    },
  });
  return { ...response };
};

export const useNodeKillMutation = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: async (): Promise<void> => {
      return invoke('node_kill');
    },
    ...options,
    onSuccess: (...onSuccessParameters) => {
      void queryClient.invalidateQueries({
        queryKey: ['node_is_running'],
      });
      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParameters);
      }
    },
  });
  return { ...response };
};

export type NodeRemoveStorageOptions = {
  preserveKeys: boolean;
};
export const useNodeRemoveStorageMutation = (
  options?: UseMutationOptions<
    void,
    Error,
    Partial<NodeRemoveStorageOptions>
  >,
) => {
  const response = useMutation({
    mutationFn: async (
      options: Partial<NodeRemoveStorageOptions>,
    ): Promise<void> => {
      await invoke('node_set_default_options');
      return invoke('node_remove_storage', {
        preserveKeys: options?.preserveKeys,
      });
    },
    ...options,
  });
  return { ...response };
};

export const useNodeSetOptionsMutation = (
  options?: UseMutationOptions<
    Partial<HanzoNodeOptions>,
    Error,
    HanzoNodeOptions
  >,
) => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: (
      hanzoNodeOptions: Partial<HanzoNodeOptions>,
    ): Promise<HanzoNodeOptions> => {
      return invoke('node_set_options', {
        options: hanzoNodeOptions,
      });
    },
    ...options,
    onSuccess: (...onSuccessParameters) => {
      void queryClient.invalidateQueries({
        queryKey: ['node_get_options'],
      });
      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParameters);
      }
    },
  });
  return { ...response };
};

export const useNodeSetDefaultOptionsMutation = (
  options?: UseMutationOptions<HanzoNodeOptions, Error, void>,
) => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: (): Promise<HanzoNodeOptions> => {
      return invoke('node_set_default_options', {});
    },
    ...options,
    onSuccess: (...onSuccessParameters) => {
      void queryClient.invalidateQueries({
        queryKey: ['node_set_default_options'],
      });
      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParameters);
      }
    },
  });
  return { ...response };
};

export const useNodeRespawnMutation = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: async () => {
      await invoke('node_kill');
      await relaunch();
    },
    ...options,
    onSuccess: (...onSuccessParameters) => {
      void queryClient.invalidateQueries({
        queryKey: ['node_is_running'],
      });
      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParameters);
      }
    },
  });
  return { ...response };
};

export const useNodeSetDefaultLlmProviderMutation = (
  options?: UseMutationOptions<void, Error, string>,
) => {
  const response = useMutation({
    mutationFn: async (defaultLlmProvider: string): Promise<void> => {
      if (!defaultLlmProvider) {
        throw new Error('Default LLM provider is required');
      }
      return Promise.resolve();
    },
    ...options,
  });
  return { ...response };
};

export const nodeSetDefaultLlmProvider = async (
  defaultLlmProvider: string,
  nodeAddress: string,
  apiToken: string,
): Promise<void> => {
  if (!defaultLlmProvider || !nodeAddress || !apiToken) {
    throw new Error(
      'Default LLM provider, node address, and API token are required',
    );
  }

  await setPreferences(nodeAddress, apiToken, {
    default_llm_provider: defaultLlmProvider,
  });

  return Promise.resolve();
};
