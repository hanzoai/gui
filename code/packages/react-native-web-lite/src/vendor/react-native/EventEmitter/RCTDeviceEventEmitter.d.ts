export default RCTDeviceEventEmitter;
/**
 * Global EventEmitter used by the native platform to emit events to JavaScript.
 * Events are identified by globally unique event names.
 *
 * NativeModules that emit events should instead subclass `NativeEventEmitter`.
 */
export const RCTDeviceEventEmitter: EventEmitter;
import { EventEmitter } from '../emitter/EventEmitter';
