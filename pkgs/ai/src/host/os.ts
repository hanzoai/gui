import { platformName } from './runtime';
export function platform(): string { return platformName() === 'tauri' ? (navigator?.platform?.toLowerCase().includes('win') ? 'windows' : navigator?.platform?.toLowerCase().includes('mac') ? 'macos' : 'linux') : 'web'; }
export function arch(): string { return 'unknown'; }
export function type(): string { return platform(); }
