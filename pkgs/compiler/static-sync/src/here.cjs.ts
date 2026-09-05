import { pathToFileURL } from 'node:url'

export const url = pathToFileURL(__filename).href

export const worker = require.resolve('@hanzogui/static/worker')
