import {
  addLLMProvider as addLLMProviderAPI,
  testLLMProvider,
} from '@hanzo_network/hanzo-message-ts/api/jobs/index';

import { type AddLLMProviderInput } from './types';

export const addLLMProvider = async ({
  nodeAddress,
  token,
  agent,
  enableTest,
}: AddLLMProviderInput) => {
  // Local engines (the `LocalEngine` wire variant and the native `hanzo`
  // engine) are served by the always-reachable on-device OpenAI-compatible
  // engine and pull their weights from HF lazily on first use — a connectivity
  // probe would fail (e.g. an embedding model rejects a chat-style test). So we
  // skip the test for them. Callers can also opt out explicitly with
  // `enableTest: false` (and force it back on with `enableTest: true`).
  const isLocalEngineProvider =
    Boolean(agent.model.LocalEngine) || Boolean(agent.model.hanzo);
  const shouldTest = enableTest ?? !isLocalEngineProvider;
  if (shouldTest) {
    await testLLMProvider(nodeAddress, token, agent);
  }
  const data = await addLLMProviderAPI(nodeAddress, token, agent);
  return data;
};
