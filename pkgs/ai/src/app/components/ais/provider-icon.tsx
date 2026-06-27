import { AisIcon, ZenIcon } from '@hanzo_network/hanzo-ui/assets';
import { useMemo } from 'react';

import { type ModelProviderKey, providerMappings } from './constants';

// Zen-family models are served over an OpenAI-compatible protocol, so their
// provider key is `openai`/`openai-legacy`. Brand them by the model instead so
// the switcher shows the Zen enso ring, not the OpenAI mark.
const isZenModel = (s?: string) => !!s && /(^|[^a-z])zen([^a-z]|$)|zenlm/i.test(s);

export interface ProviderIconProps {
  className?: string;
  provider?: ModelProviderKey | string;
  /** Model id or name; when it's a zen model the Zen ring wins over the provider. */
  model?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
}

const ProviderIcon = ({
  provider: originProvider,
  model,
  ref,
  ...rest
}: ProviderIconProps) => {
  const Icon = useMemo(() => {
    if (isZenModel(model) || isZenModel(originProvider)) return ZenIcon;
    if (!originProvider) return AisIcon;
    const provider = originProvider.toLowerCase();
    if (providerMappings[provider as ModelProviderKey]) {
      return providerMappings[provider as ModelProviderKey];
    }
    return AisIcon;
  }, [originProvider, model]);

  const props = {
    ...rest,
    ref,
  };

  return <Icon {...props} />;
};

ProviderIcon.displayName = 'ProviderIcon';

export default ProviderIcon;
