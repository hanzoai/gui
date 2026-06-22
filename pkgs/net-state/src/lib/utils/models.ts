/**
 * A single entry of the native Zen catalog (`modelsConfig[Models.Hanzo].modelTypes`).
 *
 * THE one catalog-entry shape. The Local Models gallery segments the catalog by
 * these flags: no flag = Chat, `embedding` = Embeddings, `reranker` = Reranker.
 * `value` is the Hugging Face repo id the on-device engine pulls weights from;
 * `file`/`format` pin an explicit quantized artifact when the repo is GGUF.
 */
export type ZenModelEntry = {
  /** Display name, e.g. "Zen Nano 0.6B". */
  name: string;
  /** Hugging Face repo id, e.g. "zenlm/zen-nano-0.6b". */
  value: string;
  /** Explicit GGUF file within the repo when it is quantized. */
  file?: string;
  /** Weight format, e.g. "gguf". */
  format?: string;
  /** Human-readable on-disk size, e.g. "~0.7 GB". */
  size?: string;
  /** Text-embedding model (served by the embed engine). */
  embedding?: boolean;
  /** Cross-encoder reranker model. */
  reranker?: boolean;
};

export enum Models {
  // Native first-party engine (downloads Zen models from HF, runs locally).
  // First in the list so it's the default engine; Ollama / LM Studio are
  // alternative local engines users can pick instead.
  Hanzo = 'hanzo',
  OpenAI = 'open-ai',
  OpenAILegacy = 'open-ai-legacy',
  TogetherComputer = 'togethercomputer',
  Ollama = 'ollama',
  LMStudio = 'lmstudio',
  Gemini = 'gemini',
  Exo = 'exo',
  Groq = 'groq',
  OpenRouter = 'openrouter',
  Claude = 'claude',
  DeepSeek = 'deepseek',
  Grok = 'grok',
}

/**
 * The native Zen catalog — first-party models from huggingface.co/zenlm served
 * locally by the on-device engine. THE single catalog source; the Local Models
 * gallery segments it by `embedding` / `reranker` flags. `value` is the HF repo
 * id so the engine pulls weights natively on first use.
 */
