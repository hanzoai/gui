import './globals.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlayIcon, StopIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Form,
  FormField,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@hanzo_network/hanzo-ui';
import { cn } from '@hanzo_network/hanzo-ui/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { info } from '@tauri-apps/plugin-log';
import { Loader2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { LocalModelBrowser } from '../../components/node-manager/local-model-browser';
import { ModelTools } from '../../components/node-manager/model-tools';
import {
  nodeQueryClient,
  useNodeGetOptionsQuery,
  useNodeIsRunningQuery,
  useNodeKillMutation,
  useNodeRemoveStorageMutation,
  useNodeSetDefaultOptionsMutation,
  useNodeSetOptionsMutation,
  useNodeSpawnMutation,
} from '../../lib/node-manager/node-manager-client';
import { type NodeOptions } from '../../lib/node-manager/node-manager-client-types';
import { useNodeEventsToast } from '../../lib/node-manager/node-manager-hooks';
import {
  errorRemovingNodeStorageToast,
  nodeStartedToast,
  nodeStartErrorToast,
  nodeStopErrorToast,
  nodeStoppedToast,
  startingNodeToast,
  stoppingNodeToast,
  successRemovingNodeStorageToast,
  successNodeSetDefaultOptionsToast,
} from '../../lib/node-manager/node-manager-toasts-utils';
import { useAuth } from '../../store/auth';
import { useNodeManager } from '../../store/node-manager';
import { useSyncStorageSecondary } from '../../store/sync-utils';
import { Logs } from './components/logs';

const App = () => {
  useEffect(() => {
    void info('initializing node-manager');
  }, []);
  useSyncStorageSecondary();
  const setLogout = useAuth((auth) => auth.setLogout);
  const { setNodeOptions } = useNodeManager();
  const [isConfirmResetDialogOpened, setIsConfirmResetDialogOpened] =
    useState<boolean>(false);
  const { data: nodeIsRunning } = useNodeIsRunningQuery({
    refetchInterval: 1000,
  });
  const { data: nodeOptions } = useNodeGetOptionsQuery({
    refetchInterval: 1000,
  });

  const {
    isPending: nodeSpawnIsPending,
    mutateAsync: nodeSpawn,
  } = useNodeSpawnMutation({
    onMutate: () => {
      startingNodeToast();
    },
    onSuccess: () => {
      nodeStartedToast();
    },
    onError: () => {
      nodeStartErrorToast();
    },
  });
  const { isPending: nodeKillIsPending, mutateAsync: nodeKill } =
    useNodeKillMutation({
      onMutate: () => {
        stoppingNodeToast();
      },
      onSuccess: () => {
        nodeStoppedToast();
      },
      onError: () => {
        nodeStopErrorToast();
      },
    });
  const {
    isPending: nodeRemoveStorageIsPending,
    mutateAsync: nodeRemoveStorage,
  } = useNodeRemoveStorageMutation({
    onSuccess: async () => {
      successRemovingNodeStorageToast();
      setNodeOptions(null);
      setLogout();
    },
    onError: () => {
      errorRemovingNodeStorageToast();
    },
  });
  const { mutateAsync: nodeSetOptions } =
    useNodeSetOptionsMutation({
      onSuccess: (options) => {
        setNodeOptions(options);
      },
    });
  const { mutateAsync: nodeSetDefaultOptions } =
    useNodeSetDefaultOptionsMutation({
      onSuccess: (options) => {
        nodeOptionsForm.reset(options);
        successNodeSetDefaultOptionsToast();
      },
    });
  const nodeOptionsForm = useForm<Partial<NodeOptions>>({
    resolver: zodResolver(z.any()),
  });
  const nodeOptionsFormWatch = useWatch({
    control: nodeOptionsForm.control,
  });

  useNodeEventsToast();

  useEffect(() => {
    const options = {
      ...nodeOptions,
      ...nodeOptionsFormWatch,
    };
    void nodeSetOptions(options as NodeOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeOptionsFormWatch, nodeSetOptions]);

  const handleReset = (): void => {
    setIsConfirmResetDialogOpened(false);
    void nodeRemoveStorage({ preserveKeys: true });
  };

  const [nodeOptionsForUI, setNodeOptionsForUI] =
    useState<Partial<NodeOptions>>();

  useEffect(() => {
    const filteredNodeOptionsKeys: (keyof NodeOptions)[] = [
      'secret_desktop_installation_proof_key',
    ];
    setNodeOptionsForUI(
      Object.fromEntries(
        Object.entries(nodeOptions ?? {}).filter(
          ([key]) =>
            !filteredNodeOptionsKeys.includes(
              key as keyof NodeOptions,
            ),
        ),
      ) as Partial<NodeOptions>,
    );
  }, [nodeOptions]);

  return (
    <div className="flex h-screen w-full flex-col space-y-2">
      <div
        className="absolute top-0 z-50 h-6 w-full"
        data-tauri-drag-region={true}
      />
      <div className="flex flex-row items-center px-4 pt-10 pb-4">
        <img alt="logo" className="h-8 w-8" src="/app-logo.png" />
        <div className="ml-3 flex flex-col">
          <span className="text-base font-medium">Node</span>
          <span className="text-text-secondary text-xs">{`API URL: http://${nodeOptions?.node_api_ip}:${nodeOptions?.node_api_port}`}</span>
        </div>
        <div className="flex grow flex-row items-center justify-end space-x-4">
          <Tooltip>
            <TooltipTrigger>
              <Button
                disabled={
                  nodeSpawnIsPending ||
                  nodeKillIsPending ||
                  nodeIsRunning
                }
                onClick={() => {
                  console.log('spawning');
                  void nodeSpawn();
                }}
                variant={'outline'}
                size={'icon'}
              >
                {nodeSpawnIsPending || nodeKillIsPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <PlayIcon className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side="bottom">
                <p>Start Node</p>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                disabled={
                  nodeSpawnIsPending ||
                  nodeKillIsPending ||
                  !nodeIsRunning
                }
                onClick={() => nodeKill()}
                variant={'outline'}
                size={'icon'}
              >
                {nodeKillIsPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <StopIcon className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side="bottom">
                <p>Stop Node</p>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                disabled={nodeIsRunning}
                onClick={() => setIsConfirmResetDialogOpened(true)}
                variant={'outline'}
                size={'icon'}
              >
                {nodeRemoveStorageIsPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side="bottom">
                <p>Reset Node</p>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </div>
      </div>

      <Tabs
        className="mt-4 flex h-full w-full flex-col overflow-hidden p-4"
        defaultValue="app-logs"
      >
        <TabsList className="flex h-10 w-fit items-center gap-2 rounded-full bg-transparent px-1 py-1">
          <TabsTrigger
            className={cn(
              'flex flex-col rounded-full px-4 py-1.5 text-base font-medium transition-colors',
              'data-[state=active]:bg-bg-quaternary data-[state=active]:text-text-default',
              'data-[state=inactive]:text-text-tertiary data-[state=inactive]:bg-transparent',
              'focus-visible:outline-hidden',
            )}
            value="app-logs"
          >
            App Logs
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              'flex flex-col rounded-full px-4 py-1.5 text-base font-medium transition-colors',
              'data-[state=active]:bg-bg-quaternary data-[state=active]:text-text-default',
              'data-[state=inactive]:text-text-tertiary data-[state=inactive]:bg-transparent',
              'focus-visible:outline-hidden',
            )}
            value="options"
          >
            Options
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              'flex flex-col rounded-full px-4 py-1.5 text-base font-medium transition-colors',
              'data-[state=active]:bg-bg-quaternary data-[state=active]:text-text-default',
              'data-[state=inactive]:text-text-tertiary data-[state=inactive]:bg-transparent',
              'focus-visible:outline-hidden',
            )}
            value="models"
          >
            Models
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              'flex flex-col rounded-full px-4 py-1.5 text-base font-medium transition-colors',
              'data-[state=active]:bg-bg-quaternary data-[state=active]:text-text-default',
              'data-[state=inactive]:text-text-tertiary data-[state=inactive]:bg-transparent',
              'focus-visible:outline-hidden',
            )}
            value="model-tools"
          >
            Model Tools
          </TabsTrigger>
        </TabsList>
        <TabsContent className="h-full overflow-hidden" value="app-logs">
          <Logs />
        </TabsContent>
        <TabsContent className="h-full overflow-hidden" value="options">
          <ScrollArea className="flex h-full flex-1 flex-col overflow-auto [&>div>div]:!block">
            <div className="flex flex-row justify-end pr-4">
              <Button
                className=""
                disabled={nodeIsRunning}
                onClick={() => nodeSetDefaultOptions()}
                variant={'outline'}
                size={'sm'}
              >
                Restore default
              </Button>
            </div>
            <div className="mt-2 h-full [&>div>div]:!block">
              <Form {...nodeOptionsForm}>
                <form className="space-y-2 pr-4">
                  {nodeOptionsForUI &&
                    Object.entries(nodeOptionsForUI).map(
                      ([key, value]) => {
                        return (
                          <FormField
                            control={nodeOptionsForm.control}
                            defaultValue={value}
                            disabled={nodeIsRunning}
                            key={key}
                            name={key as keyof NodeOptions}
                            render={({ field }) => (
                              <TextField
                                field={field}
                                label={<span className="uppercase">{key}</span>}
                              />
                            )}
                          />
                        );
                      },
                    )}
                </form>
              </Form>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          className="h-full overflow-y-auto pb-2"
          value="models"
        >
          <LocalModelBrowser />
        </TabsContent>

        <TabsContent
          className="h-full overflow-hidden pb-2"
          value="model-tools"
        >
          <ModelTools />
        </TabsContent>
      </Tabs>
      <AlertDialog
        onOpenChange={setIsConfirmResetDialogOpened}
        open={isConfirmResetDialogOpened}
      >
        <AlertDialogContent className="w-[75%]">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset your Node</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col space-y-3 text-left text-white/70">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm">
                    Are you sure you want to reset your Node? This will
                    permanently delete all your data.
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex justify-end gap-1">
            <AlertDialogCancel
              className="mt-0 min-w-[120px]"
              onClick={() => {
                setIsConfirmResetDialogOpened(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="min-w-[120px]"
              onClick={() => handleReset()}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <QueryClientProvider client={nodeQueryClient}>
    <React.StrictMode>
      <TooltipProvider>
        <App />
        <Toaster />
      </TooltipProvider>
    </React.StrictMode>
  </QueryClientProvider>,
);
