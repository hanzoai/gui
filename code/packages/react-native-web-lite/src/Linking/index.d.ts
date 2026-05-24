/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
type Callback = (...args: any) => void;
type OnOpenCallback = (event: 'onOpen', callback: (url: string) => void) => void;
type GenericCallback = (event: string, callback: Callback) => void;
declare class Linking {
    /**
     * An object mapping of event name
     * and all the callbacks subscribing to it
     */
    _eventCallbacks: {
        [key: string]: Array<Callback>;
    };
    _dispatchEvent(event: string, ...data: any): void;
    /**
     * Adds a event listener for the specified event. The callback will be called when the
     * said event is dispatched.
     */
    addEventListener: OnOpenCallback | GenericCallback;
    /**
     * Removes a previously added event listener for the specified event. The callback must
     * be the same object as the one passed to `addEventListener`.
     */
    removeEventListener: OnOpenCallback | GenericCallback;
    canOpenURL(): Promise<boolean>;
    getInitialURL(): Promise<string>;
    /**
     * Try to open the given url in a secure fashion. The method returns a Promise object.
     * If a target is passed (including undefined) that target will be used, otherwise '_blank'.
     * If the url opens, the promise is resolved. If not, the promise is rejected.
     * Dispatches the `onOpen` event if `url` is opened successfully.
     */
    openURL(url: string, target?: string): Promise<object | void>;
    _validateURL(url: string): void;
}
declare const LinkingInstance: Linking;
export { LinkingInstance as Linking };