export const zenCatalog: ZenModelEntry[] = [
  {
    name: 'Zen Nano 0.6B',
    value: 'zenlm/zen-nano-0.6b',
    // GGUF-quantized; the engine needs the explicit file + format.
    file: 'gguf/zen-nano-0.6b-Q8_0.gguf',
    format: 'gguf',
    size: '~0.7 GB',
  },
  { name: 'Zen Eco 4B', value: 'zenlm/zen-eco-4b-instruct', size: '~8 GB' },
  {
    name: 'Zen Eco 4B Thinking',
    value: 'zenlm/zen-eco-4b-thinking',
    size: '~8 GB',
  },
  { name: 'Zen 3 Nano', value: 'zenlm/zen3-nano', size: '~1.2 GB' },
  {
    name: 'Zen Eco 4B Agent',
    value: 'zenlm/zen-eco-4b-agent-gguf',
    file: 'zen-eco-4b-agent-Q4_K_M-fixed.gguf',
    format: 'gguf',
    size: '~2.5 GB',
  },

  // --- Zen 5 generation (current flagship family) ---
  {
    name: 'Zen 5',
    value: 'zenlm/zen-5-gguf',
    file: 'Huihui-Qwen3.6-35B-A3B-abliterated-ggml-model-Q4_K.gguf',
    format: 'gguf',
    size: '~21 GB',
  },
  {
    name: 'Zen 5 Mini',
    value: 'zenlm/zen-5-mini-gguf',
    file: 'MiniMax-M2.5-abliterated-Q4_K_M.gguf',
    format: 'gguf',
  },
  { name: 'Zen 5 Pro', value: 'zenlm/zen-5-pro' },
  { name: 'Zen 5 Coder', value: 'zenlm/zen-5-coder' },
  { name: 'Zen Agent 4B', value: 'zenlm/zen-agent-4b', size: '~8 GB' },

  // --- Zen VL (vision-language) ---
  { name: 'Zen VL 4B', value: 'zenlm/zen-vl-4b-instruct', size: '~8 GB' },
  { name: 'Zen VL 8B', value: 'zenlm/zen-vl-8b-instruct', size: '~16 GB' },

  // --- Zen Omni (any-to-any) ---
  { name: 'Zen Omni 30B', value: 'zenlm/zen-omni-30b-instruct', size: '~60 GB' },

  {
    name: 'Zen Embedding',
    value: 'zenlm/zen-embedding',
    embedding: true,
    size: '~1.2 GB',
  },
  {
    name: 'Zen Embedding 0.6B',
    value: 'zenlm/zen-embedding-0.6B',
    embedding: true,
    size: '~1.2 GB',
  },
  {
    name: 'Zen Embedding 0.6B (GGUF)',
    value: 'zenlm/zen-embedding-0.6B-GGUF',
    file: 'zen-embedding-0.6B-Q8_0.gguf',
    format: 'gguf',
    embedding: true,
    size: '~0.7 GB',
  },
  {
    name: 'Zen Embedding 4B',
    value: 'zenlm/zen-embedding-4B',
    embedding: true,
    size: '~8 GB',
  },
  {
    name: 'Zen Embedding 8B (GGUF)',
    value: 'zenlm/zen-embedding-8B-GGUF',
    embedding: true,
    format: 'gguf',
    size: '~8 GB',
  },
  {
    name: 'Zen Reranker',
    value: 'zenlm/zen-reranker',
    reranker: true,
    size: '~1.2 GB',
  },
  {
    name: 'Zen Reranker 0.6B (GGUF)',
    value: 'zenlm/zen-reranker-0.6B-GGUF',
    file: 'zen-reranker-0.6B-Q8_0.gguf',
    format: 'gguf',
    reranker: true,
    size: '~0.7 GB',
  },
  {
    name: 'Zen Reranker 4B (GGUF)',
    value: 'zenlm/zen-reranker-4B-GGUF',
    file: 'zen-reranker-4B-Q4_K_M.gguf',
    format: 'gguf',
    reranker: true,
    size: '~2.5 GB',
  },
  {
    name: 'Zen Reranker 8B (GGUF)',
    value: 'zenlm/zen-reranker-8B-GGUF',
    file: 'zen-reranker-8B-Q4_K_M.gguf',
    format: 'gguf',
    reranker: true,
    size: '~5 GB',
  },
];

/**
 * Featured community models — a curated, LM-Studio-style list of popular public
 * GGUF models the native Hanzo engine can pull from Hugging Face and run.
 *
 * Same `ZenModelEntry[]` shape and same download path as `zenCatalog`; rendered
 * as a "Featured" segment in the Local Models gallery. Every `value` is a
 * verified-PUBLIC HF repo (no gated meta-llama/google/mistralai originals — only
 * open GGUF mirrors), and every `file` is a real Q4_K_M artifact that exists in
 * the repo (the first shard when the quant is split). These are chat models, so
 * no `embedding`/`reranker` flags.
 */
export const featuredCatalog: ZenModelEntry[] = [
  {
    name: 'Qwen2.5 3B Instruct',
    value: 'Qwen/Qwen2.5-3B-Instruct-GGUF',
    file: 'qwen2.5-3b-instruct-q4_k_m.gguf',
    format: 'gguf',
    size: '~2 GB',
  },
  {
    name: 'Qwen2.5 7B Instruct',
    value: 'Qwen/Qwen2.5-7B-Instruct-GGUF',
    // Q4_K_M is sharded; the engine resolves the rest from the first shard.
    file: 'qwen2.5-7b-instruct-q4_k_m-00001-of-00002.gguf',
    format: 'gguf',
    size: '~4.7 GB',
  },
  {
    name: 'Llama 3.2 3B Instruct',
    value: 'bartowski/Llama-3.2-3B-Instruct-GGUF',
    file: 'Llama-3.2-3B-Instruct-Q4_K_M.gguf',
    format: 'gguf',
    size: '~2 GB',
  },
  {
    name: 'Llama 3.1 8B Instruct',
    value: 'bartowski/Meta-Llama-3.1-8B-Instruct-GGUF',
    file: 'Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf',
    format: 'gguf',
    size: '~4.9 GB',
  },
  {
    name: 'Gemma 2 2B Instruct',
    value: 'bartowski/gemma-2-2b-it-GGUF',
    file: 'gemma-2-2b-it-Q4_K_M.gguf',
    format: 'gguf',
    size: '~1.7 GB',
  },
  {
    name: 'Mistral 7B Instruct v0.3',
    value: 'bartowski/Mistral-7B-Instruct-v0.3-GGUF',
    file: 'Mistral-7B-Instruct-v0.3-Q4_K_M.gguf',
    format: 'gguf',
    size: '~4.4 GB',
  },
  {
    name: 'DeepSeek R1 Distill Qwen 7B',
    value: 'bartowski/DeepSeek-R1-Distill-Qwen-7B-GGUF',
    file: 'DeepSeek-R1-Distill-Qwen-7B-Q4_K_M.gguf',
    format: 'gguf',
    size: '~4.7 GB',
  },
];

