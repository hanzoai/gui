import { invoke, isNative } from './runtime';
const lg = (level: string) => async (message: string) => {
  if (isNative()) { try { await invoke('plugin:log|log', { level, message }); return; } catch { /* fall through */ } }
  (console as Record<string, (m: string) => void>)[level === 'warn' ? 'warn' : level === 'error' ? 'error' : 'log']?.(`[hanzo] ${message}`);
};
export const trace = lg('trace'); export const debug = lg('debug');
export const info = lg('info');   export const warn = lg('warn');  export const error = lg('error');
