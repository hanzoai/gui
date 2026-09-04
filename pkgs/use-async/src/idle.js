import { AbortError } from './errors.js'
import { sleep } from './sleep.js'
const idleCb =
  typeof requestIdleCallback === 'undefined'
    ? (cb) => setTimeout(cb, 1)
    : requestIdleCallback
const idleAsync = () => {
  return new Promise((res) => {
    idleCb(res)
  })
}
export const idle = async (signal, options) => {
  const { max, min, fully } = options || {}
  const idleFn = fully ? fullyIdle : idleAsync
  if (max && min && min < max) {
    await Promise.race([Promise.all([idleFn(), sleep(min)]), sleep(max)])
  } else if (max) {
    await Promise.race([idleFn(), sleep(max)])
  } else if (min) {
    await Promise.all([idleFn(), sleep(min)])
  } else {
    await idleFn()
  }
  if (signal?.aborted) {
    throw new AbortError()
  }
}
const fullyIdle = async (signal) => {
  while (true) {
    const startTime = Date.now()
    await idle(signal)
    const endTime = Date.now()
    const duration = endTime - startTime
    // If idle callback took less than 15ms, consider it truly idle
    if (duration < 15) {
      break
    }
    // Check for abort signal after each iteration
    if (signal?.aborted) {
      throw new AbortError()
    }
  }
}
//# sourceMappingURL=idle.js.map
