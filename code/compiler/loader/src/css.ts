import type { GuiOptions } from '@hanzo/gui-static'
import type { LoaderContext } from 'webpack'

export default function loader(this: LoaderContext<GuiOptions>) {
  this.async()
  const options = { ...this.getOptions() }
  let out = Buffer.from(options.cssData, 'base64').toString('utf-8')
  if (out) {
    // use original JS sourcemap
    return this.callback(null, out || '')
  }
  this.callback({ message: 'No CSS found', name: 'missing_css' })
}
