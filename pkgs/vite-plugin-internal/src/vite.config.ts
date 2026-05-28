import { guiPlugin } from '@hanzogui/vite-plugin'
import { getConfig } from './getConfig'

Error.stackTraceLimit = Number.POSITIVE_INFINITY

export default getConfig(guiPlugin)
