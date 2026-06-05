// Regression: the invalid-hook-call that blocked the web render. The brand
// store must be PLAIN module getters (not React hooks), because the migrated
// app calls useBrand()/getBrand() from module scope, utils and event handlers.
import { describe, it, expect } from 'vitest';
import {
  setBrand,
  getBrand,
  useBrand,
  getBrandFromHostname,
} from '@hanzo_network/brand-config';

describe('@hanzo_network/brand-config — injectable brand store', () => {
  it('useBrand is a plain getter, callable OUTSIDE a React render', () => {
    // If useBrand were a real hook, calling it here (no component, no renderer)
    // would throw "invalid hook call" — the exact bug that broke the web app.
    expect(typeof useBrand).toBe('function');
    const b = useBrand();
    expect(b).toBeTruthy();
    expect(typeof b.brand).toBe('string');
  });

  it('setBrand injects the active brand; useBrand returns it', () => {
    setBrand(getBrandFromHostname('zoo.network'));
    expect(useBrand().brand).toBe('zoo');
    setBrand(getBrandFromHostname('lux.network'));
    expect(useBrand().brand).toBe('lux');
  });

  it('getBrand never throws (returns env/hostname brand, default hanzo)', () => {
    expect(() => getBrand()).not.toThrow();
    expect(typeof getBrand().brand).toBe('string');
  });

  it('getBrandFromHostname maps hanzo/zoo/lux hosts and defaults to hanzo', () => {
    expect(getBrandFromHostname('hanzo.ai').brand).toBe('hanzo');
    expect(getBrandFromHostname('app.zoo.network').brand).toBe('zoo');
    expect(getBrandFromHostname('lux.cloud').brand).toBe('lux');
    expect(getBrandFromHostname('example.com').brand).toBe('hanzo');
  });

  it('each brand config carries its cloud + chain identity', () => {
    const lux = getBrandFromHostname('lux.network');
    expect(lux.inferenceEndpoint).toBeTruthy();
    expect(lux.overlayController).toContain('lux');
    expect(lux.network.token).toBeTruthy();
  });
});