export const modelsConfig = {
  // Native Hanzo engine — Zen catalog (zenCatalog). Apps point apiUrl at their
  // own engine port (hanzo 36900 / zoo 36910 / lux 36920) via the local-node
  // config; the engine downloads each `value` repo from Hugging Face natively.
  [Models.Hanzo]: {
    apiUrl: 'http://localhost:36900',
    modelTypes: zenCatalog,
  },
  [Models.OpenAI]: {
    apiUrl: 'https://api.openai.com',
    modelTypes: [
      {
        name: 'GPT 5.1',
        value: 'gpt-5.1',
      },
      {
        name: 'GPT 5',
        value: 'gpt-5',
      },
      {
        name: 'GPT 5 Mini',
        value: 'gpt-5-mini',
      },
      {
        name: 'GPT 5 Nano',
        value: 'gpt-5-nano',
      },
      {
        name: 'GPT 4o Mini',
        value: 'gpt-4o-mini',
      },
      {
        name: 'GPT 4o',
        value: 'gpt-4o',
      },
      {
        name: 'GPT 4-1106 Preview',
        value: 'gpt-4-1106-preview',
      },
      {
        name: 'GPT 4 Vision Preview',
        value: 'gpt-4-vision-preview',
      },
      {
        name: 'GPT 3.5 Turbo 1106',
        value: 'gpt-3.5-turbo-1106',
      },
      {
        name: 'GPT 4.1',
        value: 'gpt-4.1',
      },
      {
        name: 'GPT 4.1 Mini',
        value: 'gpt-4.1-mini',
      },
      {
        name: 'GPT 4.1 Nano',
        value: 'gpt-4.1-nano',
      },
      {
        name: '4o Preview',
        value: '4o-preview',
      },
      {
        name: '4o Mini',
        value: '4o-mini',
      },
      {
        name: 'o1',
        value: 'o1',
      },
      {
        name: 'o1 Mini',
        value: 'o1-mini',
      },
      {
        name: 'o3 Mini',
        value: 'o3-mini',
      },
    ],
  },
  [Models.OpenAILegacy]: {
    apiUrl: 'https://api.openai.com',
    modelTypes: [
      {
        name: 'GPT 5.1',
        value: 'gpt-5.1',
      },
      {
        name: 'GPT 5',
        value: 'gpt-5',
      },
      {
        name: 'GPT 5 Mini',
        value: 'gpt-5-mini',
      },
      {
        name: 'GPT 5 Nano',
        value: 'gpt-5-nano',
      },
      {
        name: 'GPT 4o Mini',
        value: 'gpt-4o-mini',
      },
      {
        name: 'GPT 4o',
        value: 'gpt-4o',
      },
      {
        name: 'GPT 4-1106 Preview',
        value: 'gpt-4-1106-preview',
      },
      {
        name: 'GPT 4 Vision Preview',
        value: 'gpt-4-vision-preview',
      },
      {
        name: 'GPT 3.5 Turbo 1106',
        value: 'gpt-3.5-turbo-1106',
      },
      {
        name: 'GPT 4.1',
        value: 'gpt-4.1',
      },
      {
        name: 'GPT 4.1 Mini',
        value: 'gpt-4.1-mini',
      },
      {
        name: 'GPT 4.1 Nano',
        value: 'gpt-4.1-nano',
      },
      {
        name: '4o Preview',
        value: '4o-preview',
      },
      {
        name: '4o Mini',
        value: '4o-mini',
      },
      {
        name: 'o1',
        value: 'o1',
      },
      {
        name: 'o1 Mini',
        value: 'o1-mini',
      },
      {
        name: 'o3 Mini',
        value: 'o3-mini',
      },
    ],
  },
  [Models.TogetherComputer]: {
    apiUrl: 'https://api.together.xyz',
    modelTypes: [
      {
        name: 'Meta - LLaMA-2 Chat (70B)',
        value: 'togethercomputer/llama-2-70b-chat',
      },
      {
        name: 'mistralai - Mistral (7B) Instruct',
        value: 'mistralai/Mistral-7B-Instruct-v0.1',
      },
      {
        name: 'teknium - OpenHermes-2-Mistral (7B)',
        value: 'teknium/OpenHermes-2-Mistral-7B',
      },
      {
        name: 'OpenOrca - OpenOrca Mistral (7B) 8K',
        value: 'Open-Orca/Mistral-7B-OpenOrca',
      },
    ],
  },
  [Models.Gemini]: {
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    modelTypes: [
      {
        name: 'Gemini 3 Pro Preview',
        value: 'gemini-3-pro-preview',
      },
      {
        name: 'Gemini 2.5 Pro',
        value: 'gemini-2.5-pro',
      },
      {
        name: 'Gemini 2.5 Flash',
        value: 'gemini-2.5-flash',
      },
      {
        name: 'Gemini 2.5 Flash-Lite',
        value: 'gemini-2.5-flash-lite',
      },
      {
        name: 'Gemini 2.5 Flash Native Audio',
        value: 'gemini-2.5-flash-preview-native-audio-dialog',
      },
      {
        name: 'Gemini 2.5 Flash Exp Native Audio',
        value: 'gemini-2.5-flash-exp-native-audio-thinking-dialog',
      },
      {
        name: 'Gemini 2.5 Flash Preview TTS',
        value: 'gemini-2.5-flash-preview-tts',
      },
      {
        name: 'Gemini 2.5 Pro Preview TTS',
        value: 'gemini-2.5-pro-preview-tts',
      },
      {
        name: 'Gemini 2.0 Flash',
        value: 'gemini-2.0-flash',
      },
      {
        name: 'Gemini 2.0 Flash Preview Image Generation',
        value: 'gemini-2.0-flash-preview-image-generation',
      },
      {
        name: 'Gemini 2.0 Flash-Lite',
        value: 'gemini-2.0-flash-lite',
      },
      {
        name: 'Gemini 2.0 Flash Live',
        value: 'gemini-2.0-flash-live-001',
      },
      {
        name: 'Gemini 1.5 Flash',
        value: 'gemini-1.5-flash',
      },
      {
        name: 'Gemini 1.5 Flash-8B',
        value: 'gemini-1.5-flash-8b',
      },
      {
        name: 'Gemini 1.5 Pro',
        value: 'gemini-1.5-pro',
      },
      {
        name: 'Gemini Embedding',
        value: 'gemini-embedding-exp',
      },
      {
        name: 'Imagen 3',
        value: 'imagen-3.0-generate-002',
      },
      {
        name: 'Veo 2',
        value: 'veo-2.0-generate-001',
      },
    ],
  },
  [Models.Exo]: {
    apiUrl: 'http://localhost:8000',
    modelTypes: [
      {
        name: 'Llama3.1-8b',
        value: 'llama3.1-8b',
      },
    ],
  },
  [Models.Groq]: {
    apiUrl: 'https://api.groq.com/openai/v1',
    modelTypes: [
      // Production Models
      { name: 'Groq Compound', value: 'groq/compound' },
      { name: 'Groq Compound Mini', value: 'groq/compound-mini' },
      { name: 'Llama 3.1 8B Instant', value: 'llama-3.1-8b-instant' },
      { name: 'Llama 3.3 70B Versatile', value: 'llama-3.3-70b-versatile' },
      { name: 'Llama Guard 4 12B', value: 'meta-llama/llama-guard-4-12b' },
      { name: 'OpenAI GPT-OSS 120B', value: 'openai/gpt-oss-120b' },
      { name: 'OpenAI GPT-OSS 20B', value: 'openai/gpt-oss-20b' },
      {
        name: 'DeepSeek R1 Distill Llama 70B',
        value: 'deepseek-r1-distill-llama-70b',
      },      

      // Speech-to-Text (Production)
      { name: 'Whisper Large v3', value: 'whisper-large-v3' },
      { name: 'Whisper Large v3 Turbo', value: 'whisper-large-v3-turbo' },

      // Preview Models
      {
        name: 'Llama 4 Maverick 17B Instruct',
        value: 'meta-llama/llama-4-maverick-17b-128e-instruct',
      },
      {
        name: 'Llama 4 Scout 17B Instruct',
        value: 'meta-llama/llama-4-scout-17b-16e-instruct',
      },
      {
        name: 'Llama Prompt Guard 2 22M',
        value: 'meta-llama/llama-prompt-guard-2-22m',
      },
      {
        name: 'Llama Prompt Guard 2 86M',
        value: 'meta-llama/llama-prompt-guard-2-86m',
      },
      {
        name: 'Kimi K2 Instruct',
        value: 'moonshotai/kimi-k2-instruct',
      },
      { name: 'Qwen3 32B', value: 'qwen/qwen3-32b' },

      // Text-to-Speech (Preview)
      { name: 'PlayAI TTS', value: 'playai-tts' },
      { name: 'PlayAI TTS Arabic', value: 'playai-tts-arabic' },
    ],
  },
  [Models.OpenRouter]: {
    apiUrl: 'https://openrouter.ai',
    modelTypes: [],
  },
  [Models.Claude]: {
    apiUrl: 'https://api.anthropic.com',
    modelTypes: [
      {
        name: 'Claude 4.1 Opus',
        value: 'claude-opus-4-1',
      },
      {
        name: 'Claude 4 Opus',
        value: 'claude-opus-4-0',
      },
      {
        name: 'Claude 4 Sonnet',
        value: 'claude-sonnet-4-0',
      },
      {
        name: 'Claude 3.7 Sonnet',
        value: 'claude-3-7-sonnet-latest',
      },
      {
        name: 'Claude 3.5 Haiku',
        value: 'claude-3-5-haiku-latest',
      },
    ],
  },
  [Models.DeepSeek]: {
    apiUrl: 'https://api.deepseek.com',
    modelTypes: [
      {
        name: 'DeepSeek Chat',
        value: 'deepseek-chat',
      },
      {
        name: 'DeepSeek Reasoner',
        value: 'deepseek-reasoner',
      },
    ],
  },
  [Models.Grok]: {
    apiUrl: 'https://api.x.ai',
    modelTypes: [
      {
        name: 'Grok 4',
        value: 'grok-4',
      },
      {
        name: 'Grok 3',
        value: 'grok-3',
      },
      {
        name: 'Grok 3 Mini',
        value: 'grok-3-mini',
      },
      {
        name: 'Grok 3 Fast',
        value: 'grok-3-fast',
      },
      {
        name: 'Grok 3 Mini Fast',
        value: 'grok-3-mini-fast',
      },
      {
        name: 'Grok 2 Vision',
        value: 'grok-2-vision',
      },
    ],
  },
  [Models.LMStudio]: {
    apiUrl: 'http://localhost:1234/v1',
    modelTypes: [
      {
        name: 'Loaded Model',
        value: 'loaded-model',
      },
      {
        name: 'Custom Model',
        value: 'custom',
      },
      {
        name: 'Llama 3.2 3B',
        value: 'llama-3.2-3b',
      },
      {
        name: 'Llama 3.2 1B',
        value: 'llama-3.2-1b',
      },
      {
        name: 'Mistral 7B',
        value: 'mistral-7b-instruct-v0.2',
      },
      {
        name: 'Qwen 2.5 7B',
        value: 'qwen2.5-7b-instruct',
      },
      {
        name: 'Phi 3 Mini',
        value: 'phi-3-mini-4k-instruct',
      },
      {
        name: 'DeepSeek Coder 6.7B',
        value: 'deepseek-coder-6.7b-instruct',
      },
      {
        name: 'Gemma 2B',
        value: 'gemma-2b-it',
      },
    ],
  },
};