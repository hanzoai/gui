import { type ChildProcess, execFileSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { temporaryDirectory } from 'tempy'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { templates } from '../src/templates'

// Both suites below scaffold from a template that lives in another repository,
// so they only mean anything when that repository answers. cloneStarter tries
// https and then ssh, so ask both the same way it does: if neither responds
// there is nothing to scaffold from, and failing here would report someone
// else's unreachable repo as a defect in this CLI.
const starterFree = templates.find((template) => template.value === 'starter-free')!

const answers = (url: string) => {
  try {
    execFileSync('git', ['ls-remote', '--heads', url, starterFree.repo.branch], {
      stdio: 'ignore',
      timeout: 20_000,
      env: {
        ...process.env,
        // a missing repo asks for credentials; never sit on that prompt
        GIT_TERMINAL_PROMPT: '0',
        GIT_SSH_COMMAND: 'ssh -oBatchMode=yes -oStrictHostKeyChecking=accept-new',
      },
    })
    return true
  } catch {
    return false
  }
}

const unreachable =
  !answers(starterFree.repo.url) && !answers(starterFree.repo.sshFallback)

if (unreachable) {
  console.warn(
    `[create-gui] skipping the scaffold suites: ${starterFree.repo.url} answers over neither https nor ssh. ` +
      `Set STARTER_FREE_REPO_SOURCE to a reachable clone to run them.`
  )
}

describe.skipIf(unreachable)('create-gui CLI', () => {
  let tempDir: string
  let cli: ChildProcess
  let projectName: string
  let projectPath: string
  let output: string

  beforeAll(
    async () => {
      tempDir = temporaryDirectory()
      projectName = 'test-project'
      const cliPath = path.join(__dirname, '../dist/index.cjs')
      projectPath = path.join(tempDir, projectName)

      console.info(`Running: node ${cliPath}`)
      console.info(` in dir: ${tempDir}`)
      console.info(` then entering: ${projectName}`)

      cli = spawn('node', [cliPath], {
        cwd: tempDir,
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      output = ''

      cli.stdout?.on('data', (data) => {
        output += data.toString()
        console.info(data.toString()) // Log output for debugging
      })

      cli.stderr?.on('data', (data) => {
        output += data.toString()
        console.error(`ERROR`, data.toString()) // Log errors for debugging
      })

      // Helper function to write input after a delay
      const writeWithDelay = (input: string, delay: number) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            cli.stdin?.write(input)
            resolve()
          }, delay)
        })
      }

      // Simulate user input
      await writeWithDelay(`${projectName}`, 300)
      await writeWithDelay('\r', 300) // Enter
      // Select starter-free template (6th option) - arrow down 5 times then enter
      await writeWithDelay('\x1B[B', 300) // Arrow down
      await writeWithDelay('\x1B[B', 300) // Arrow down
      await writeWithDelay('\x1B[B', 300) // Arrow down
      await writeWithDelay('\x1B[B', 300) // Arrow down
      await writeWithDelay('\x1B[B', 300) // Arrow down
      await writeWithDelay('\r', 500) // Enter

      // Wait for the process to finish
      await new Promise<void>((resolve, reject) => {
        cli.on('exit', (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`CLI process exited with code ${code}`))
          }
        })
      })
    },
    // timeout
    120_000
  )

  afterAll(() => {
    // Clean up the temporary directory after each test
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('should create the project directory', () => {
    expect(fs.existsSync(projectPath)).toBe(true)
  })

  it('should create essential files', () => {
    const essentialFiles = [
      'package.json',
      'tsconfig.json',
      'apps/expo/app.json',
      'packages/config/src/hanzogui.config.ts',
    ]

    essentialFiles.forEach((file) => {
      expect(fs.existsSync(path.join(projectPath, file))).toBe(true)
    })
  })

  it('should prompt for project name', () => {
    expect(output).toContain('Project name:')
  })

  it('should display the selected template', () => {
    expect(output).toContain('Next + Expo')
  })

  it('should provide instructions to visit the project', () => {
    expect(output).toContain('visit your project')
  })

  it('should not contain any errors', () => {
    expect(output).not.toContain('Error:')
  })

  it('should indicate successful project creation', () => {
    expect(output).toContain(`Done! created a new project`)
  })

  it('should display the project name', () => {
    expect(output).toContain(`cd ${projectName}`)
  })

  it('should not contain any git errors', () => {
    expect(output).not.toContain('fatal: not a git repository')
  })
})

describe.skipIf(unreachable)('create-gui CLI with --template flag', () => {
  let tempDir: string
  let cli: ChildProcess
  let projectName: string
  let projectPath: string
  let output: string

  beforeAll(async () => {
    tempDir = temporaryDirectory()
    projectName = 'starter-free-project'
    const cliPath = path.join(__dirname, '../dist/index.cjs')
    projectPath = path.join(tempDir, projectName)

    cli = spawn('node', [cliPath, '--template', 'starter-free'], {
      cwd: tempDir,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    output = ''

    cli.stdout?.on('data', (data) => {
      output += data.toString()
      if (process.env.DEBUG === 'test') {
        console.info(data.toString())
      }
    })

    cli.stderr?.on('data', (data) => {
      output += data.toString()
      if (process.env.DEBUG === 'test') {
        console.error(data.toString())
      }
    })

    // Simulate user input for project name only
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        cli.stdin?.write(`${projectName}\r`)
        resolve()
      }, 1000)
    })

    // Wait for the process to finish
    await new Promise<void>((resolve, reject) => {
      cli.on('exit', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`CLI process exited with code ${code}`))
        }
      })
    })
  }, 60000) // 60 second timeout for the setup

  afterAll(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('should create the project directory', () => {
    expect(fs.existsSync(projectPath)).toBe(true)
  })

  it('should skip the template picker step', () => {
    expect(output).not.toContain('Pick a template:')
  })

  it('should create essential files for starter-free project', () => {
    const essentialFiles = [
      'package.json',
      'tsconfig.json',
      'packages/config/src/hanzogui.config.ts',
    ]

    essentialFiles.forEach((file) => {
      expect(fs.existsSync(path.join(projectPath, file))).toBe(true)
    })
  })

  it('should indicate successful project creation', () => {
    expect(output).toContain(`Done! created a new project`)
    expect(output).toContain(`cd ${projectName}`)
  })

  it('should not contain any errors', () => {
    expect(output).not.toContain('Error:')
  })
})
