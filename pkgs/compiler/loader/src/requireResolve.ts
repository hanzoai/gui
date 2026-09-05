import { createRequire } from 'node:module'
import { url } from './here.ts'

export const requireResolve = createRequire(url).resolve
