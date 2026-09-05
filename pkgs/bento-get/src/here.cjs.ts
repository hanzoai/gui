import { pathToFileURL } from 'node:url'

export const meta = { url: pathToFileURL(__filename).href } as ImportMeta
