export { nestedHello } from './nested'

export const greet = (name: string): string => {
  return `Hello, ${name}!`
}

export const paltformGreeter = (name: string): string => {
  let salutation
  process.env.GUI_TARGET === 'web' ? (salutation = 'Hi') : (salutation = 'Hello')
  process.env.GUI_TARGET === 'native' ? (salutation = 'Hey') : (salutation = 'Hello')
  return `${salutation}, ${name}!`
}

export function runNativeSideEffect(items: string[]) {
  items.push('ran')
}

export function guardNativeSideEffects(items: string[], debug?: string) {
  runNativeSideEffect(items)

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    console.log(items.length)
  }

  return items
}

export function getPlatformMarker() {
  return process.env.GUI_TARGET === 'native' ? 'native-only-marker' : 'web-only-marker'
}

export function applyNativeLogicalMarker(items: string[]) {
  process.env.GUI_TARGET === 'native' && items.push('native-logical-marker')
  process.env.GUI_TARGET !== 'native' && items.push('web-logical-marker')

  return items
}
