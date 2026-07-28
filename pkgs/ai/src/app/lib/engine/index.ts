/**
 * Engine - Embedded AI Inference
 *
 * This module provides the frontend interface to the embedded engine,
 * which runs in the Tauri backend and exposes an OpenAI-compatible API
 * on localhost:36900.
 *
 * Usage:
 * ```typescript
 * import { useEngine, engine } from '@/lib/engine';
 *
 * // In a React component:
 * const { status, loadModel, chat, streamChat } = useEngine();
 *
 * // Load a model
 * await loadModel({ model_id: 'path/to/model.gguf' });
 *
 * // Chat (non-streaming)
 * const response = await chat({
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 *
 * // Chat (streaming)
 * await streamChat(
 *   [{ role: 'user', content: 'Hello!' }],
 *   'default',
 *   { onChunk: (chunk) => console.log(chunk) }
 * );
 * ```
 */

// Types
export type {
  EngineStatus,
  LoadModelOptions,
  ChatMessage,
  ChatOptions,
  ChatChoice,
  UsageStats,
  ChatCompletionResponse,
  StreamChunk,
  ModelInfo,
  ModelsResponse,
  EngineError,
  ChatCompletionRequest,
  EmbeddingRequest,
  EmbeddingResponse,
} from './types';

export { EngineEvent, ModelFormat, detectModelFormat } from './types';

// Client
export { EngineClient, engine, ENGINE_BASE_URL } from './client';

// Brand-resolved engine URLs (single source of truth: brand `node.enginePort`)
export { getEngineUrl, getEmbeddingEngineUrl } from './engine-url';

// Hooks
export {
  engineQueryKeys,
  useEngineStatus,
  useEngineModels,
  useEngineAvailable,
  useLoadModel,
  useUnloadModel,
  useChat,
  useEmbeddings,
  useStreamingChat,
  useEngineReady,
  useEngine,
} from './hooks';
