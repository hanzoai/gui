export { listen, emit, type UnlistenFn } from './runtime';
export type EventCallback<T> = (e: { payload: T }) => void;
export type Event<T> = { payload: T; event: string };
