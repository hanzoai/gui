import type { BrandConfig } from '@hanzo_network/brand-config';

// This app OWNS its brand. The @hanzo/ai SDK bundles no brands; it receives this
// config via <HanzoAI {...brandConfig}/>. Edit values here — nothing brand-
// specific is hardcoded in the SDK.
export const brandConfig: BrandConfig = {
  brand: 'hanzo',
  name: 'Hanzo',
  productName: 'Hanzo Desktop',
  company: 'Hanzo AI',
  identifier: 'com.hanzo.desktop',
  logo: {
    light: 'libs/hanzo-logo/assets/hanzo/hanzo-logo.svg',
    dark: 'libs/hanzo-logo/assets/hanzo/hanzo-logo.svg',
    favicon: 'libs/hanzo-logo/assets/hanzo/hanzo-icon.svg',
  },
  colors: { primary: '#000000', bg: '#000000', fg: '#ffffff' },
  hosts: ['hanzo.ai', 'hanzo.network'],
  storeUrl: {
    mac: 'https://github.com/hanzoai/desktop/releases/latest',
    win: 'https://github.com/hanzoai/desktop/releases/latest',
    ios: '',
    android: '',
  },
  network: {
    rpc: 'https://rpc.hanzo.network',
    chainId: 36900,
    token: '$AI',
    aiMiningPrecompile: '0x0300000000000000000000000000000000000000',
    blockExplorer: 'https://explorer.hanzo.network',
  },
  overlayController: 'https://edge.hanzo.network',
  inferenceEndpoint: 'https://gateway.hanzo.ai',
  iam: {
    baseUrl: 'https://hanzo.id',
    clientId: 'hanzo-app',
    redirectUri: 'hanzo://oauth/hanzo',
    callbackEvent: 'hanzo-iam-callback',
  },
  machinesEnabled: true,
};

export default brandConfig;
