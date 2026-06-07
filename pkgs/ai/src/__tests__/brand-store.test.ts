// Regression: the invalid-hook-call that blocked the web render. The brand
// store must be PLAIN module getters (not React hooks), because the migrated
// app calls useBrand()/getBrand() from module scope, utils and event handlers.
//
// Neutral by construction: this test uses FIXTURE brands (not hanzo/zoo/lux) —
// the package bundles no brands; hosts provide their own via setBrand/registerBrands.
import { describe, it, expect, beforeEach } from 'vitest';
import {
  setBrand,
  getBrand,
  useBrand,
  getBrandFromHostname,
  registerBrands,
  type BrandConfig,
} from '@hanzo_network/brand-config';

const fixture = (id: string, host: string): BrandConfig => ({
  brand: id,
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

describe('@hanzo_network/brand-config — neutral injectable brand store', () => {
  beforeEach(() => setBrand(ALPHA));

  it('useBrand is a plain getter, callable OUTSIDE a React render', () => {
    // If useBrand were a real hook, calling it here (no component, no renderer)
    // would throw "invalid hook call" — the exact bug that broke the web app.
    expect(typeof useBrand).toBe('function');
    const b = useBrand();
    expect(b).toBeTruthy();
    expect(typeof b.brand).toBe('string');
  });

  it('setBrand injects the active brand; useBrand/getBrand return it', () => {
    setBrand(ALPHA);
    expect(useBrand().brand).toBe('alpha');
    setBrand(BETA);
    expect(getBrand().brand).toBe('beta');
  });

  it('no bundled brands: registerBrands + getBrandFromHostname resolves by host', () => {
    registerBrands([ALPHA, BETA]);
    expect(getBrandFromHostname('alpha.test')?.brand).toBe('alpha');
    expect(getBrandFromHostname('app.beta.test')?.brand).toBe('beta');
    expect(getBrandFromHostname('unknown.example')).toBeUndefined();
  });

  it('each brand config carries its cloud + chain identity', () => {
    expect(ALPHA.inferenceEndpoint).toBeTruthy();
    expect(ALPHA.overlayController).toContain('alpha');
    expect(ALPHA.network.token).toBeTruthy();
  });
});
