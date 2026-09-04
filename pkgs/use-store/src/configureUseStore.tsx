import type { UseStoreConfig } from './interfaces.tsx'

export let configureOpts: UseStoreConfig = {}

export function configureUseStore(opts: UseStoreConfig) {
  configureOpts = opts
}
