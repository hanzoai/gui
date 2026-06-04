import { invoke, isNative } from './runtime';
export async function getVersion(): Promise<string> { if (isNative()) { try { return (await invoke('plugin:app|version')) as string; } catch { /* */ } } return '0.0.0-web'; }
export async function getName(): Promise<string> { return 'Hanzo'; }
