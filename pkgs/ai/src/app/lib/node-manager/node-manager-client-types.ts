export enum NodeManagerEvent {
  StartingNode = 'StartingHanzoNode',
  NodeStarted = 'HanzoNodeStarted',
  NodeStartError = 'HanzoNodeStartError',

  PullingModelStart = 'PullingModelStart',
  PullingModelProgress = 'PullingModelProgress',
  PullingModelDone = 'PullingModelDone',
  PullingModelError = 'PullingModelError',

  StoppingNode = 'StoppingHanzoNode',
  NodeStopped = 'HanzoNodeStopped',
  NodeStopError = 'HanzoNodeStopError',
}

export interface NodeStartErrorEvent {
  error: string;
}

export interface PullingModelStartEvent {
  model: string;
}
export interface PullingModelProgressEvent {
  model: string;
  progress: number;
}
export interface PullingModelDoneEvent {
  model: string;
}
export interface PullingModelErrorEvent {
  model: string;
  error: string;
}

export interface NodeStopErrorEvent {
  error: string;
}

export type NodeManagerEventMap =
  | { type: NodeManagerEvent.StartingNode; payload: never }
  | { type: NodeManagerEvent.NodeStarted; payload: never }
  | {
      type: NodeManagerEvent.NodeStartError;
      payload: NodeStartErrorEvent;
    }
  | {
      type: NodeManagerEvent.PullingModelStart;
      payload: PullingModelStartEvent;
    }
  | {
      type: NodeManagerEvent.PullingModelProgress;
      payload: PullingModelProgressEvent;
    }
  | {
      type: NodeManagerEvent.PullingModelDone;
      payload: PullingModelDoneEvent;
    }
  | {
      type: NodeManagerEvent.PullingModelError;
      payload: PullingModelErrorEvent;
    }
  | { type: NodeManagerEvent.StoppingNode; payload: never }
  | { type: NodeManagerEvent.NodeStopped; payload: never }
  | {
      type: NodeManagerEvent.NodeStopError;
      payload: NodeStopErrorEvent;
    };

export type NodeOptions = {
   node_api_ip?: string,
   node_api_port?: string,
   node_ws_port?: string,
   node_ip?: string,
   node_port?: string,
   global_identity_name?: string,
   node_storage_path?: string,
   embeddings_server_url?: string,
   first_device_needs_registration_code?: string,
   initial_agent_names?: string,
   initial_agent_urls?: string,
   initial_agent_models?: string,
   initial_agent_api_keys?: string,
   starting_num_qr_devices?: string,
   log_all?: string,
   proxy_identity?: string,
   rpc_url?: string,
   default_embedding_model?: string,
   supported_embedding_models?: string,
   hanzo_tools_runner_deno_binary_path?: string,
   hanzo_tools_runner_uv_binary_path?: string,
   hanzo_store_url?: string,
   secret_desktop_installation_proof_key?: string,
};

export type LogEntry = {
  timestamp: number;
  process: string;
  message: string;
};
