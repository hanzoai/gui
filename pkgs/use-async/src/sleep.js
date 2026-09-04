import { AbortError } from './errors.js'
export const sleep = async (ms, signal) => {
  await new Promise((res) => setTimeout(res, ms))
  if (signal?.aborted) {
    throw new AbortError()
  }
}
//# sourceMappingURL=sleep.js.map
