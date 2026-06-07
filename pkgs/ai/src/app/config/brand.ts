// Brand-neutral. The active brand comes from the injected/registered config
// (@hanzo_network/brand-config) — never hardcoded here. `BRAND` forwards every
// field access to the active brand, so existing `BRAND.name` / `BRAND.company` /
// `BRAND.productName` call sites read the live brand with no per-file changes.
import { getBrand, type BrandConfig } from '@hanzo_network/brand-config';

export type Brand = BrandConfig;

export const BRAND: BrandConfig = new Proxy({} as BrandConfig, {
  get: (_target, prop) =>
    (getBrand() as unknown as Record<string | symbol, unknown>)[prop],
}) as BrandConfig;

export default BRAND;
