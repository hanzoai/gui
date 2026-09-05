import { pathToFileURL } from 'node:url'

// This module's own URL. A require made from it resolves from this package.
export const url = import.meta.url

// A file loaded as a module, the way this emit loads modules.
export const load = (file: string): Promise<Record<string, unknown>> =>
  import(pathToFileURL(file).href)
