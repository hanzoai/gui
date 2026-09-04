// adopted from https://github.com/franciscop/use-async/blob/master/src/index.js
import { useEffect, useLayoutEffect } from 'react';
import { AbortError } from './errors.js';
const DEBUG_LEVEL = 0; // You can adjust this based on your needs
export function useAsyncEffect(cb, deps = []) {
    useAsyncEffectOfType(useEffect, cb, deps);
}
export function useAsyncLayoutEffect(cb, deps = []) {
    useAsyncEffectOfType(useLayoutEffect, cb, deps);
}
export function useAsyncEffectOfType(type, cb, deps = []) {
    type(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        // wrap in try in case its not async (for simple use cases)
        try {
            const value = cb(signal, ...deps);
            Promise.resolve(value)
                .then(async (res) => {
                if (res && typeof res === 'function') {
                    if (signal.aborted)
                        return res();
                    signal.addEventListener('abort', res);
                }
            })
                .catch(handleError);
        }
        catch (error) {
            handleError(error);
        }
        function handleError(error) {
            if (error instanceof AbortError) {
                if (DEBUG_LEVEL > 2) {
                    console.info(`🐛 useAsyncEffect aborted: ${error.message}`);
                }
                return null;
            }
            // JS handles aborting a promise as an error. Thus, ignore them since they're a normal part
            // of the expected async workflow
            if (typeof error === 'object' && error.name === 'AbortError') {
                return null;
            }
            // Real errors, bubble it up since the CB is expected to handle the
            // errors by itself, so this is like a "fatal error" that should've
            // been handled by the devs
            throw error;
        }
        return () => {
            if (signal.aborted)
                return;
            controller.abort();
        };
    }, deps);
}
//# sourceMappingURL=useAsyncEffect.js.map