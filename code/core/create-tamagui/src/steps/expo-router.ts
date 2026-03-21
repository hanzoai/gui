import chalk from 'chalk'

import type { ExtraSteps } from './types'

const packageManager = 'bun'

const runCommand = (scriptName: string) => `${packageManager} run ${scriptName}`

const main: ExtraSteps = async ({ isFullClone, projectName }) => {
  if (isFullClone) {
    console.info(`
  ${chalk.green.bold('Done!')} created a new project under ./${projectName}

visit your project:
  ${chalk.green('cd')} ${projectName}
`)
  }
}

export default main
