// The build-time environment a bundler inlines for a module, read as the
// member expression bundlers substitute.
export const env = (
  import.meta as unknown as { env?: Record<string, string | undefined> }
).env
