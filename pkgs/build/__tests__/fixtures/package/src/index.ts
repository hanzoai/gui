import { platform } from './platform.ts'

export { platform }

export const greet = (name: string): string => `Hello, ${name}, from ${platform}`
