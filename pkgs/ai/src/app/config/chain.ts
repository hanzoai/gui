// Brand-neutral. Kept as a thin compatibility alias over the active brand
// config (@hanzo_network/brand-config) — never hardcoded here.
import { getBrand, type BrandConfig } from '@hanzo_network/brand-config';

export type Chain = BrandConfig;

export const BRAND: BrandConfig = new Proxy({} as BrandConfig, {
  get: (_target, prop) =>
    (getBrand() as unknown as Record<string | symbol, unknown>)[prop],
}) as BrandConfig;

export default BRAND;
