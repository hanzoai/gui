import {
  AnthropicIcon,
  AyaCohereIcon,
  DeepSeekIcon,
  ExoIcon,
  GeminiIcon,
  GoogleIcon,
  GrokIcon,
  GroqIcon,
  LmStudioIcon,
  MetaIcon,
  OllamaIcon,
  MistralIcon,
  OpenAIIcon,
  ZenIcon,
  OpenRouterIcon,
  PerplexityIcon,
  QwenIcon,
  Icon,
  TogetherAI,
} from '@hanzo_network/hanzo-ui/assets';

export enum ModelProvider {
  Aya = 'aya',
  Claude = 'claude',
  DeepSeek = 'deepseek',
  Exo = 'exo',
  Gemini = 'gemini',
  Google = 'google',
  Grok = 'grok',
  Groq = 'groq',
  LmStudio = 'lmstudio',
  Meta = 'meta',
  Ollama = 'ollama',
  Mistral = 'mistral',
  OpenAI = 'openai',
  OpenRouter = 'openrouter',
  Perplexity = 'perplexity',
  Qwen = 'qwen',
  'Hanzo-Backend' = 'hanzo-backend',
  TogetherAI = 'togetherai',
}

export type ModelProviderKey = Lowercase<keyof typeof ModelProvider>;

export const providerMappings = {
  [ModelProvider.Aya]: AyaCohereIcon,
  [ModelProvider.Claude]: AnthropicIcon,
  [ModelProvider.DeepSeek]: DeepSeekIcon,
  [ModelProvider.Exo]: ExoIcon,
  [ModelProvider.Gemini]: GeminiIcon,
  [ModelProvider.Google]: GoogleIcon,
  [ModelProvider.Grok]: GrokIcon,
  [ModelProvider.Groq]: GroqIcon,
  [ModelProvider.LmStudio]: LmStudioIcon,
  [ModelProvider.Mistral]: MistralIcon,
  [ModelProvider.Meta]: MetaIcon,
  [ModelProvider.Ollama]: OllamaIcon,
  [ModelProvider.OpenAI]: OpenAIIcon,
  // Zen-family local models also speak the OpenAI-compatible API; ProviderIcon
  // brands those by model name (Zen ring), so the raw `openai-legacy` key keeps
  // the OpenAI mark for any real legacy-OpenAI provider.
  'openai-legacy': OpenAIIcon,
  [ModelProvider.OpenRouter]: OpenRouterIcon,
  [ModelProvider.Perplexity]: PerplexityIcon,
  [ModelProvider.Qwen]: QwenIcon,
  [ModelProvider['Hanzo-Backend']]: Icon,
  [ModelProvider.TogetherAI]: TogetherAI,
};
