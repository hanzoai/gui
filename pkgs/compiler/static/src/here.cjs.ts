import { pathToFileURL } from 'node:url'

export const url = pathToFileURL(__filename).href

export const load = async (file: string): Promise<Record<string, unknown>> =>
  require(file)
