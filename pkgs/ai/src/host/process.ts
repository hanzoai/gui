import { invoke, isNative } from './runtime';
export async function relaunch() { if (isNative()) await invoke('plugin:process|relaunch'); else location.reload(); }
export async function exit(code = 0) { if (isNative()) await invoke('plugin:process|exit', { code }); }
