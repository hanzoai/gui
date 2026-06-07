import type { BrandConfig } from '@hanzo_network/brand-config';

// This app OWNS its brand. The @hanzo/ai SDK bundles no brands; it receives this
// config via <HanzoAI {...brandConfig}/>. Edit values here — nothing brand-
// specific is hardcoded in the SDK.
export const brandConfig: BrandConfig = {
  brand: 'lux',
  name: 'Lux',
  productName: 'Lux Desktop',
  company: 'Lux Partners',
  identifier: 'com.lux.desktop',
  logo: {
    light: 'libs/hanzo-logo/assets/lux/lux-logo.svg',
    dark: 'libs/hanzo-logo/assets/lux/lux-logo.svg',
    favicon: 'libs/hanzo-logo/assets/lux/lux-icon.svg',
  },
  colors: { primary: '#000000', bg: '#000000', fg: '#ffffff' },
  hosts: ['lux.network', 'lux.cloud', 'lux.exchange', 'lux.ai'],
  storeUrl: {
    mac: 'https://github.com/luxfi/desktop/releases/latest',
    win: 'https://github.com/luxfi/desktop/releases/latest',
    ios: '',
    android: '',
  },
  network: {
    rpc: 'https://api.lux.network',
    chainId: 96369,
    token: '$LUX',
    aiMiningPrecompile: '0x0300000000000000000000000000000000000000',
    blockExplorer: 'https://explorer.lux.network',
  },
  overlayController: 'https://edge.lux.cloud',
  inferenceEndpoint: 'https://gateway.hanzo.ai',
  iam: {
    baseUrl: 'https://lux.id',
    clientId: 'lux-app',
    redirectUri: 'lux://oauth/lux',
    callbackEvent: 'lux-iam-callback',
  },
  machinesEnabled: true,
};

export default brandConfig;
