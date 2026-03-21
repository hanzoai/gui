import { tamaguiPlugin } from '@hanzo/gui-vite-plugin'
import { getConfig } from './getConfig'

Error.stackTraceLimit = Number.POSITIVE_INFINITY

export default getConfig(tamaguiPlugin)
