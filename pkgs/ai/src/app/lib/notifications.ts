import { useBrand } from '@hanzo_network/brand-config';
import {} from '@tauri-apps/api';
import { debug } from '@tauri-apps/plugin-log';
import * as notification from '@tauri-apps/plugin-notification';
import { platform } from '@tauri-apps/plugin-os';

import { BRAND } from '../config/brand';

// Each app serves its own /app-logo.png — use it so notifications show the
// per-app brand mark, not a hardcoded Hanzo icon (was a brand leak on zoo/lux).
const LogoForNotification = '/app-logo.png';

const getPlatformIcon = (platform: string): string => {
  switch (platform) {
    case 'win32': {
      return LogoForNotification;
    }
    case 'darwin': {
      return LogoForNotification;
    }
    default: {
      return LogoForNotification;
    }
  }
};

const { isPermissionGranted, requestPermission, sendNotification } =
  notification;

export const handleSendNotification = async (title?: string, body?: string) => {
  //ask for permission for notification
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    void debug('asking for permission');
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }
  if (permissionGranted) {
    void debug('permission granted, sending notification');
    const icon = getPlatformIcon(await platform());

    const options: notification.Options = {
      title: title ?? useBrand().productName,
      body: body ?? '',
      icon: icon,
    };
    sendNotification(options);
  }
};
