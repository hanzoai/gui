// Friendly display names for local-engine models. The node's default provider sends
// a generic alias ("default" / "openai:default" / "local:default") to the engine,
// which currently runs zen-nano-0.6b. Display-only — never changes the wire value
// sent to the engine.
const MODEL_DISPLAY_NAMES: Record<string, string> = {
  'openai:default': 'Zen Nano 0.6B',
  'local:default': 'Zen Nano 0.6B',
  default: 'Zen Nano 0.6B',
};

// Turn a raw model wire string into a human label when it isn't a known alias:
// strip any provider prefix ("openai:"), drop a path + file extension, recognise the
// Zen families, otherwise title-case what's left. This is what makes the selector show
// the actual MODEL (e.g. "Zen Nano 0.6B") instead of the provider name ("Zen Engine").
const deriveModelLabel = (model: string): string => {
  const tail = model.split(':').pop() ?? model; // openai:foo -> foo
  const base = (tail.split('/').pop() ?? tail) // a/b/zen-nano.gguf -> zen-nano.gguf
    .replace(/\.(gguf|safetensors|bin|pth|ggml)$/i, ''); // -> zen-nano
  if (/zen-?nano/i.test(base)) return 'Zen Nano 0.6B';
  if (/zen-?eco/i.test(base)) return 'Zen Eco 3B';
  if (/zen-?coder/i.test(base)) return 'Zen Coder';
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
};

/**
 * Friendly, precise model label for an LLM provider. Maps known generic aliases,
 * otherwise derives a clean name from the wire model string, and only falls back to
 * the provider's own name/id when there is no model string at all.
 */
export const getProviderModelLabel = (
  model: string | undefined,
  fallback: string,
): string => {
  if (!model) return fallback;
  return MODEL_DISPLAY_NAMES[model] ?? (deriveModelLabel(model) || fallback);
};
