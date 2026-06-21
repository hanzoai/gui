/**
 * Local engine detection.
 *
 * Three local engines can serve models on this machine, each speaking the
 * OpenAI-compatible HTTP API. We detect "is it running" by probing `/v1/models`
 * (or the engine status endpoint) at its conventional port:
 *
 *   • Hanzo Engine  — native; brand-specific port (hanzo 36900 / zoo 36910 /
 *                     lux 36920), resolved from the brand config.
 *   • Ollama        — 11434 (fixed).
 *   • LM Studio     — 1234  (fixed).
 *
 * One place, one way: the model browser reads this to show which engines are
 * available. No parallel probing logic elsewhere.
 */
import { Models } from '@hanzo_network/hanzo-node-state/lib/utils/models';

import { getEngineUrl } from '../hanzo-engine';

export interface LocalProvider {
  /** The Models enum key used by the add-AI / provider flow. */
  id: Models;
  /** Friendly engine name. */
  name: string;
  /** OpenAI-compatible base URL we probe / point providers at. */
  baseUrl: string;
  /** Short description shown in the engine picker. */
  description: string;
}

/** The native Hanzo engine for the active brand (URL from `node.enginePort`). */
export function hanzoProvider(): LocalProvider {
  return {
    id: Models.Hanzo,
    name: 'Hanzo Engine',
    baseUrl: getEngineUrl(),
    description:
      'Native on-device engine. Downloads first-party Zen models from Hugging Face and serves them locally — no API key, fully private.',
  };
}

export const OLLAMA_PROVIDER: LocalProvider = {
  id: Models.Ollama,
  name: 'Ollama',
  baseUrl: 'http://localhost:11434',
  description:
    'Run open models locally with Ollama. Detected automatically when the Ollama server is running.',
};

export const LM_STUDIO_PROVIDER: LocalProvider = {
  id: Models.LMStudio,
  name: 'LM Studio',
  baseUrl: 'http://localhost:1234',
  description:
    'Serve GGUF models locally with LM Studio. Detected automatically when its local server is running.',
};

/** All local engine choices (native first). */
export function localProviders(): LocalProvider[] {
  return [hanzoProvider(), OLLAMA_PROVIDER, LM_STUDIO_PROVIDER];
}

/** Probe a single engine's OpenAI-compatible endpoint. */
export async function isProviderRunning(p: LocalProvider): Promise<boolean> {
  for (const path of ['/v1/models', '/v1/engine/status', '/api/tags']) {
    try {
      const res = await fetch(`${p.baseUrl}${path}`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return true;
    } catch {
      // try the next path / give up
    }
  }
  return false;
}
