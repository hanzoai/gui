/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import EventEmitter from '../vendor/react-native/emitter/_EventEmitter';
import type { Task } from './TaskQueue';
type EventSubscription = any;
declare const _emitter: EventEmitter;
declare const InteractionManager: {
    Events: {
        interactionStart: string;
        interactionComplete: string;
    };
    /**
     * Schedule a function to run after all interactions have completed.
     */
    runAfterInteractions(task?: Task): {
        then: Function;
        done: Function;
        cancel: Function;
    };
    /**
     * Notify manager that an interaction has started.
     */
    createInteractionHandle(): number;
    /**
     * Notify manager that an interaction has completed.
     */
    clearInteractionHandle(handle: number): void;
    addListener: (...args: Parameters<typeof _emitter.addListener>) => EventSubscription;
    /**
     *
     * @param deadline
     */
    setDeadline(deadline: number): void;
};
export { InteractionManager };
