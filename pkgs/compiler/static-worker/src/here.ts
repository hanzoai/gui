import { fileURLToPath } from 'node:url'

// This module's own URL. A require made from it resolves from this package.
export const url = import.meta.url

// The worker file of the same kind as this emit, so an ESM host runs the ESM worker.
export const worker = fileURLToPath(import.meta.resolve('@hanzogui/static/worker'))
