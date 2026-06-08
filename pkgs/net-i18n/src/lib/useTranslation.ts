import { useChain } from '@hanzo_network/chain-config';
import { createElement } from 'react';
import {
  Trans as I18NextTrans,
  useTranslation as useI18NextTranslation,
} from 'react-i18next';

// Inject the active chain's product name as the {{appName}} interpolation
// variable on EVERY t()/<Trans> call. This is what makes chain-neutral copy
// ('Welcome to {{appName}}', etc.) render per-chain — without per-chain locale
// overlays and without relying on the build-frozen VITE_BRAND. i18next's
// init-time `defaultVariables` can't be mutated after the interpolator is
// constructed, so we inject per-call instead. getChain() returns the runtime-
// injected chain (set by <HanzoAI> before mount), so this is correct per app.
export const useTranslation = () => {
  const { t: baseT, i18n, ready } = useI18NextTranslation();
  // useChain() returns the runtime-INJECTED chain (set by <HanzoAI> before
  // mount). getChain() must NOT be used here — it ignores the injection and
  // falls back to the build-frozen VITE_BRAND (→ always Hanzo).
  const appName = useChain().name;

  const t = ((key: unknown, options?: unknown) =>
    baseT(key as never, {
      appName,
      ...((options as Record<string, unknown>) ?? {}),
    } as never)) as typeof baseT;

  const Trans = ((props: Record<string, unknown>) =>
    createElement(I18NextTrans, {
      ...props,
      values: { appName, ...((props.values as Record<string, unknown>) ?? {}) },
    })) as typeof I18NextTrans;

  return { t, Trans, i18n, ready };
};
