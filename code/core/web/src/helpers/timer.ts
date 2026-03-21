const timer = require('@hanzo/gui-timer').timer()

setTimeout(() => {
  timer.print()
}, 2000)

export const time = timer.start({
  quiet: true,
})
