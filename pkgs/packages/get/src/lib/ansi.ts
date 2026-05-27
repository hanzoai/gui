const ESC = '\x1b['
const isTTY = process.stdout.isTTY === true
const wrap = (open: number, close: number) => (s: string) =>
  isTTY ? `${ESC}${open}m${s}${ESC}${close}m` : s

export const bold = wrap(1, 22)
export const dim = wrap(2, 22)
export const red = wrap(31, 39)
export const green = wrap(32, 39)
export const yellow = wrap(33, 39)
export const cyan = wrap(36, 39)
export const gray = wrap(90, 39)
