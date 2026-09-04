import { hanzoguiPlugin } from '@hanzogui/vite-plugin'
import { getConfig } from './getConfig.ts'

Error.stackTraceLimit = Number.POSITIVE_INFINITY

export default getConfig(hanzoguiPlugin)
