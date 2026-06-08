// Regression: the invalid-hook-call that blocked the web render. The chain
// store must be PLAIN module getters (not React hooks), because the migrated
// app calls useChain()/getChain() from module scope, utils and event handlers.
//
// Neutral by construction: this test uses FIXTURE brands (not hanzo/zoo/lux) —
// the package bundles no brands; hosts provide their own via setChain/registerBrands.
import { describe, it, expect, beforeEach } from 'vitest';
import {
  setChain,
  getChain,
  useChain,
  getChainFromHostname,
  registerBrands,
  type ChainConfig,
} from '@hanzo_network/chain-config';

const fixture = (id: string, host: string): ChainConfig => ({
  chain: id,
  name: id,
  productName: id,
  company: id,
  identifier: `com.${id}.desktop`,
  logo: { light: '', dark: '', favicon: '' },
  colors: { primary: '#000000', bg: '#000000', fg: '#ffffff' },
  hosts: [host],
  storeUrl: { mac: '', win: '', ios: '', android: '' },
  network: {
    rpc: '',
    chainId: 1,
    token: `$${id.toUpperCase()}`,
    aiMiningPrecompile: '0x0300000000000000000000000000000000000000',
    blockExplorer: '',
  },
  overlayController: `https://edge.${host}`,
  inferenceEndpoint: 'https://gateway.example',
  iam: {
    baseUrl: `https://${id}.id`,
    clientId: `${id}-app`,
    redirectUri: `${id}://oauth/${id}`,
    callbackEvent: `${id}-iam-callback`,
  },
});

const ALPHA = fixture('alpha', 'alpha.test');
const BETA = fixture('beta', 'beta.test');

describe('@hanzo_network/chain-config — neutral injectable chain store', () => {
  beforeEach(() => setChain(ALPHA));

  it('useChain is a plain getter, callable OUTSIDE a React render', () => {
    // If useChain were a real hook, calling it here (no component, no renderer)
    // would throw "invalid hook call" — the exact bug that broke the web app.
    expect(typeof useChain).toBe('function');
    const b = useChain();
    expect(b).toBeTruthy();
    expect(typeof b.chain).toBe('string');
  });

  it('setChain injects the active chain; useChain/getChain return it', () => {
    setChain(ALPHA);
    expect(useChain().chain).toBe('alpha');
    setChain(BETA);
    expect(getChain().chain).toBe('beta');
  });

  it('no bundled brands: registerBrands + getChainFromHostname resolves by host', () => {
    registerBrands([ALPHA, BETA]);
    expect(getChainFromHostname('alpha.test')?.chain).toBe('alpha');
    expect(getChainFromHostname('app.beta.test')?.chain).toBe('beta');
    expect(getChainFromHostname('unknown.example')).toBeUndefined();
  });

  it('each chain config carries its cloud + chain identity', () => {
    expect(ALPHA.inferenceEndpoint).toBeTruthy();
    expect(ALPHA.overlayController).toContain('alpha');
    expect(ALPHA.network.token).toBeTruthy();
  });
});
