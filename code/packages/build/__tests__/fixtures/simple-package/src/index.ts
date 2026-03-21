export { nestedHello } from './nested'

export const greet = (name: string): string => {
  return `Hello, ${name}!`
}

export const paltformGreeter = (name: string): string => {
  let salutation
  process.env.HANZO_GUI_TARGET === 'web' ? (salutation = 'Hi') : (salutation = 'Hello')
  process.env.HANZO_GUI_TARGET === 'native' ? (salutation = 'Hey') : (salutation = 'Hello')
  return `${salutation}, ${name}!`
}
