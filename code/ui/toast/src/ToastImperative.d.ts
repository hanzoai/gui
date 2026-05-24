import type { NativePlatform, NativeValue } from '@hanzogui/core';
import React from 'react';
import type { CreateNativeToastOptions } from './types';
export interface ToastImperativeOptions extends Omit<CreateNativeToastOptions, 'message'> {
    /**
     * Will show a native toast if is true or is set to the current platform. On iOS, it wraps `SPIndicator` and `SPAlert`. On Android, it wraps `ToastAndroid`. On web, it wraps Notification API. Mobile's native features are handled by `burnt`.
     */
    native?: NativeValue;
}
/**
 * Override this in your application to get custom toast fields.
 *
 * e.g.
 * ```ts
 * declare module '@hanzogui/toast' {
 *   interface CustomData {
 *     preset: 'error' | 'success'
 *     isUrgent: true
 *   }
 * }
 *```
 * You will get auto-completion:
 * ```ts
 * toast.show("Message", { preset: 'error', isUrgent: true })
 * ```
 */
export interface CustomData {
    [key: string]: any;
}
export declare const useToastController: () => any;
export declare const useToastState: () => any;
/** @deprecated use `useToastController` and `useToastState` instead to avoid performance pitfalls */
export declare const useToast: () => any;
interface ToastImperativeProviderProps {
    children: React.ReactNode;
    /**
     * Used to provide defaults to imperative API. Options can be overwritten when calling `show()`.
     */
    options: ToastImperativeOptions;
}
export declare const ToastImperativeProvider: ({ children, options, }: ToastImperativeProviderProps) => import("react/jsx-runtime").JSX.Element;
export type { NativePlatform, NativeValue, ToastImperativeProviderProps };
