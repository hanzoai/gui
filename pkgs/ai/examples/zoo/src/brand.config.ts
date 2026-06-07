import type { BrandConfig } from '@hanzo_network/brand-config';

// This app OWNS its brand. The @hanzo/ai SDK bundles no brands; it receives this
// config via <HanzoAI {...brandConfig}/>. Edit values here — nothing brand-
// specific is hardcoded in the SDK.
export const brandConfig: BrandConfig = {
  brand: 'zoo',
  name: 'Zoo',
  productName: 'Zoo Desktop',
  company: 'Zoo Labs',
  identifier: 'com.zoo.desktop',
  logo: {
    light: 'libs/hanzo-logo/assets/zoo/zoo-logo.svg',
    dark: 'libs/hanzo-logo/assets/zoo/zoo-logo.svg',
    favicon: 'libs/hanzo-logo/assets/zoo/zoo-icon.svg',
  },
  colors: { primary: '#000000', bg: '#000000', fg: '#ffffff' },
  hosts: ['zoo.ngo', 'zoo.network', 'zoo.cloud'],
  storeUrl: {
    mac: 'https://github.com/zooai/desktop/releases/latest',
    win: 'https://github.com/zooai/desktop/releases/latest',
    ios: '',
    android: '',
  },
  network: {
    rpc: 'https://rpc.zoo.network',
    chainId: 200200,
    token: '$ZOO',
    aiMiningPrecompile: '0x0300000000000000000000000000000000000000',
    blockExplorer: 'https://explorer.zoo.network',
  },
  overlayController: 'https://edge.zoo.cloud',
  inferenceEndpoint: 'https://gateway.hanzo.ai',
  iam: {
    baseUrl: 'https://zoolabs.id',
    clientId: 'zoo-app',
    redirectUri: 'zoo://oauth/zoo',
    callbackEvent: 'zoo-iam-callback',
  },
  machinesEnabled: true,
};

export default brandConfig;
