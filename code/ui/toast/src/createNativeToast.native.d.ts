import type { CreateNativeToastsFn, HideNativeToastsFn } from './types';
export declare const createNativeToast: CreateNativeToastsFn;
export declare const hideNativeToast: HideNativeToastsFn;
export declare function requestNotificationPermission(): Promise<null>;
